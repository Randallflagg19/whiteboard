import type { Metadata } from "next";
import { BottomNav } from "./ui/bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: "WhiteBoard",
  description: "Личные задачи и заметки",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="app-shell">
          <main className="app-main">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
