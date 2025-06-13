// Import React
import React from 'react';
// Import icons from lucide-react for UI styling
import { LogOut, User, Shield, CheckCircle } from 'lucide-react';
// Import the useAuth hook for accessing user data and logout function
import { useAuth } from '../contexts/AuthContext';

// Define the Dashboard functional component
const Dashboard: React.FC = () => {
  // Destructure user data and logout function from AuthContext
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">

        {/* Header Section: Shows user name, email, and Sign Out button */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            
            {/* User Avatar and Info */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Sign Out Button */}
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Authentication Confirmation Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="text-center">
            {/* CheckCircle icon in green circle */}
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Authentication Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              You have successfully logged in to your account. Your session is secure and protected.
            </p>
          </div>
        </div>

        {/* Feature Cards Grid: Shows features like security, profile, session */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1: Secure Authentication */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Secure Authentication
            </h3>
            <p className="text-gray-600">
              Your account is protected with industry-standard security measures including password hashing and JWT tokens.
            </p>
          </div>

          {/* Feature 2: User Profile */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              User Profile
            </h3>
            <p className="text-gray-600">
              Manage your personal information and account settings in a secure environment.
            </p>
          </div>

          {/* Feature 3: Session Management */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow duration-200">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Session Management
            </h3>
            <p className="text-gray-600">
              Your login session is automatically managed with secure token-based authentication.
            </p>
          </div>
        </div>

        {/* User Account Information Card */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h3>
          <div className="space-y-3">
            {/* Name */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium text-gray-900">{user?.name}</span>
            </div>

            {/* Email */}
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{user?.email}</span>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Status:</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the Dashboard component
export default Dashboard;
