import { AppBskyEmbedRecord, AppBskyFeedPost } from "@atproto/api";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";

import { buildPostUrl } from "@/src/app/post/lib/buildPostUrl";
import Avatar from "@/src/app/user/components/Avatar";

import styles from "./EmbeddedRecord.module.scss";

type Props = {
  record: AppBskyEmbedRecord.ViewRecord;
  isLink?: boolean;
  className?: string;
};

export default function EmbeddedRecord({
  record,
  isLink = true,
  className,
}: Props) {
  const navigate = useNavigate();
  const author = record.author;
  const post = record.value;
  if (!AppBskyFeedPost.isRecord(post)) {
    return null;
  }
  const postUrl = buildPostUrl({
    handle: author.handle,
    uri: record.uri,
  });

  const handleClickBackground: React.MouseEventHandler = (e) => {
    e.stopPropagation();
    if (isLink) navigate(postUrl);
  };

  return (
    <article
      onClick={handleClickBackground}
      className={clsx(styles.container, isLink && styles.link, className)}
    >
      {isLink && (
        <Link to={postUrl} className={styles.focusLink}>
          引用された投稿の詳細
        </Link>
      )}
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <Avatar profile={author} className={styles.avatar} />
        </div>
        {author.displayName && (
          <Link
            to={`/${author.handle}`}
            onClick={(e) => e.stopPropagation()}
            className={styles.displayName}
          >
            {author.displayName}
          </Link>
        )}
        <span className={styles.handle}>@{author.handle}</span>
      </div>
      <p className={styles.body}>{post.text}</p>
    </article>
  );
}
