import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/posts";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-32 left-1/3 h-[400px] w-[400px] rounded-full bg-accent/8 blur-[100px] animate-glow-pulse" />
        <div className="absolute top-40 right-1/4 h-[300px] w-[300px] rounded-full bg-pink/6 blur-[80px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 py-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm text-text-muted shadow-sm transition-[border-color,color,box-shadow] duration-200 hover:border-accent/30 hover:text-text hover:shadow-md hover:shadow-accent/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg animate-fade-in"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          >
            <path
              d="M8 3L3 7l5 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to Posts
        </Link>

        <article className="mt-10 animate-slide-up">
          <header>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3 py-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 3h8M2 6h5M2 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-accent" />
              </svg>
              <span className="text-xs font-medium text-accent">Article</span>
            </div>

            <h1 className="font-(family-name:--font-newsreader) text-4xl font-medium leading-tight tracking-tight text-wrap-balance sm:text-5xl">
              <span className="bg-linear-to-r from-text via-text to-accent bg-clip-text text-transparent">
                {post.title}
              </span>
            </h1>

            {/* Author card */}
            <div className="mt-6 inline-flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-accent/15 to-pink/15">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="5.5" r="3" stroke="currentColor" strokeWidth="1.2" className="text-accent" />
                  <path d="M2 15c0-3 2.7-5 6-5s6 2 6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-accent" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-text">{post.author_name}</p>
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                    <path d="M6 3v3.5l2 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
                </div>
              </div>
            </div>
          </header>

          {post.image_url && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-border shadow-sm">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="my-10 h-px bg-linear-to-r from-transparent via-accent/20 to-transparent" aria-hidden="true" />

          <div className="whitespace-pre-wrap text-base leading-[1.85] text-text-secondary">
            {post.content}
          </div>
        </article>
      </div>
    </main>
  );
}
