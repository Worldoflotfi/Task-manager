"use client";

import { useState, useEffect } from "react";
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

  const completedCount = tasks.filter((task) => task.completed).length;

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

        if (!response.ok) {
          throw new Error("Failed to load tasks");
        }

        const data: Array<
          Omit<Task, "description"> & {
            description: string | null;
          }
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

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
        }),
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
    } catch (err) {
      console.error("Error creating task:", err);

      setError(err instanceof Error ? err.message : "Could not save the task.");
    }
  };

  const deleteTask = async (id: number) => {
    try {
      setError("");

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

      setError(
        err instanceof Error ? err.message : "Could not delete the task.",
      );
    }
  };

  const toggleTask = async (id: number) => {
    try {
      setError("");

      const task = tasks.find((task) => task.id === id);

      if (!task) {
        return;
      }

      const newCompleted = !task.completed;

      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: newCompleted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update task");
      }

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === id
            ? {
                ...currentTask,
                completed: data.completed,
              }
            : currentTask,
        ),
      );
    } catch (err) {
      console.error("Error updating task:", err);

      setError(
        err instanceof Error ? err.message : "Could not update the task.",
      );
    }
  };

  const saveEditedTask = async () => {
    if (!taskToEdit) return;

    try {
      setError("");

      const response = await fetch(`/api/tasks/${taskToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
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
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-indigo-600">
            Your productivity space
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Task Manager
          </h1>

          <p className="mt-3 text-slate-500">
            Organize your work, one task at a time.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total tasks</p>
            <p className="mt-2 text-3xl font-bold">{tasks.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Completed</p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {completedCount}
            </p>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="mb-4 text-lg font-semibold">Add a new task</h2>
          <TaskForm onAddTask={addTask} />
        </section>

        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-bold">Your tasks</h2>

            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
              {filteredTasks.length} shown
            </span>
          </div>

          {/* Search input */}
          <div className="mb-4">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              aria-label="Search tasks"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Filter buttons */}
          <div className="mb-5 flex flex-wrap gap-2">
            {(["all", "active", "completed"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFilter(option)}
                className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                  filter === option
                    ? "bg-indigo-600 text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-slate-500">Loading tasks...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : filteredTasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 p-10 text-center">
              <p className="font-medium">
                {search.trim() || filter !== "all"
                  ? "No matching tasks"
                  : "No tasks yet"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {search.trim() || filter !== "all"
                  ? "Try a different search or filter."
                  : "Add your first task using the form above."}
              </p>
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
                />
              ))}
            </div>
          )}
        </section>

        <footer className="mt-10 text-center text-sm text-slate-400">
          Task Manager · Built with Next.js, React and TypeScript
        </footer>
      </div>

      {/* Edit task modal */}
      {taskToEdit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setTaskToEdit(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2
              id="edit-modal-title"
              className="text-xl font-bold tracking-tight text-slate-900"
            >
              Edit task
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update your task details below.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="edit-title"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Task title
                </label>

                <input
                  id="edit-title"
                  type="text"
                  maxLength={255}
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-description"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="edit-description"
                  rows={3}
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  placeholder="Enter task description"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTaskToEdit(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEditedTask}
                disabled={!editTitle.trim()}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {taskToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setTaskToDelete(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="q0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </div>

            <h2
              id="delete-modal-title"
              className="text-lg font-bold tracking-tight text-slate-900"
            >
              Delete this task?
            </h2>

            <p className="mt-1.5 wrap-break text-sm leading-5 text-slate-500">
              Are you sure you want to delete the task{" "}
              <span className="font-semibold text-slate-700">
                {taskToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setTaskToDelete(null)}
                className="rounded-xl border border-slate-200  bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-sm font-medium text-white transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => deleteTask(taskToDelete.id)}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Delete task
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
