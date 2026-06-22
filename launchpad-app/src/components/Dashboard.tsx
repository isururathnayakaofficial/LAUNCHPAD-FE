import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { fetchTodos } from '../api/todos';

type DashboardUser = {
  id?: string;
  name?: string;
  email?: string;
};

type DashboardProps = {
  user: DashboardUser;
};

const API = 'http://localhost:5000/api';

const COLORS = {
  pending: '#f59e0b',
  'in-progress': '#3b82f6',
  done: '#22c55e',
};

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  done: 'Done',
};

const getToken = () => localStorage.getItem('launchpad_auth_token');

const getUserId = (): string | null => {
  try {
    const token = getToken();
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload?.id ?? payload?._id ?? payload?.userId ?? payload?.sub ?? null;
  } catch {
    return null;
  }
};

const Dashboard = ({ user }: DashboardProps) => {
  const navigate = useNavigate();
  const displayName = user.name?.trim() || 'Founder';
  const [taskStats, setTaskStats] = useState<{ name: string; value: number; color: string }[]>([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [todoStats, setTodoStats] = useState<{ name: string; value: number; color: string }[]>([]);
  const [totalTodos, setTotalTodos] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      const userId = getUserId();
      const token = getToken();
      if (!userId || !token) return;

      try {
        const res = await fetch(`${API}/tasks/get/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.tasks ?? json.data ?? [];
        const counts: Record<string, number> = {};
        for (const t of list) {
          const raw = t.status || 'pending';
          const s = raw === 'in progress' ? 'in-progress' : raw;
          counts[s] = (counts[s] || 0) + 1;
        }
        setTotalTasks(list.length);
        setTaskStats(
          ['pending', 'in-progress', 'done'].map((s) => ({
            name: STATUS_LABELS[s] || s,
            value: counts[s] || 0,
            color: COLORS[s as keyof typeof COLORS],
          }))
        );
      } catch {
        // silently fail
      }

      try {
        const todos = await fetchTodos();
        const done = todos.filter((t) => t.completed).length;
        const pending = todos.length - done;
        setTotalTodos(todos.length);
        setTodoStats([
          { name: 'Done', value: done, color: '#22c55e' },
          { name: 'Pending', value: pending, color: '#94a3b8' },
        ]);
      } catch {
        // silently fail
      }
    };
    loadStats();
  }, []);

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="container dashboard-hero-grid">
          <div>
            <p className="dashboard-kicker">Startup Collaboration Platform</p>
            <h1>Welcome back, {displayName}</h1>
            <p className="dashboard-user-email">{user.email}</p>
            <p className="dashboard-copy">
              Your launch hub for team tasks, investor connections, and startup momentum.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-content container">
        <div className="dashboard-card dashboard-card-highlight">
          <p className="dashboard-card-label">Workspace Overview</p>
          <h2>{displayName}'s LaunchPad</h2>
          <p>{user.email ?? 'No email on file'} · Active since today</p>
        </div>

        {(taskStats.length > 0 || todoStats.length > 0) && (
          <div className="dashboard-charts-row">
            {taskStats.length > 0 && (
              <div className="dashboard-chart-card">
                <div className="dashboard-chart-header">
                  <p className="dashboard-card-label">Task Breakdown</p>
                  <span className="dashboard-chart-total">{totalTasks} total</span>
                </div>
                <div className="dashboard-chart-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={taskStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {taskStats.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#1e1e2e',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 12,
                          color: '#f5f5f5',
                          fontSize: 13,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        }}
                        formatter={(value: number, name: string) => [value, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={10}
                        formatter={(value: string) => (
                          <span style={{ color: '#a0a0b8', fontSize: 13, fontWeight: 500 }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="dashboard-chart-legend">
                    {taskStats.map((s) => (
                      <div key={s.name} className="dashboard-chart-stat">
                        <span className="dashboard-chart-dot" style={{ background: s.color }} />
                        <span className="dashboard-chart-label">{s.name}</span>
                        <span className="dashboard-chart-value">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {todoStats.length > 0 && (
              <div className="dashboard-chart-card">
                <div className="dashboard-chart-header">
                  <p className="dashboard-card-label">Todo Completion</p>
                  <span className="dashboard-chart-total">{totalTodos} total</span>
                </div>
                <div className="dashboard-chart-body">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={todoStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={4}
                        dataKey="value"
                        stroke="none"
                      >
                        {todoStats.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: '#1e1e2e',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 12,
                          color: '#f5f5f5',
                          fontSize: 13,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                        }}
                        formatter={(value: number, name: string) => [value, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        iconSize={10}
                        formatter={(value: string) => (
                          <span style={{ color: '#a0a0b8', fontSize: 13, fontWeight: 500 }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="dashboard-chart-legend">
                    {todoStats.map((s) => (
                      <div key={s.name} className="dashboard-chart-stat">
                        <span className="dashboard-chart-dot" style={{ background: s.color }} />
                        <span className="dashboard-chart-label">{s.name}</span>
                        <span className="dashboard-chart-value">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="dashboard-grid">
          <article className="dashboard-card" onClick={() => navigate('/todos')} style={{ cursor: 'pointer' }}>
            <p className="dashboard-card-label">Team Todos</p>
            <h3>Manage tasks</h3>
            <p>Create, assign, and track tasks across your startup team.</p>
            <span className="dashboard-card-action">Open Todos →</span>
          </article>
          <article className="dashboard-card" onClick={() => navigate('/task-assign')} style={{ cursor: 'pointer' }}>
            <p className="dashboard-card-label">Task Assign</p>
            <h3>Assign work</h3>
            <p>Delegate responsibilities and monitor progress in real time.</p>
            <span className="dashboard-card-action">Open Task Assign →</span>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Network</p>
            <h3>12 active matches</h3>
            <p>Founders, investors, and collaborators aligned with your goals.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Messages</p>
            <h3>3 unread</h3>
            <p>Recent conversations with your network and team members.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Progress</p>
            <h3>68% complete</h3>
            <p>Your startup profile and onboarding checklist progress.</p>
          </article>
          <article className="dashboard-card">
            <p className="dashboard-card-label">Resources</p>
            <h3>Startup Kit</h3>
            <p>Templates, pitch deck guides, and investor outreach tools.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
