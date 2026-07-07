export default function Loading() {
  return (
    <div className="container-wide flex min-h-[50vh] items-center justify-center pt-28">
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
        Loading…
      </div>
    </div>
  );
}