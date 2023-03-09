import {
  AtpSessionData,
  AppBskyActorProfile,
  AppBskyFeedFeedViewPost,
} from "@atproto/api";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import React from "react";
import {
  LoaderFunction,
  Outlet,
  redirect,
  useLoaderData,
  ScrollRestoration,
} from "react-router-dom";

import Header from "@/src/components/Header";
import { atp, bsky } from "@/src/lib/atp/atp";

import styles from "./Layout.module.scss";

export const loader = (async () => {
  if (!atp.hasSession) {
    const sessionStr = localStorage.getItem("session");
    if (!sessionStr) return redirect("/login");
    const session = JSON.parse(sessionStr) as AtpSessionData;
    await atp.resumeSession(session);
  }
  const resp = await bsky.actor.getProfile({
    actor: atp.session!.handle,
  });
  return resp.data;
}) satisfies LoaderFunction;

export const element = <RootLayout />;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
      cacheTime: 60 * 60 * 24 * 1000,
    },
  },
});
const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});

function RootLayout() {
  // TODO: can't use ReturnType as the loader is returning `redirect()`
  const profile = useLoaderData() as AppBskyActorProfile.View;
  const [composerOpen, setComposerOpen] = React.useState(false);
  const [replyTarget, setReplyTarget] =
    React.useState<AppBskyFeedFeedViewPost.Main>();

  const appContext: RootContext = {
    myProfile: profile,
    composer: {
      open: composerOpen,
      setOpen: setComposerOpen,
      replyTarget,
      setReplyTarget,
      handleClickCompose: () => {
        setReplyTarget(undefined);
        setComposerOpen(true);
      },
      handleClickReply: (feedItem) => {
        setReplyTarget(feedItem);
        setComposerOpen(true);
      },
    },
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollRestoration />
      <div className={styles.container}>
        <Header profile={profile} />
        <main>
          <Outlet context={appContext} />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export type RootContext = {
  myProfile: AppBskyActorProfile.View;
  composer: {
    open: boolean;
    setOpen: (val: boolean) => void;
    replyTarget?: AppBskyFeedFeedViewPost.Main;
    setReplyTarget: (feedItem: RootContext["composer"]["replyTarget"]) => void;
    handleClickCompose: () => void;
    handleClickReply: RootContext["composer"]["setReplyTarget"];
  };
};
