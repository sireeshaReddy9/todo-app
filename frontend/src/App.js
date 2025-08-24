import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/slices/authSlice';
import Login from './components/Login';
import Signup from './components/Signup';
import TodoApp from './components/TodoApp';
import Loading from './components/UI/Loading';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (loading) {
    return <Loading />;
  }

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" replace />;
  };

  const AuthRoute = ({ children }) => {
    return !isAuthenticated ? children : <Navigate to="/todos" replace />;
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/signup" element={<AuthRoute><Signup /></AuthRoute>} />
        <Route path="/todos" element={<ProtectedRoute><TodoApp /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/todos" : "/login"} replace />} />
      </Routes>
    </div>
  );
}

export default App;