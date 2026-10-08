"use client";

import { useState } from "react";
import TaskCard from "@/components/TaskCard";
import TaskForm from "@/components/TaskForm";

interface Task {
  id: number;
  title: string;
  description: string;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Learn Next.js",
      description: "Learn Next.js and create a new task manager app",
    },
    {
      id: 2,
      title: "Learn React",
      description: "Learn React and create reusable components",
    },
    {
      id: 3,
      title: "Learn JS",
      description: "Learn javascript and create a new task manager app",
    },
  ]);

  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      description,
    }
    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  const deleteTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task.id !== id)
    );
  };

  return (
    <main>
      <h1>Task Manager</h1>

      <TaskForm onAddTask={addTask} />

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          onDelete={() => deleteTask(task.id)}
        />
      ))}
    </main>
  );
}