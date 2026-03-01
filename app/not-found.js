import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-primary/10 via-background to-accent/20 text-foreground">
      <div className="text-center space-y-4">
        <p className="text-8xl font-black tracking-tighter text-primary/30 select-none">
          404
        </p>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or hasn&apos;t
          been published yet.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
