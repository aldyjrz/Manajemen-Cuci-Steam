import { post } from './api';

export async function loginUser(username: string, password: string) {
  const result = await post<{ token: string; user: unknown }>('auth/login', {
    username,
    password,
  });
  localStorage.setItem('token', result.data.token);
  localStorage.setItem('user', JSON.stringify(result.data.user));
  return result.data.user;
}

export function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

export function getCurrentUser() {
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
