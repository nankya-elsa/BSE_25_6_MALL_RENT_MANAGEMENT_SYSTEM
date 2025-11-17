// pages/ProfilePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  user_type: string;
  full_name: string;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        first_name: parsedUser.first_name,
        last_name: parsedUser.last_name,
        email: parsedUser.email,
        phone_number: parsedUser.phone_number
      });
      setLoading(false);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSaveProfile = () => {
    if (!user) return;
    
    const updatedUser: User = {
      id: user.id,
      username: user.username,
      user_type: user.user_type,
      full_name: user.full_name,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone_number: formData.phone_number
    };
    
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
          <div className="flex items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-purple-600">
                {user.first_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold">{user.first_name} {user.last_name}</h1>
              <p className="text-purple-100">{user.user_type}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profile Information</h2>
            <button
              onClick={() => setEditing(!editing)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                editing 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  value={editing ? formData.first_name : user.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                  disabled={!editing}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    editing 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-200 bg-gray-50'
                  } transition-all duration-200`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  value={editing ? formData.last_name : user.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                  disabled={!editing}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    editing 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-200 bg-gray-50'
                  } transition-all duration-200`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={editing ? formData.email : user.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  disabled={!editing}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    editing 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-200 bg-gray-50'
                  } transition-all duration-200`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={editing ? formData.phone_number : user.phone_number}
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                  disabled={!editing}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    editing 
                      ? 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200' 
                      : 'border-gray-200 bg-gray-50'
                  } transition-all duration-200`}
                />
              </div>
            </div>

            {editing && (
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-700 font-medium transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;