import Link from "next/link";
import { getPosts } from "@/lib/posts";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <main className="relative overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-20 right-1/6 h-[400px] w-[400px] rounded-full bg-pink/8 blur-[100px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/6 h-[300px] w-[300px] rounded-full bg-blue/6 blur-[80px] animate-glow-pulse" style={{ animationDelay: "3s" }} />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-6 py-16">
        {/* Hero header */}
        <header className="mb-16 animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-3 py-1">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 1l1.5 3.5L12 6l-3.5 1.5L7 11 5.5 7.5 2 6l3.5-1.5L7 1z" fill="currentColor" className="text-amber" />
            </svg>
            <span className="text-xs font-medium text-accent">Community Blog</span>
          </div>
          <h1 className="font-(family-name:--font-newsreader) text-5xl font-medium italic tracking-tight text-wrap-balance sm:text-6xl">
            <span className="bg-linear-to-r from-text via-accent to-pink bg-clip-text text-transparent">
              All Posts
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-text-secondary">
            Read the latest articles from our community.
            <span className="text-text-muted"> Discover ideas, share knowledge.</span>
          </p>
        </header>

        {posts.length === 0 ? (
          <div className="animate-slide-up rounded-2xl border border-dashed border-border bg-linear-to-br from-surface via-surface to-accent/5 px-6 py-24 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-accent/15 to-pink/15 shadow-md shadow-accent/10">
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M5 7h18M5 12h14M5 17h16M5 22h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  className="text-accent"
                />
              </svg>
            </div>
            <p className="text-xl font-medium text-text">No posts yet</p>
            <p className="mt-2 text-sm text-text-muted">
              Be the first to share something with the community.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="group block animate-slide-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border/80 bg-surface shadow-sm transition-[border-color,box-shadow] duration-300 ease-out hover:border-accent/30 hover:shadow-lg hover:shadow-accent/8">
                  <div className="relative flex flex-1 flex-col p-6">
                    {/* Hover gradient overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-r from-accent/3 via-transparent to-pink/3 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

                    <div className="relative flex items-start justify-between gap-6">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-br from-accent/12 to-blue/12">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                              <path d="M2 3h8M2 6h5M2 9h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-accent" />
                            </svg>
                          </div>
                          <span className="text-xs font-medium text-text-muted">Article</span>
                        </div>
                        <h2 className="font-(family-name:--font-newsreader) text-xl font-medium tracking-tight text-text transition-colors duration-200 group-hover:text-accent">
                          {post.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-text-muted">
                          {post.content}
                        </p>
                        {post.image_url && (
                          <div className="mt-3 overflow-hidden rounded-lg border border-border-subtle">
                            <img
                              src={post.image_url}
                              alt={post.title}
                              className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-6 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-raised opacity-0 transition-[opacity,transform,border-color] duration-200 group-hover:translate-x-0.5 group-hover:border-accent/30 group-hover:opacity-100">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          aria-hidden="true"
                          className="text-accent"
                        >
                          <path
                            d="M5 3l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="relative mt-auto flex items-center gap-3 border-t border-border-subtle pt-4 text-xs text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <circle cx="6" cy="4" r="2.5" stroke="currentColor" strokeWidth="1" />
                          <path d="M1 11c0-2.5 2.2-4 5-4s5 1.5 5 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                        </svg>
                        <span className="font-medium text-text-secondary">
                          {post.author_name}
                        </span>
                      </div>
                      <span aria-hidden="true" className="text-border">
                        &middot;
                      </span>
                      <div className="flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                          <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1" />
                          <path d="M6 3v3.5l2 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <time dateTime={post.created_at}>
                          {formatDate(post.created_at)}
                        </time>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
