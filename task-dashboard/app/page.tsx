"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Task } from "@/types/task";

const API_URL = "http://localhost:8081/api/tasks";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"PENDING" | "IN_PROGRESS" | "COMPLETED">("PENDING");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { title, description, status });
        setEditingId(null);
      } else {
        await axios.post(API_URL, { title, description, status });
      }
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      await fetchTasks();
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  const deleteTask = async (id: number) => {
    if (!confirm("Delete this task?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      await fetchTasks();
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const editTask = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStatus("PENDING");
  };

  const getStatus = (s: string) => {
    const map: Record<string, { label: string; dot: string; badge: string }> = {
      PENDING: { label: "Pending", dot: "dot-pending", badge: "badge-pending" },
      IN_PROGRESS: { label: "In Progress", dot: "dot-progress", badge: "badge-progress" },
      COMPLETED: { label: "Done", dot: "dot-done", badge: "badge-done" },
    };
    return map[s] || map.PENDING;
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "PENDING").length,
    progress: tasks.filter(t => t.status === "IN_PROGRESS").length,
    done: tasks.filter(t => t.status === "COMPLETED").length,
  };
  const pct = stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);

  return (
    <div className="container">

      {/* HEADER */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 8 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }}>📋 Tasks</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>{stats.total} total</p>
          </div>
          <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{pct}% complete</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
        <div className="stat-box"><div className="stat-number">{stats.total}</div><div className="stat-label">Total</div></div>
        <div className="stat-box"><div className="stat-number" style={{ color: "var(--pending)" }}>{stats.pending}</div><div className="stat-label">Pending</div></div>
        <div className="stat-box"><div className="stat-number" style={{ color: "var(--progress)" }}>{stats.progress}</div><div className="stat-label">Progress</div></div>
        <div className="stat-box"><div className="stat-number" style={{ color: "var(--done)" }}>{stats.done}</div><div className="stat-label">Done</div></div>
      </div>

      {/* FORM */}
      <div className="box" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 14 }}>
          {editingId ? "✏️ Edit Task" : "✨ New Task"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 140px", gap: 10 }}>
            <input
              placeholder="Task title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
            <input
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <select value={status} onChange={e => setStatus(e.target.value as any)}>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Done</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <button className="btn btn-primary" type="submit">
              {editingId ? "Update" : "Add Task"}
            </button>
            {editingId && (
              <button className="btn btn-secondary" type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* TASK LIST */}
      <div>
        <h2 style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
          All Tasks · {tasks.length}
        </h2>

        {loading ? (
          <div className="box" style={{ textAlign: "center", padding: 40 }}>Loading...</div>
        ) : tasks.length === 0 ? (
          <div className="box" style={{ textAlign: "center", padding: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>📭</div>
            <h3 style={{ fontSize: 16, fontWeight: 500 }}>No tasks yet</h3>
            <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>Add your first task above</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tasks.map(task => {
              const st = getStatus(task.status);
              return (
                <div key={task.id} className="box" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0, flex: 1 }}>
                    <span className={`dot ${st.dot}`} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{task.title}</span>
                        <span className={`badge ${st.badge}`}>{st.label}</span>
                      </div>
                      {task.description && (
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{task.description}</p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-secondary" onClick={() => editTask(task)} style={{ padding: "6px 14px", fontSize: 13 }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => deleteTask(task.id)} style={{ padding: "6px 14px", fontSize: 13 }}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <p style={{ textAlign: "center", fontSize: 11, color: "var(--text-muted)", marginTop: 40 }}>
        Next.js · TypeScript · Tailwind · Spring Boot
      </p>
    </div>
  );
}