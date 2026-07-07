import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-tight flex min-h-[60vh] flex-col items-center justify-center pt-28 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        404
      </p>
      <h1 className="text-display mt-2 text-4xl font-bold tracking-tight md:text-5xl">
        Nothing here.
      </h1>
      <p className="mt-4 max-w-md text-sm text-muted-foreground text-pretty">
        That page doesn&apos;t exist — or I moved it. Either way, the front door is this way:
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center gap-2 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-opacity hover:opacity-90"
      >
        Back home
      </Link>
    </div>
  );
}