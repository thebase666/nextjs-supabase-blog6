import type { Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Blog",
  description: "A simple blog built with Next.js, Clerk, and Supabase",
  other: {
    "theme-color": "#f8f7ff",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={{
            variables: {
              colorBackground: "#ffffff",
              colorText: "#1a1630",
              colorPrimary: "#6c5ce7",
              colorInputBackground: "#f8f7ff",
              colorInputText: "#1a1630",
            },
          }}
        >
          <header className="sticky top-0 z-50 border-b border-border-subtle bg-surface/80 backdrop-blur-2xl">
            <nav
              className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6"
              aria-label="Main navigation"
            >
              <Link
                href="/"
                className="group flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-accent via-pink to-amber shadow-md shadow-accent/15">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2 3h10M2 7h7M2 11h9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-(family-name:--font-newsreader) text-xl font-medium italic tracking-tight bg-linear-to-r from-accent via-pink to-amber bg-clip-text text-transparent transition-opacity duration-200 group-hover:opacity-70">
                  Blog
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <Show when="signed-in">
                  <Link
                    href="/create"
                    className="group inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-accent to-pink px-4 py-2 text-sm font-medium text-white shadow-md shadow-accent/15 transition-shadow duration-200 hover:shadow-lg hover:shadow-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:rotate-90"
                    >
                      <path
                        d="M7 1v12M1 7h12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    Write
                  </Link>
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8 ring-2 ring-border",
                      },
                    }}
                  />
                </Show>
                <Show when="signed-out">
                  <SignInButton mode="modal" />
                  <SignUpButton mode="modal" />
                </Show>
              </div>
            </nav>
          </header>

          <div className="flex-1">{children}</div>

          <footer className="relative overflow-hidden border-t border-border-subtle">
            <div className="absolute inset-0 bg-linear-to-t from-accent/3 to-transparent" aria-hidden="true" />
            <div className="relative mx-auto max-w-5xl px-6 py-10">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-br from-accent/15 to-pink/15">
                    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 3h10M2 7h7M2 11h9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-accent" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-text-muted">Blog</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <span>Built with</span>
                  <span className="font-medium text-blue">Next.js</span>
                  <span aria-hidden="true" className="text-border">&middot;</span>
                  <span className="font-medium text-emerald">Clerk</span>
                  <span aria-hidden="true" className="text-border">&middot;</span>
                  <span className="font-medium text-cyan">Supabase</span>
                </div>
              </div>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  );
}
