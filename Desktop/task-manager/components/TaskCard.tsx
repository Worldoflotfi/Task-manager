interface TaskCardProps {
  title: string;
  description: string;
  completed: boolean;
  onDelete: () => void;
  onToggle: () => void;
}

export default function TaskCard({
  title,
  description,
  completed,
  onDelete,
  onToggle,
}: TaskCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <h3
              className={`wrap-break-word text-lg font-semibold ${
                completed ? "text-slate-400 line-through" : "text-slate-800"
              }`}
            >
              {title}
            </h3>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                completed
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {completed ? "Completed" : "Pending"}
            </span>
          </div>

          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-500">
            {description || "No description provided."}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={onToggle}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              completed
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-emerald-600 text-white hover:bg-emerald-700"
            }`}
          >
            {completed ? "Undo" : "Complete"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}