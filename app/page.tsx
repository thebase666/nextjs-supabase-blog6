import Link from "next/link";

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-3xl p-6">
      <h1 className="text-2xl font-semibold">Home</h1>
      <p className="mt-2 text-sm text-neutral-600">
        试试访问受保护页面：
        <Link href="/create" className="ml-1 underline">
          /create
        </Link>
      </p>
    </main>
  );
}
