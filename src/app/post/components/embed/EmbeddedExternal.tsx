import { AppBskyEmbedExternal } from "@atproto/api";
import clsx from "clsx";

import styles from "./EmbeddedExternal.module.scss";

type Props = {
  external: AppBskyEmbedExternal.ViewExternal;
  className?: string;
};

export default function EmbeddedExternal({ external, className }: Props) {
  let hostname = "";
  try {
    hostname = new URL(external.uri).hostname;
  } catch (e) {
    console.error(e);
  }
  return (
    <article className={clsx(styles.container, className)}>
      <a
        href={external.uri}
        rel="noopener noreferrer"
        target="_blank"
        onClick={(e) => e.stopPropagation()}
        className={clsx("clickable-overlay", styles.title)}
      >
        {external.title || "No title"}
      </a>
      <div className={clsx(styles.description)}>{external.description}</div>
      <div className={styles.host}>
        <span className={styles.host__favicon}>
          <img
            src={`https://www.google.com/s2/favicons?sz=32&domain_url=${external.uri}`}
          />
        </span>
        <span className={clsx(styles.host__text)}>{hostname}</span>
      </div>
    </article>
  );
}
