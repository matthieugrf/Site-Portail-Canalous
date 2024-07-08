import api from './api';
import { jwtDecode } from "jwt-decode";
export const login = async (username, password) => {
  try {
    const response = await api.post('/token/', { username, password });
    const { access, refresh } = response.data;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    const user = jwtDecode(access);
    return user;
  } catch (error) {
    throw new Error('Invalid credentials');
  }
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    return jwtDecode(token);
  } catch {
    return null;
  }
};
