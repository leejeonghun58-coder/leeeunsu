import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "우리 아들 특별한 이은수",
  description: "은수의 그림, 취미 그리고 소중한 순간들을 기록하는 공간",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko"><body>{children}</body></html>
  );
}
