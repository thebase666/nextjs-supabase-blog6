"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseClient } from "./supabase";
import { redirect } from "next/navigation";

export type Post = {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
};

export async function getPosts(): Promise<Post[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPostById(id: string): Promise<Post | null> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function createPost(formData: FormData) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await currentUser();
  const authorName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName ?? user?.emailAddresses[0]?.emailAddress ?? "Anonymous";

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const imageUrl = (formData.get("image_url") as string)?.trim() || null;

  if (!title?.trim() || !content?.trim()) {
    throw new Error("Title and content are required");
  }

  const supabase = createSupabaseClient();
  const { error } = await supabase.from("posts").insert({
    title: title.trim(),
    content: content.trim(),
    image_url: imageUrl,
    author_id: userId,
    author_name: authorName,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/");
}
