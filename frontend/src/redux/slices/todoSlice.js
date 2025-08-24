import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todoAPI } from '../../services/api';

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async (_, { rejectWithValue }) => {
    try {
      const todos = await todoAPI.getTodos();
      return todos;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch todos');
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todoData, { rejectWithValue }) => {
    try {
      const newTodo = await todoAPI.createTodo(todoData);
      return newTodo; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to add todo');
    }
  }
);

export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(id, updates);
      return { id, updates: updatedTodo }; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update todo');
    }
  }
);

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (id, { rejectWithValue }) => {
    try {
      await todoAPI.deleteTodo(id);
      return id; 
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete todo');
    }
  }
);

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Todos
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
        state.error = null;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Todo
      .addCase(addTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload); // Add to existing list
        state.error = null;
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Todo
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;
        const todoIndex = state.list.findIndex(todo => todo._id === id);
        if (todoIndex !== -1) {
          state.list[todoIndex] = { ...state.list[todoIndex], ...updates };
        }
        state.error = null;
      })
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Todo
      .addCase(deleteTodo.fulfilled, (state, action) => {
        state.list = state.list.filter(todo => todo._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTodo.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { clearError } = todoSlice.actions;
export default todoSlice.reducer;