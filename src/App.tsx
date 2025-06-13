import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext'; 
// 🔁 AuthProvider connects to auth logic (server) and provides user data via useAuth

import LoginForm from './components/LoginForm';     // 🧾 Login form that likely sends request to server
import RegisterForm from './components/RegisterForm'; // 🧾 Registration form that likely sends request to server
import Dashboard from './components/Dashboard';     // 📊 Page shown after successful login (user is fetched from server)

const AuthContainer: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);  // 🔄 Tracks whether login or register form is shown
  const { user, loading } = useAuth();           
  // 📡 Gets user and loading state from AuthContext (which communicates with the server)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600 font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (user) {
    return <Dashboard />; // ✅ If user is logged in (checked from server), show dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      {isLogin ? (
        <LoginForm onToggleMode={() => setIsLogin(false)} /> 
        // 🧾 Login form — probably sends login request to server
      ) : (
        <RegisterForm onToggleMode={() => setIsLogin(true)} /> 
        // 🧾 Registration form — probably sends signup request to server
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AuthContainer />
    </AuthProvider>
  );
  // 🛡️ Wraps entire app with AuthProvider — handles fetching/saving user from/to server
}

export default App;
