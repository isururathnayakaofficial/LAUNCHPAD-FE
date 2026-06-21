import { useState } from 'react';

type Task = {
  id: string;
  title: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'done';
};

const TaskAssign = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Design landing page', assignee: 'Alice', status: 'in-progress' },
    { id: '2', title: 'Set up CI/CD pipeline', assignee: 'Bob', status: 'todo' },
    { id: '3', title: 'Investor pitch deck', assignee: 'Carol', status: 'done' },
  ]);

  const getStatusClass = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'status-todo';
      case 'in-progress': return 'status-in-progress';
      case 'done': return 'status-done';
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
        <div className="task-board">
          {tasks.map((task) => (
            <div key={task.id} className="dashboard-card task-card">
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <span className={`task-status ${getStatusClass(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <p className="task-assignee">Assigned to: <strong>{task.assignee}</strong></p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TaskAssign;
