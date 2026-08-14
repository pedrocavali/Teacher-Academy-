import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { LevelBadge } from "@/components/ui/badge";
import { CEFR_LEVELS } from "@/lib/curriculum/constants";

const FEATURES = [
  {
    title: "Know your level",
    description:
      "A short diagnostic across reading, grammar, and vocabulary places you on the CEFR scale — A1 to C2 — in a few minutes.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        <circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Practice that fits your level",
    description:
      "A topic-based catalog of short lessons — grammar, vocabulary, reading, writing, and speaking — built for the ten minutes you have between classes.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        <path
          d="M10 12a4 4 0 0 1 4-4h9v32h-9a4 4 0 0 1-4-4z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M38 12a4 4 0 0 0-4-4h-9v32h9a4 4 0 0 0 4-4z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Real feedback, not just scores",
    description:
      "Writing and speaking activities get graded feedback, and an AI coach runs short role-play conversations to build real confidence.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        <path
          d="M8 14a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v14a4 4 0 0 1-4 4H20l-8 8v-8h-.001A4 4 0 0 1 8 28z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
] as const;

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section
        className="flex flex-col items-center px-6 py-24 text-center sm:py-32"
        style={{ background: "var(--hero-gradient)" }}
      >
        <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          Teacher Academy
        </span>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          A self-paced English learning platform for teachers
        </h1>
        <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
          Placement, a topic-based catalog, and personalized practice across
          reading, listening, writing, and speaking — built for short study
          sessions between classes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className={buttonVariants({ size: "lg" })}>
            Get started
          </Link>
          <Link href="/login" className={buttonVariants({ size: "lg", variant: "secondary" })}>
            Sign in
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">Every level, in one place:</span>
          {CEFR_LEVELS.map((level) => (
            <LevelBadge key={level} level={level} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 px-6 py-20 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="flex flex-col items-start gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </section>

      <section className="border-t border-border px-6 py-16 text-center">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Ready to see where you stand?
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Sign up, take the placement diagnostic, and start your first lesson today.
        </p>
        <Link href="/signup" className={buttonVariants({ size: "lg", className: "mt-6" })}>
          Get started
        </Link>
      </section>
    </div>
  );
}
