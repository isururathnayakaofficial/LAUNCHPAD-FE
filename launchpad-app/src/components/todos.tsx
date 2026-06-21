import React, { useState, useRef, useEffect, useCallback } from 'react';
import './style/todos.css';
import { fetchTodos, createTodo, updateTodo, deleteTodoApi } from '../api/todos';
import type { Todo } from '../api/todos';

type FilterType = 'all' | 'active' | 'completed';

const Todos: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [titleValue, setTitleValue] = useState('');
  const [descValue, setDescValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const showError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  };

  const loadTodos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTodos();
      setTodos(data);
    } catch (err) {
      console.error('Failed to load todos:', err);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  const addTodo = async () => {
    const trimmed = titleValue.trim();
    if (!trimmed) return;

    try {
      const newTodo = await createTodo({
        title: trimmed,
        description: descValue.trim() || undefined,
      });
      setTodos((prev) => [newTodo, ...prev]);
      setTitleValue('');
      setDescValue('');
      setError(null);
      inputRef.current?.focus();
    } catch (err) {
      console.error('Failed to add todo:', err);
      showError(err instanceof Error ? err.message : 'Failed to add task.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const newStatus = todo.completed ? "pending" : "completed";

    const previousTodos = todos;

    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

    try {
      await updateTodo(id, { status: newStatus });
      await loadTodos();
    } catch (error) {
      console.error("Failed to update status:", error);
      setTodos(previousTodos);
    }
  };
  const deleteTodo = async (id: string) => {
    const prev = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) setEditingId(null);

    try {
      await deleteTodoApi(id);
    } catch {
      setTodos(prev);
    }
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
    setEditDesc(todo.description ?? '');
  };

  const saveEdit = async (id: string) => {
    const trimmed = editTitle.trim();
    if (!trimmed) {
      deleteTodo(id);
      return;
    }

    const prev = todos;
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, title: trimmed, description: editDesc.trim() || undefined }
          : t
      )
    );
    setEditingId(null);

    try {
      await updateTodo(id, {
        title: trimmed,
        description: editDesc.trim() || undefined,
      });
    } catch {
      setTodos(prev);
      setEditingId(id);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const totalCount = todos.length;
  const activeCount = activeTodos.length;
  const completedCount = completedTodos.length;

  return (
    <div className="launchpad-todos">
      <header className="todos-header">
        <div className="header-top">
          <div className="brand">
            <span className="brand-icon">⎔</span>
            <h1>LaunchPad</h1>
          </div>
          <div className="trust-badge">
            <span className="badge-dot">●</span>
            Trusted by 5,000+ product teams
          </div>
        </div>

        <div className="header-sub">
          <p className="tagline">
            Simple, sharp, and built for <strong>momentum</strong>.
          </p>
        </div>

        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-number">{totalCount}</span>
            <span className="stat-label">total</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item active-stat">
            <span className="stat-number">{activeCount}</span>
            <span className="stat-label">active</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item completed-stat">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">completed</span>
          </div>
        </div>
      </header>

      {error && <div className="todos-error">{error}</div>}

      <div className="add-todo">
        <div className="add-fields">
          <input
            ref={inputRef}
            type="text"
            className="add-input"
            placeholder="Task title"
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Task title"
          />
          <input
            type="text"
            className="add-input add-desc-input"
            placeholder="Description (optional)"
            value={descValue}
            onChange={(e) => setDescValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Task description"
          />
        </div>
        <button className="add-btn" onClick={addTodo}>
          <span>+</span> Add task
        </button>
      </div>

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <div className="todo-list">
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon">◌</div>
            <p className="empty-text">Loading tasks...</p>
            <span className="empty-sub">Fetching your team's todos.</span>
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◌</div>
            <p className="empty-text">
              {filter === 'all'
                ? 'No todos yet. Add one above!'
                : filter === 'active'
                ? 'All caught up! No active tasks.'
                : 'No completed tasks yet.'}
            </p>
            <span className="empty-sub">
              {filter === 'all'
                ? 'Everything sits in one place so teams can move from idea to execution faster.'
                : 'Keep priorities visible across the team.'}
            </span>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''} ${
                editingId === todo.id ? 'editing' : ''
              }`}
            >
              <div className="todo-left">
                <button
                  className={`todo-checkbox ${todo.completed ? 'checked' : ''}`}
                  onClick={() => toggleTodo(todo.id)}
                  aria-label={todo.completed ? 'Mark as active' : 'Mark as completed'}
                >
                  {todo.completed && <span className="checkmark">✓</span>}
                </button>

                <div className="todo-content">
                  {editingId === todo.id ? (
                    <div className="edit-fields">
                      <input
                        ref={editInputRef}
                        type="text"
                        className="edit-input"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                        aria-label="Edit title"
                      />
                      <input
                        type="text"
                        className="edit-input edit-desc-input"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                        aria-label="Edit description"
                      />
                    </div>
                  ) : (
                    <>
                      <span
                        className="todo-title"
                        onDoubleClick={() => startEditing(todo)}
                        title="Double-click to edit"
                      >
                        {todo.title}
                      </span>
                      {todo.description && (
                        <span className="todo-desc">{todo.description}</span>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="todo-actions">
                {!todo.completed && editingId !== todo.id && (
                  <button
                    className="action-btn edit-btn"
                    onClick={() => startEditing(todo)}
                    aria-label="Edit todo"
                  >
                    ✎
                  </button>
                )}
                {editingId === todo.id && (
                  <>
                    <button
                      className="action-btn save-btn"
                      onClick={() => saveEdit(todo.id)}
                      aria-label="Save edit"
                    >
                      ✓
                    </button>
                    <button
                      className="action-btn cancel-btn"
                      onClick={cancelEdit}
                      aria-label="Cancel edit"
                    >
                      ✕
                    </button>
                  </>
                )}
                {editingId !== todo.id && (
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                    aria-label="Delete todo"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <footer className="todos-footer">
        <span className="footer-text">
          {activeCount} active · {completedCount} completed
        </span>
        <span className="footer-brand">LaunchPad · built for momentum</span>
      </footer>
    </div>
  );
};

export default Todos;
