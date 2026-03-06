"use client";
import { useEffect } from "react";
import "./globals.css";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/Landing");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
