export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-32 text-foreground">
      <main className="flex w-full max-w-2xl flex-col items-center gap-4 text-center">
        <span className="text-sm font-medium uppercase tracking-wide text-foreground/60">
          Teacher Academy
        </span>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          A self-paced English learning platform for teachers
        </h1>
        <p className="max-w-lg text-base leading-7 text-foreground/70">
          Placement, a topic-based catalog, and personalized practice across
          reading, listening, writing, and speaking — built for short study
          sessions between classes.
        </p>
      </main>
    </div>
  );
}
