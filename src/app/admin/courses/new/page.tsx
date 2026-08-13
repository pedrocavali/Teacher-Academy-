import type { Metadata } from "next";
import { NewCourseForm } from "./course-form";

export const metadata: Metadata = {
  title: "New course — Teacher Academy Admin",
};

export default function NewCoursePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">New course</h1>
      <NewCourseForm />
    </div>
  );
}
