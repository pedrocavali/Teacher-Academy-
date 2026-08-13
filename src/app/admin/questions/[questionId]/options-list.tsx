import { deleteOption } from "./actions";

type Option = {
  id: string;
  text: string;
  is_correct: boolean;
  order_index: number;
};

export function OptionsList({
  questionId,
  questionType,
  options,
}: {
  questionId: string;
  questionType: string;
  options: Option[];
}) {
  if (options.length === 0) {
    return <p className="text-sm text-muted-foreground">No options yet.</p>;
  }

  const isChoiceType = questionType === "multiple_choice" || questionType === "true_false";
  const isOrdering = questionType === "ordering";

  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {options.map((option) => (
        <div key={option.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
          <div className="flex items-center gap-2">
            {isOrdering && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {option.order_index}
              </span>
            )}
            <span>{option.text}</span>
            {isChoiceType && option.is_correct && (
              <span className="text-xs font-medium text-success">✓ correct</span>
            )}
          </div>
          <form action={deleteOption.bind(null, questionId, option.id)}>
            <button type="submit" className="text-destructive hover:underline">
              Delete
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
