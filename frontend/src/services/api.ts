import config from '../config';

export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown[];
};

const getToken = () => {
  return localStorage.getItem('token') ?? '';
};

const buildUrl = (path: string) => {
  const baseUrl = config.apiUrl?.replace(/\/$/, '') ?? '';
  const normalizedPath = path.replace(/^\//, '');
  return `${baseUrl}/${normalizedPath}`;
};

const request = async <T = unknown>(path: string, options: RequestInit = {}) => {
  const url = buildUrl(path);
  const token = getToken();

  const headers: HeadersInit = {
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, { ...options, headers });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || response.statusText || 'Request failed';
    const error = new Error(message) as Error & { status?: number; payload?: unknown };
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload as ApiResponse<T>;
};

export const get = async <T = unknown>(path: string) => {
  return request<T>(path, { method: 'GET' });
};

export const post = async <T = unknown>(path: string, body: unknown) => {
  return request<T>(path, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
};

export const put = async <T = unknown>(path: string, body: unknown) => {
  return request<T>(path, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body),
  });
};

export const del = async <T = unknown>(path: string) => {
  return request<T>(path, { method: 'DELETE' });
};
