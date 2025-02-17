import { useQueryClient } from "@tanstack/react-query";
import {
  Link,
  useLocation,
  useNavigation,
  useRevalidator,
} from "react-router-dom";

import NotificationButton from "@/src/app/notification/components/NotificationButton";
import DropdownMenu from "@/src/app/root/components/DropdownMenu";
import { queryKeys } from "@/src/app/root/lib/queryKeys";
import { reloadTimelineForNewPosts } from "@/src/app/timeline/lib/reloadTimelineForNewPosts";
import LogoIcon from "@/src/assets/icon.svg";

import styles from "./Header.module.scss";

export default function Header() {
  const { state: navState } = useNavigation();
  const { state: revalidateState } = useRevalidator();
  const progressBusy = navState === "loading" || revalidateState === "loading";
  const queryClient = useQueryClient();
  const location = useLocation();
  const handleClickLogo = () => {
    if (location.pathname === "/") {
      reloadTimelineForNewPosts(queryClient, queryKeys.feed.home.$);
    }
  };

  return (
    <header className={styles.container}>
      <div className={styles.progressBar}>
        {progressBusy && (
          <div role="status">
            <span className="visually-hidden">
              次のページのデータを取得中・・・
            </span>
          </div>
        )}
      </div>
      <div className={styles.sectionStart}>
        <Link to="/" onClick={handleClickLogo} className={styles.logo}>
          <LogoIcon />
          <span className={styles.logo__text}>Flat</span>
        </Link>
      </div>
      <div className={styles.sectionEnd}>
        <NotificationButton />
        <DropdownMenu />
      </div>
    </header>
  );
}
