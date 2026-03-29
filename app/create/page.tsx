import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CreatePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Create</h1>
      <p className="mt-2 text-sm text-neutral-600">
        你已登录，可以访问受保护的 /create 页面。
      </p>
    </main>
  );
}
