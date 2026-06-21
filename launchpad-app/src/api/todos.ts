import { authFetch } from './auth';

export type Todo = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
};

export type CreateTodoPayload = {
  title: string;
  description?: string;
};

export type UpdateTodoPayload = {
  title?: string;
  description?: string;
  completed?: boolean;
};

const getUserId = (): string | null => {
  try {
    const stored = localStorage.getItem('launchpad_auth_user');
    if (!stored) return null;
    const user = JSON.parse(stored);
    return user?.id ?? null;
  } catch {
    return null;
  }
};

const parseJsonSafely = async <T>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return { message: text } as T;
  }
};

const normalizeTodo = (item: Record<string, unknown>): Todo => ({
  id: (item._id ?? item.id ?? '') as string,
  title: (item.title ?? item.text ?? '') as string,
  description: (item.description ?? '') as string | undefined,
  completed: !!(item.completed ?? item.isCompleted),
  createdAt: Number(item.createdAt ?? item.created_at ?? Date.now()),
});

const extractTodos = <T>(data: T): Todo[] => {
  if (Array.isArray(data)) return data.map((d) => normalizeTodo(d as Record<string, unknown>));
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.todos)) return obj.todos.map((d) => normalizeTodo(d as Record<string, unknown>));
    if (Array.isArray(obj.data)) return obj.data.map((d) => normalizeTodo(d as Record<string, unknown>));
  }
  return [];
};

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await authFetch('/private-todos/get/{getUserId()}', {
    method: 'GET',
  });

  if (!response.ok) {
    const data = await parseJsonSafely<{ message?: string }>(response);
    throw new Error(data.message ?? 'Failed to fetch todos.');
  }

  const data = await parseJsonSafely<Record<string, unknown>>(response);
  return extractTodos(data);
};

const extractSingleTodo = (raw: Record<string, unknown>): Todo => {
  const source = (raw.todo ?? raw.data ?? raw) as Record<string, unknown>;
  return normalizeTodo(source);
};

export const createTodo = async (payload: CreateTodoPayload): Promise<Todo> => {
  const body: Record<string, unknown> = { title: payload.title };
  if (payload.description) body.description = payload.description;

  const response = await authFetch('/private-todos/save', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const data = await parseJsonSafely<{ message?: string }>(response);
    throw new Error(data.message ?? 'Failed to create todo.');
  }
  const raw = await parseJsonSafely<Record<string, unknown>>(response);
  return extractSingleTodo(raw);
};

export const updateTodo = async (id: string, payload: UpdateTodoPayload): Promise<Todo> => {
  const response = await authFetch(`/tasks/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const data = await parseJsonSafely<{ message?: string }>(response);
    throw new Error(data.message ?? 'Failed to update todo.');
  }
  const raw = await parseJsonSafely<Record<string, unknown>>(response);
  return extractSingleTodo(raw);
};

export const deleteTodoApi = async (id: string): Promise<void> => {
  const response = await authFetch(`/tasks/delete/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const data = await parseJsonSafely<{ message?: string }>(response);
    throw new Error(data.message ?? 'Failed to delete todo.');
  }
};
