import { db } from "@/lib/db";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const taskId = Number(id);
  if (!Number.isInteger(taskId) || taskId < 1) {
    return Response.json({ error: "Invalid task ID" }, { status: 400 });
  }

  const body = await request.json();

  if (typeof body?.completed !== "boolean") {
    return Response.json(
      { error: "Completed must be true or false" },
      { status: 400 },
    );
  }
  const updatedTask = await db.orm.public.Task.where({ id: taskId }).update({
    completed: body.completed,
  });

  return Response.json(updatedTask);
}


export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const taskId = Number(id);

    if (!Number.isInteger(taskId) || taskId < 1) {
      return Response.json(
        { error: "Invalid task ID" },
        { status: 400 }
      );
    }

    const deletedTask = await db.orm.public.Task
      .where({ id: taskId })
      .delete();

    if (!deletedTask) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Failed to delete task:", error);

    return Response.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
}

