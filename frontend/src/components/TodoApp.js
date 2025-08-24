import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from '../redux/slices/todoSlice';
import { logoutUser } from '../redux/slices/authSlice';
import Loading from './UI/Loading';
import ErrorMessage from './UI/ErrorMessage';

const TodoApp = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [editingTodo, setEditingTodo] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '' });
  
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { list: todos, loading, error } = useSelector(state => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const resetForm = () => setFormData({ title: '', description: '' });
  const resetEditForm = () => {
    setEditingTodo(null);
    setEditFormData({ title: '', description: '' });
  };

  const handleInputChange = (e, isEdit = false) => {
    const setState = isEdit ? setEditFormData : setFormData;
    const state = isEdit ? editFormData : formData;
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      dispatch(addTodo({ ...formData, completed: false }));
      resetForm();
    }
  };

  const handleEditTodo = (todo) => {
    setEditingTodo(todo._id);
    setEditFormData({
      title: todo.title,
      description: todo.description || ''
    });
  };

  const handleUpdateTodo = (e) => {
    e.preventDefault();
    if (editFormData.title.trim()) {
      dispatch(updateTodo({
        id: editingTodo,
        updates: editFormData
      }));
      resetEditForm();
    }
  };

  const handleToggleComplete = (todo) => {
    dispatch(updateTodo({
      id: todo._id,
      updates: { completed: !todo.completed }
    }));
  };

  const handleDeleteTodo = (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      dispatch(deleteTodo(id));
    }
  };

  const handleLogout = () => dispatch(logoutUser());

  if (loading && todos.length === 0) {
    return <Loading message="Loading todos..." />;
  }

  return (
    <div className="todo-app">
      <div className="todo-header">
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <div className="todo-container">
        <ErrorMessage error={error} />
        
        <form onSubmit={handleAddTodo} className="add-todo-form">
          <input
            type="text"
            name="title"
            placeholder="Todo title..."
            value={formData.title}
            onChange={(e) => handleInputChange(e)}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description (optional)..."
            value={formData.description}
            onChange={(e) => handleInputChange(e)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </form>

        <div className="todos-list">
          {todos.length === 0 && !loading ? (
            <p>No todos yet! Add one above.</p>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                {editingTodo === todo._id ? (
                  <form onSubmit={handleUpdateTodo} className="edit-todo-form">
                    <input
                      type="text"
                      name="title"
                      value={editFormData.title}
                      onChange={(e) => handleInputChange(e, true)}
                      required
                      className="edit-input"
                    />
                    <input
                      type="text"
                      name="description"
                      value={editFormData.description}
                      onChange={(e) => handleInputChange(e, true)}
                      placeholder="Description (optional)..."
                      className="edit-input"
                    />
                    <div className="edit-actions">
                      <button type="submit" className="save-btn">Save</button>
                      <button type="button" onClick={resetEditForm} className="cancel-btn">
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="todo-content">
                      <h3>{todo.title}</h3>
                      {todo.description && <p>{todo.description}</p>}
                    </div>
                    <div className="todo-actions">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo)}
                      />
                      <button 
                        onClick={() => handleEditTodo(todo)}
                        className="edit-btn"
                        disabled={todo.completed}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTodo(todo._id)}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;