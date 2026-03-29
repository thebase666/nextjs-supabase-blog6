"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createPost } from "@/lib/posts";

export function CreatePostForm() {
  const [error, formAction, isPending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await createPost(formData);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "Something went wrong";
      }
    },
    null,
  );

  return (
    <form action={formAction} className="space-y-8">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-rose/20 bg-rose/8 px-4 py-3 text-sm"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-rose"
          >
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M8 5v3.5M8 10.5v.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-rose">{error}</span>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="title" className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 3h10M2 7h6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-accent" />
          </svg>
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          autoComplete="off"
          placeholder="Enter your post title…"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted shadow-sm transition-[border-color,box-shadow] duration-200 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:shadow-md focus:shadow-accent/5"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 3h10M2 6h8M2 9h9M2 12h5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-pink" />
          </svg>
          Content
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={14}
          autoComplete="off"
          placeholder="Write your post content here…"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted shadow-sm transition-[border-color,box-shadow] duration-200 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:shadow-md focus:shadow-accent/5 resize-y leading-relaxed"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="image_url" className="flex items-center gap-2 text-sm font-medium text-text-secondary">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" className="text-amber" />
            <circle cx="4.5" cy="5.5" r="1" stroke="currentColor" strokeWidth="1" className="text-amber" />
            <path d="M1.5 9.5l3-3 2 2 3-3 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber" />
          </svg>
          Image URL
          <span className="text-text-muted font-normal">(optional)</span>
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          autoComplete="off"
          placeholder="https://example.com/image.jpg"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-text placeholder:text-text-muted shadow-sm transition-[border-color,box-shadow] duration-200 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:shadow-md focus:shadow-accent/5"
        />
      </div>

      <div className="flex items-center justify-between border-t border-border-subtle pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-text-muted transition-colors duration-150 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M8 3L3 7l5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="group inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-accent to-pink px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-accent/15 transition-[box-shadow,opacity] duration-200 hover:shadow-lg hover:shadow-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isPending ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="animate-spin"
            >
              <circle
                cx="7"
                cy="7"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="24"
                strokeDashoffset="8"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:-translate-y-0.5">
              <path d="M7 1v8M4 6l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 11v1h10v-1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
          {isPending ? "Publishing…" : "Publish Post"}
        </button>
      </div>
    </form>
  );
}
