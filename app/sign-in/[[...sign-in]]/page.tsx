import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/4 left-1/3 h-[350px] w-[350px] rounded-full bg-accent/10 blur-[100px] animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/3 h-[250px] w-[250px] rounded-full bg-pink/8 blur-[80px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
      </div>
      <div className="relative animate-slide-up">
        <SignIn />
      </div>
    </main>
  );
}
