const COVER_BY_SLUG: Record<string, string> = {
  "getting-started": "/covers/getting-started.svg",
  "everyday-life": "/covers/everyday-life.svg",
  "around-town": "/covers/around-town.svg",
  "work-and-study": "/covers/work-and-study.svg",
  "advanced-communication": "/covers/advanced-communication.svg",
  "health-and-wellbeing": "/covers/health-and-wellbeing.svg",
  "mastering-english": "/covers/mastering-english.svg",
  "classroom-language": "/covers/classroom-language.svg",
  "planning-and-teaching": "/covers/planning-and-teaching.svg",
  "communicating-with-parents-and-colleagues":
    "/covers/communicating-with-parents-and-colleagues.svg",
};

// Static, hand-drawn cover art per unit slug — falls back to a generic
// cover for any unit that doesn't have a dedicated illustration yet, so
// new units always render something rather than a broken image.
export function unitCoverSrc(slug: string): string {
  return COVER_BY_SLUG[slug] ?? "/covers/default.svg";
}
