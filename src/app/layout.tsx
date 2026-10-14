import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Meal Tracker",
  description: "Track what you eat",
};

// <Show> reads the request's auth state, so it must render inside <Suspense>
// to keep the rest of the layout in the static shell (cacheComponents).
function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton>
          <button className="h-9 rounded-full px-4 text-sm font-medium transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.08]">
            Sign in
          </button>
        </SignInButton>
        <SignUpButton>
          <button className="h-9 rounded-full bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]">
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider>
          <header className="flex h-16 items-center justify-between border-b border-black/[.08] px-6 dark:border-white/[.145]">
            <Link href="/" className="font-semibold tracking-tight">
              Meal Tracker
            </Link>
            <nav className="flex items-center gap-2">
              <Suspense fallback={<div className="h-9 w-40" />}>
                <AuthControls />
              </Suspense>
            </nav>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
