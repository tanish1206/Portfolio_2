import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
      <div className="space-y-4">
        <span className="font-mono text-xs text-accent-blue uppercase tracking-widest">
          404 • Out of Coordinates
        </span>
        <h1 className="font-space text-4xl font-bold text-white md:text-6xl">
          World Not Found
        </h1>
        <p className="max-w-md text-sm text-text-secondary">
          The requested coordinate or story page does not exist in this universe.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-accent-blue px-6 py-2.5 text-xs font-bold text-black hover:bg-white transition-all shadow-[0_0_20px_rgba(0,229,255,0.3)]"
        >
          Return to Hero Experience
        </Link>
      </div>
    </div>
  );
}
