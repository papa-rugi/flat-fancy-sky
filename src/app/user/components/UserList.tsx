import {
  useInfiniteQuery,
  type QueryKey,
  type QueryFunction,
  useQueryClient,
} from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";

import type { AppBskyActorDefs } from "@atproto/api";

import UserListItem from "@/src/app/user/components/UserListItem";
import SpinnerFill from "@/src/components/SpinnerFill";

import styles from "./UserList.module.scss";

export type UserListQueryFn<K extends QueryKey> = QueryFunction<
  {
    cursor?: string;
    users: AppBskyActorDefs.ProfileViewDetailed[];
  },
  K
>;

type Props<K extends QueryKey> = {
  queryKey: K;
  queryFn: UserListQueryFn<K>;
  className?: string;
};

export function UserList<K extends QueryKey>({
  queryKey,
  queryFn,
  className,
}: Props<K>) {
  const {
    status,
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam: (lastPage) => {
      return lastPage.cursor ? { cursor: lastPage.cursor } : undefined;
    },
    refetchOnMount: false,
  });
  const queryClient = useQueryClient();
  const revalidate = () => void queryClient.invalidateQueries(queryKey);

  const allItems = data?.pages.flatMap((p) => p.users) ?? [];

  if (status === "loading") {
    return <SpinnerFill />;
  } else if (status === "error") {
    return <span>Error: {(error as Error).message}</span>;
  }

  return (
    <>
      <InfiniteScroll
        pageStart={0}
        loadMore={() => !isFetchingNextPage && fetchNextPage()}
        hasMore={hasNextPage}
        loader={<SpinnerFill key="__loader" />}
        className={className}
      >
        <>
          {allItems.map((item) => (
            <UserListItem
              user={item}
              revalidate={revalidate}
              key={item.did}
              className={styles.item}
            />
          ))}
          {!hasNextPage && (
            <div className={styles.noMore} key="__noMore">
              nothing more to show...
            </div>
          )}
        </>
      </InfiniteScroll>
    </>
  );
}
