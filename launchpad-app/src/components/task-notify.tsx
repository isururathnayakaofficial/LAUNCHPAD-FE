import { useState, useEffect } from "react";
import "./style/task-notify.css";

const API = "http://localhost:5000/api";

type Task = {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
};

type Props = {
  taskId: string;
};

const TaskNotify = ({ taskId }: Props) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await fetch(`${API}/tasks/get-task/${taskId}`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch task");
        }

        setTask(data.task ?? data.data ?? data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="task-notify">
        <p>Loading task...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-notify task-notify-error">
        <p>{error}</p>
      </div>
    );
  }

  if (!task) return null;

  return (
    <div className="task-notify">
      <h3 className="task-notify-title">{task.title}</h3>

      {task.description && (
        <p className="task-notify-desc">{task.description}</p>
      )}

      <p className="task-notify-accept-text">Please accept the task</p>

      <a href="/" className="task-notify-btn">
        Accept Task
      </a>
    </div>
  );
};

export default TaskNotify;
