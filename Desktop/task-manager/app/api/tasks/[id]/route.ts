import { db } from "@/lib/db";

export async function PATCH(
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

    const body = await request.json();

    
    if (typeof body?.completed === "boolean") {
      const updatedTask = await db.orm.public.Task
        .where({ id: taskId })
        .update({ completed: body.completed });

      if (!updatedTask) {
        return Response.json(
          { error: "Task not found" },
          { status: 404 }
        );
      }

      return Response.json(updatedTask);
    }

    // Update title and description
    if (
      typeof body?.title !== "string" ||
      typeof body?.description !== "string"
    ) {
      return Response.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const title = body.title.trim();
    const description = body.description.trim();

    if (!title) {
      return Response.json(
        { error: "Task title is required" },
        { status: 400 }
      );
    }

    if (title.length > 255) {
      return Response.json(
        { error: "Task title must be 255 characters or fewer" },
        { status: 400 }
      );
    }

    const updatedTask = await db.orm.public.Task
      .where({ id: taskId })
      .update({
        title,
        description: description || null,
      });

    if (!updatedTask) {
      return Response.json(
        { error: "Task not found" },
        { status: 404 }
      );
    }

    return Response.json(updatedTask);
  } catch (error) {
    console.error("Failed to update task:", error);

    return Response.json(
      { error: "Failed to update task" },
      { status: 500 }
    );
  }
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

