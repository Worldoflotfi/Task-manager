"use client";

import { useState } from "react";

interface TaskCardProps {
    title: string;
    description: string;
    onDelete: () => void;
  }
  
  export default function TaskCard({
    title,
    description,
    onDelete,
    
  }: TaskCardProps) {
    const [completed, setCompleted] = useState(false);

    return (
      <div>
        <h2>{title}</h2>
        <p>{description}</p>

        <p>
          Status: {completed ? "Completed" : "Pending"}
        </p>

        <button onClick={() => setCompleted(!completed)}>
          {completed ? "Mark as Pending" : "Mark as Completed"}
        </button>

        <button onClick={onDelete}>
          Delete
        </button>
      </div>
    );
  }