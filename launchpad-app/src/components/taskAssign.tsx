import { useState, useRef, useEffect, useCallback } from "react";

const API = "http://localhost:5000/api";

type Task = {
  _id?: string;
  id?: string;
  title: string;
  name: string;
  email?: string;
  role?: string;
  description?: string;
  status: "pending" | "in-progress" | "done";
  mediaFile?: string;
  mediaUrl?: string[];
};

const getToken = () => localStorage.getItem("launchpad_auth_token");

const getUserId = (): string | null => {
  try {
    const stored = localStorage.getItem("launchpad_auth_user");
    if (!stored) return null;
    const user = JSON.parse(stored);
    return user?.id ?? null;
  } catch {
    return null;
  }
};

const TaskAssign = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [mediaFile, setMediaFile] = useState<File[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  // ================= FETCH TASKS =================
  const loadTasks = useCallback(async () => {
    setLoading(true);
    const userId = getUserId();
    if (!userId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    try {
      const token = getToken();
      const res = await fetch(`${API}/tasks/get/${userId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Failed to load tasks");
      }

      const json = await res.json();
      const list = Array.isArray(json) ? json : json.tasks ?? json.data ?? [];
      setTasks(list);
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // ================= FILE CHANGE =================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFile(Array.from(e.target.files));
    }
  };

  // ================= CLEAR =================
  const clearForm = () => {
    setTitle("");
    setName("");
    setEmail("");
    setRole("");
    setDescription("");
    setMediaFile([]);
    if (fileRef.current) fileRef.current.value = "";
  };

  // ================= CREATE TASK =================
  const addTask = async () => {
    if (!title.trim() || !name.trim()) return;

    try {
      const token = getToken();
      if (!token) throw new Error("No auth token found");

      let body: BodyInit;
      const headers: Record<string, string> = { Authorization: `Bearer ${token}` };

      if (mediaFile.length > 0) {
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("name", name.trim());
        if (email.trim()) formData.append("email", email.trim());
        if (role.trim()) formData.append("role", role.trim());
        if (description.trim()) formData.append("description", description.trim());
        mediaFile.forEach((file) => formData.append("files", file));
        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        const payload: Record<string, string> = {
          title: title.trim(),
          name: name.trim(),
        };
        if (email.trim()) payload.email = email.trim();
        if (role.trim()) payload.role = role.trim();
        if (description.trim()) payload.description = description.trim();
        body = JSON.stringify(payload);
      }

      const res = await fetch(`${API}/tasks/create`, {
        method: "POST",
        headers,
        body,
      });

      const text = await res.text();
      let data: Record<string, unknown> = {};
      try { data = JSON.parse(text); } catch { data = { message: text }; }

      if (!res.ok) {
        throw new Error((data?.message as string) || `Server error (${res.status})`);
      }

      const newTask = (data.data ?? data.task ?? data) as Task;
      setTasks((prev) => [newTask, ...prev]);
      clearForm();
      setError(null);
    } catch (err) {
      console.error(err);
      showError(err instanceof Error ? err.message : "Error creating task");
    }
  };

  // ================= DELETE =================
  const deleteTask = async (id: string) => {
    const prev = tasks;
    setTasks((t) => t.filter((x) => (x._id || x.id) !== id));

    try {
      const token = getToken();
      const res = await fetch(`${API}/tasks/delete/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      setTasks(prev);
      showError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // ================= STATUS =================
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "status-pending";
      case "in-progress": return "status-in-progress";
      case "done": return "status-done";
      default: return "";
    }
  };

  return (
    <div className="task-assign-page">
      <section className="dashboard-hero">
        <div className="container dashboard-hero-grid">
          <div>
            <p className="dashboard-kicker">Task Assignment</p>
            <h1>Assign & Track</h1>
            <p className="dashboard-copy">
              Delegate tasks to team members and monitor progress across your startup.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-content container">
        <div className="dashboard-card task-form-card">
          <p className="dashboard-card-label">New Task</p>

          <div className="task-form">
            <input className="task-input" placeholder="Task title *" value={title} onChange={(e) => setTitle(e.target.value)} />

            <div className="task-form-row">
              <input className="task-input" placeholder="Name *" value={name} onChange={(e) => setName(e.target.value)} />
              <input className="task-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="task-input" placeholder="Role" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>

            <textarea className="task-textarea" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <div className="task-file-row">
              <input ref={fileRef} type="file" multiple className="task-file-input" onChange={handleFileChange} />
              {mediaFile.length > 0 && (
                <div className="task-file-name">
                  {mediaFile.map((f, i) => <div key={i}>{f.name}</div>)}
                </div>
              )}
            </div>

            <button className="add-btn task-submit-btn" onClick={addTask}>
              <span>+</span> Assign Task
            </button>
          </div>
        </div>

        {error && <div className="app-error">{error}</div>}

        <div className="task-board">
          {loading ? (
            <div className="dashboard-card task-card">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="dashboard-card task-card">No tasks yet</div>
          ) : (
            tasks.map((task) => (
              <div key={task._id || task.id} className="dashboard-card task-card">
                <div className="task-card-header">
                  <h3>{task.title}</h3>
                  <span className={`task-status ${getStatusClass(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                <div className="task-assignee-name">{task.name}</div>
                <div className="task-card-actions">
                  <button className="action-btn delete-btn" onClick={() => deleteTask(task._id || task.id!)}>
                    ✕ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default TaskAssign;
