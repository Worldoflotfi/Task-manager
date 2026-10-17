
interface TaskCardProps {
  title: string;
  description: string;
  completed: boolean;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
  isToggling: boolean;
}

export default function TaskCard({
  title,
  description,
  completed,
  onDelete,
  onToggle,
  onEdit,
  isToggling,
}: TaskCardProps) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-6 ${
        completed
          ? "border-emerald-100 hover:shadow-emerald-900/5"
          : "border-slate-200 hover:border-indigo-200 hover:shadow-indigo-900/5"
      }`}
    >
      <div
        className={`absolute inset-y-0 left-0 w-1 ${
          completed ? "bg-emerald-400" : "bg-indigo-500"
        }`}
      />

      <div className="flex flex-col gap-5 pl-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h3
              className={`wrap-break-word text-base font-bold tracking-tight transition sm:text-lg ${
                completed
                  ? "text-slate-400 line-through decoration-emerald-400"
                  : "text-slate-800"
              }`}
            >
              {title}
            </h3>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                completed
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100"
                  : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  completed ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {completed ? "Completed" : "In progress"}
            </span>
          </div>

          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-6 text-slate-500">
            {description || "No description provided."}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-indigo-100 bg-indigo-50 px-3.5 py-2 text-sm font-semibold text-indigo-700 transition duration-200 hover:border-indigo-200 hover:bg-indigo-100 active:scale-95"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={onToggle}
            disabled={isToggling}
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition duration-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 ${
              completed
                ? "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                : "bg-indigo-600 text-white shadow-sm shadow-indigo-600/15 hover:bg-indigo-700"
            }`}
          >
            {isToggling ? "Updating..." : completed ? "Undo" : "Complete"}
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="rounded-lg border border-red-100 bg-white px-3.5 py-2 text-sm font-semibold text-red-600 transition duration-200 hover:border-red-200 hover:bg-red-50 active:scale-95"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
