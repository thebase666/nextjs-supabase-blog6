import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { CreatePostForm } from "@/app/create/form";

export default async function CreatePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 right-1/4 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[100px] animate-glow-pulse" />
        <div
          className="absolute top-60 left-1/5 h-[300px] w-[300px] rounded-full bg-pink/6 blur-[80px] animate-glow-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 py-16">
        <header className="mb-10 animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3 py-1">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 7.5L2 12l4.5-1L12 5.5 8.5 2 3 7.5z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber"
              />
              <path
                d="M8.5 2l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="text-amber"
              />
            </svg>
            <span className="text-xs font-medium text-accent">New Post</span>
          </div>
          <h1 className="font-(family-name:--font-newsreader) text-4xl font-medium italic tracking-tight text-wrap-balance sm:text-5xl">
            <span className="bg-linear-to-r from-text via-accent to-pink bg-clip-text text-transparent">
              Write a New Post
            </span>
          </h1>
          <p className="mt-3 text-text-secondary">
            Share your thoughts with the community.
          </p>
        </header>
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <CreatePostForm />
        </div>
      </div>
    </main>
  );
}
