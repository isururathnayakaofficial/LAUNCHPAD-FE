const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';

const buildAuthUrl = (endpoint: string) => {
  if (API_BASE_URL.endsWith('/api')) {
    return `${API_BASE_URL}${endpoint}`;
  }

  return `${API_BASE_URL}/api${endpoint}`;
};

type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};

type AuthResponse = {
  message?: string;
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

const parseJsonSafely = async (response: Response): Promise<AuthResponse> => {
  const responseText = await response.text();

  if (!responseText) {
    return {};
  }

  try {
    return JSON.parse(responseText) as AuthResponse;
  } catch {
    return { message: responseText };
  }
};

const requestAuth = async (endpoint: string, payload: AuthPayload): Promise<AuthResponse> => {
  const response = await fetch(buildAuthUrl(endpoint), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new Error(data.message ?? 'Authentication request failed.');
  }

  return data;
};

export const registerUser = (payload: Required<Pick<AuthPayload, 'name' | 'email' | 'password'>>) => {
  return requestAuth('/auth/register', payload);
};

export const loginUser = (payload: Pick<AuthPayload, 'email' | 'password'>) => {
  return requestAuth('/auth/login', payload);
};