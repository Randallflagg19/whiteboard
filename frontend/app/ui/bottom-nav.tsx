"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type IconName = "today" | "whiteboard" | "streak" | "inbox";

function NavIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    today: <path d="m3 10 9-7 9 7v10H8v-7h8v7" />,
    whiteboard: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M12 3v18M7.5 7h1M7.5 11h1M15.5 7h1M15.5 11h1" />
      </>
    ),
    streak: <path d="m3 14 5-5 3 3 8-8 2 2-10 14-3-5-5 2z" />,
    inbox: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const onToday = pathname.startsWith("/today");
  const onWhiteboard = pathname.startsWith("/whiteboard");
  const onInbox = pathname.startsWith("/inbox");

  return (
    <nav className="bottom-nav" aria-label="Основная навигация">
      <Link className={`nav-item ${onToday ? "nav-item-active" : ""}`} href="/today" aria-current={onToday ? "page" : undefined}><NavIcon name="today" /><span>Сегодня</span></Link>
      <Link className={`nav-item ${onWhiteboard ? "nav-item-active" : ""}`} href="/whiteboard" aria-current={onWhiteboard ? "page" : undefined}><NavIcon name="whiteboard" /><span>Whiteboard</span></Link>
      <span className="nav-item nav-item-disabled"><NavIcon name="streak" /><span>Streak</span></span>
      <Link className={`nav-item ${onInbox ? "nav-item-active" : ""}`} href="/inbox" aria-current={onInbox ? "page" : undefined}><NavIcon name="inbox" /><span>Входящие</span></Link>
    </nav>
  );
}
