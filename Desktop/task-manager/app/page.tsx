
"use client";

import { useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState<number | null>(null);
  const [togglingTaskId, setTogglingTaskId] = useState<number | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;
  const progress =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "active" && !task.completed) ||
      (filter === "completed" && task.completed);

    const searchText = search.toLowerCase().trim();
    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      task.description.toLowerCase().includes(searchText);

    return matchesFilter && matchesSearch;
  });

  useEffect(() => {
    async function loadTasks() {
      try {
        const response = await fetch("/api/tasks");

        if (!response.ok) throw new Error("Failed to load tasks");

        const data: Array<
          Omit<Task, "description"> & { description: string | null }
        > = await response.json();

        setTasks(
          data.map((task) => ({
            ...task,
            description: task.description ?? "",
          })),
        );
      } catch (err) {
        console.error("Error loading tasks:", err);
        setError("Could not load tasks from the database.");
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, []);

  const addTask = async (title: string, description: string) => {
    try {
      setError("");
      setIsAdding(true);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create task");
      }

      const newTask: Task = {
        ...data,
        description: data.description ?? "",
      };

      setTasks((currentTasks) => [...currentTasks, newTask]);
      return true;
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err instanceof Error ? err.message : "Could not save the task.");
      return false;
    } finally {
      setIsAdding(false);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setError("");
      setDeletingTaskId(id);

      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete task");
      }

      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
      setTaskToDelete(null);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err instanceof Error ? err.message : "Could not delete the task.");
    } finally {
      setDeletingTaskId(null);
    }
  };

  const toggleTask = async (id: number) => {
    try {
      setError("");
      setTogglingTaskId(id);

      const task = tasks.find((item) => item.id === id);
      if (!task) return;

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !task.completed }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === id ? { ...item, completed: data.completed } : item,
        ),
      );
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err instanceof Error ? err.message : "Could not update the task.");
    } finally {
      setTogglingTaskId(null);
    }
  };

  const saveEditedTask = async () => {
    if (!taskToEdit || !editTitle.trim() || isSavingEdit) return;

    try {
      setError("");
      setIsSavingEdit(true);

      const response = await fetch(`/api/tasks/${taskToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to edit task");
      }

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskToEdit.id
            ? {
                ...task,
                title: data.title,
                description: data.description ?? "",
              }
            : task,
        ),
      );

      setTaskToEdit(null);
    } catch (err) {
      console.error("Error editing task:", err);
      setError(err instanceof Error ? err.message : "Could not save the task.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  const closeModals = () => {
    if (isSavingEdit || deletingTaskId !== null) return;
    setTaskToEdit(null);
    setTaskToDelete(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 px-4 py-8 text-slate-900 sm:px-8 sm:py-12">
      {/* Soft background glows */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[28rem] h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl">
        <header className="mb-10">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-6 w-6"
              aria-hidden="true"
            >
              <path
                d="m5 12 4 4L19 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">
            Your productivity space
          </p>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Task Manager<span className="text-indigo-600">.</span>
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-500 sm:text-base">
                Clear your mind, organize your priorities, and make progress
                one task at a time.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-full border border-indigo-100 bg-white/80 px-3 py-2 shadow-sm sm:self-auto">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600">
                Your workspace
              </span>
            </div>
          </div>
        </header>

        {/* Overview cards */}
        <section
          aria-label="Task overview"
          className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-900/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Total tasks</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {tasks.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">Tasks in your list</p>
          </div>

          <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-900/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">In progress</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {activeCount}
            </p>
            <p className="mt-1 text-xs text-slate-400">Ready for your focus</p>
          </div>

          <div className="group rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {completedCount}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400">
              {progress}% completion rate
            </p>
          </div>
        </section>

        {/* Add task */}
        <section className="mb-10 overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/50 px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-light text-white shadow-md shadow-indigo-600/20">
                +
              </span>
              <div>
                <h2 className="font-bold tracking-tight text-slate-900">
                  Create a task
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Turn your next idea into an action.
                </p>
              </div>
            </div>
          </div>
          <div className="p-5 sm:p-7">
            <TaskForm onAddTask={addTask} isAdding={isAdding} />
          </div>
        </section>

        {/* Task list */}
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Your workflow
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Your tasks
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep track of what matters.
              </p>
            </div>

            <span className="rounded-full border border-indigo-100 bg-white px-3.5 py-1.5 text-sm font-semibold text-indigo-700 shadow-sm">
              {filteredTasks.length} shown
            </span>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" strokeLinecap="round" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by task title or description..."
              aria-label="Search tasks"
              className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100/70"
            />
          </div>

          {/* Filters */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {(["all", "active", "completed"] as const).map((option) => {
              const count =
                option === "all"
                  ? tasks.length
                  : option === "active"
                    ? activeCount
                    : completedCount;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  aria-pressed={filter === option}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition duration-200 active:scale-95 ${
                    filter === option
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-100 hover:bg-indigo-50/60 hover:text-indigo-700"
                  }`}
                >
                  {option}
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-xs ${
                      filter === option
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Loading, error, empty state, or tasks */}
          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
              <span className="mb-4 h-9 w-9 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />
              <p className="font-semibold text-slate-700">Loading your tasks</p>
              <p className="mt-1 text-sm text-slate-400">
                Getting your workspace ready...
              </p>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="rounded-2xl border border-red-100 bg-red-50/80 p-5 text-sm text-red-700"
            >
              <p className="font-semibold">Something went wrong</p>
              <p className="mt-1">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-3 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-red-700 shadow-sm ring-1 ring-red-100 transition hover:bg-red-100"
              >
                Reload page
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-indigo-200 bg-white/80 px-5 py-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-7 w-7"
                  aria-hidden="true"
                >
                  <path
                    d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                {search.trim() || filter !== "all"
                  ? "No matching tasks"
                  : "A fresh start"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {search.trim() || filter !== "all"
                  ? "Try a different search term or switch to another filter."
                  : "Your task list is waiting. Add your first task above and build some momentum."}
              </p>
              {(search.trim() || filter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilter("all");
                  }}
                  className="mt-4 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                >
                  Clear search and filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  completed={task.completed}
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => setTaskToDelete(task)}
                  onEdit={() => {
                    setTaskToEdit(task);
                    setEditTitle(task.title);
                    setEditDescription(task.description);
                  }}
                  isToggling={togglingTaskId === task.id}
                />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-14 border-t border-slate-200/80 pt-6 text-center">
          <p className="text-sm font-medium text-slate-500">
            Built with <span className="text-indigo-600">Next.js</span>, React
            and TypeScript
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Small steps. Consistent progress.
          </p>
        </footer>
      </div>

      {/* Edit modal */}
      {taskToEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={closeModals}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            className="my-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/70 bg-white shadow-2xl shadow-slate-950/20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-white p-5 sm:p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="m15 5 4 4M4 20l4-.8L19 8a2.12 2.12 0 0 0-3-3L5 16l-1 4Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2
                id="edit-modal-title"
                className="mt-4 text-xl font-bold tracking-tight text-slate-900"
              >
                Edit task
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Make changes to your task details.
              </p>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div>
                <label
                  htmlFor="edit-title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Task title
                </label>
                <input
                  id="edit-title"
                  type="text"
                  maxLength={255}
                  required
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/70"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>
                <textarea
                  id="edit-description"
                  rows={3}
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/70"
                  placeholder="Add some details..."
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setTaskToEdit(null)}
                  disabled={isSavingEdit}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveEditedTask}
                  disabled={isSavingEdit || !editTitle.trim()}
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSavingEdit ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {taskToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm"
          onClick={closeModals}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="my-auto w-full max-w-sm overflow-hidden rounded-2xl border border-white/70 bg-white p-6 shadow-2xl shadow-slate-950/20"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-1 ring-inset ring-red-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path
                  d="M12 9v3m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2
              id="delete-modal-title"
              className="mt-4 text-xl font-bold tracking-tight text-slate-900"
            >
              Delete this task?
            </h2>

            <p className="mt-2 wrap-break-word text-sm leading-6 text-slate-500">
              You are about to delete{" "}
              <span className="font-semibold text-slate-800">
                {taskToDelete.title}
              </span>
              . This action cannot be undone.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                disabled={deletingTaskId === taskToDelete.id}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => deleteTask(taskToDelete.id)}
                disabled={deletingTaskId === taskToDelete.id}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-red-600/15 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deletingTaskId === taskToDelete.id
                  ? "Deleting..."
                  : "Delete task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
