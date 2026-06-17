import React, { useState, useRef, useEffect } from 'react';
import './style/todos.css';

// ===== Types =====
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

type FilterType = 'all' | 'active' | 'completed';

// ===== Main Component =====
const Todos: React.FC = () => {
  // ----- State -----
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('launchpad-todos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // ----- Effects -----
  useEffect(() => {
    localStorage.setItem('launchpad-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  // ----- Handlers -----
  const addTodo = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: crypto.randomUUID ? crypto.randomUUID() : `todo-${Date.now()}-${Math.random()}`,
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id: string) => {
    const trimmed = editText.trim();
    if (!trimmed) {
      deleteTodo(id);
      return;
    }
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: trimmed } : todo
      )
    );
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: string) => {
    if (e.key === 'Enter') {
      saveEdit(id);
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  // ----- Derived data -----
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

  // ----- Render -----
  return (
    <div className="launchpad-todos">
      {/* ===== Header / Hero ===== */}
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

        {/* Stats row */}
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
          {completedCount > 0 && (
            <button className="clear-completed-btn" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </div>
      </header>

      {/* ===== Add Todo ===== */}
      <div className="add-todo">
        <input
          ref={inputRef}
          type="text"
          className="add-input"
          placeholder="What's next for your team?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Add new todo"
        />
        <button className="add-btn" onClick={addTodo}>
          <span>+</span> Add task
        </button>
      </div>

      {/* ===== Filters ===== */}
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

      {/* ===== Todo List ===== */}
      <div className="todo-list">
        {filteredTodos.length === 0 ? (
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

                {editingId === todo.id ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                    onBlur={() => saveEdit(todo.id)}
                    aria-label="Edit todo text"
                  />
                ) : (
                  <span
                    className="todo-text"
                    onDoubleClick={() => startEditing(todo)}
                    title="Double-click to edit"
                  >
                    {todo.text}
                  </span>
                )}
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

      {/* ===== Footer ===== */}
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