import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:7000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  signup: async (userData) => {
    const response = await API.post('/signUp', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await API.post('/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await API.get('/profile');
    return response.data;
  },

  logout: async () => {
    const response = await API.post('/logout');
    return response.data;
  }
};

export const todoAPI = {
  getTodos: async () => {
    const response = await API.get('/api/todos');
    return response.data;
  },

  createTodo: async (todoData) => {
    const response = await API.post('/api/todos', todoData);
    return response.data;
  },

  updateTodo: async (id, updates) => {
    const response = await API.patch(`/api/todos/${id}`, updates);
    return response.data;
  },

  deleteTodo: async (id) => {
    const response = await API.delete(`/api/todos/${id}`);
    return response.data;
  }
};

export default API;
