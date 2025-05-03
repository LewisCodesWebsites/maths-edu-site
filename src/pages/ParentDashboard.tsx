// src/pages/ParentDashboard.tsx
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import API_BASE from '../api';

type Partner = {
  name: string;
  email: string;
  addedAt: string;
}

const ParentDashboard = () => {
  const { user, logout, removeChild } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [childToRemove, setChildToRemove] = useState<string | null>(null);
  
  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [partners, setPartners] = useState<Partner[]>([]);
  const [partnerName, setPartnerName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [partnerPassword, setPartnerPassword] = useState('');
  const [partnerToRemove, setPartnerToRemove] = useState<string | null>(null);
  
  // Get child data from user context
  const childUsernames = user?.children || [];
  
  // Calculate child slots info
  const currentChildren = childUsernames.length;
  const maxAllowed = user?.maxChildren || currentChildren;
  const availableSlots = user?.availableChildSlots ?? Math.max(0, maxAllowed - currentChildren);
  const canAddMoreChildren = availableSlots > 0;

  // Fetch partners when dashboard loads
  useEffect(() => {
    if (user && user.email) {
      fetchPartners();
    }
  }, [user]);

  const fetchPartners = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/parent/partners/${encodeURIComponent(user.email)}`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch partners');
      }
      
      const data = await response.json();
      if (data.partners) {
        setPartners(data.partners);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle child removal
  const handleRemoveChild = async (username: string) => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const result = await removeChild(username);
      
      if (result.success) {
        setMessage(`Successfully removed child: ${username}`);
        setChildToRemove(null);
      } else {
        setError(result.error || 'Failed to remove child');
      }
    } catch (err) {
      setError('An error occurred when removing the child');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle saving settings
  const handleSaveSettings = async () => {
    if (!user?.email) return;
    
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/api/parent/settings/${encodeURIComponent(user.email)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newName,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Settings updated successfully');
        // Update the user context with new name
        if (data.user) {
          // Update local user state or context
        }
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setError('An error occurred when saving settings');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding a partner
  const handleAddPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/api/parent/partners/${encodeURIComponent(user.email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: partnerName,
          email: partnerEmail,
          password: partnerPassword, // Include password in the request
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Partner added successfully');
        setPartners(data.partners || []);
        setPartnerName('');
        setPartnerEmail('');
        setPartnerPassword('');
      } else {
        setError(data.error || 'Failed to add partner');
      }
    } catch (err) {
      setError('An error occurred when adding partner');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing a partner
  const handleRemovePartner = async (email: string) => {
    if (!user?.email) return;
    
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch(`${API_BASE}/api/parent/partners/${encodeURIComponent(user.email)}/${encodeURIComponent(email)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Partner removed successfully');
        setPartners(data.partners || []);
        setPartnerToRemove(null);
      } else {
        setError(data.error || 'Failed to remove partner');
      }
    } catch (err) {
      setError('An error occurred when removing partner');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Math-themed SVG logo component
  const MathLogoSVG = () => (
    <svg className="h-10 w-auto" viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="60" height="60" rx="8" fill="#4F46E5"/>
      <path d="M15 30L30 15L45 30L30 45L15 30Z" fill="white"/>
      <path d="M23 23L37 37" stroke="#4338CA" strokeWidth="4" strokeLinecap="round"/>
      <path d="M23 37L37 23" stroke="#4338CA" strokeWidth="4" strokeLinecap="round"/>
      <text x="70" y="40" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#4F46E5">MathWizard</text>
    </svg>
  );

  // Render settings modal
  const renderSettingsModal = () => {
    if (!showSettings) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-6 max-w-lg w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-indigo-900">Account Settings</h2>
            <button 
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600 bg-transparent p-1"
            >
              <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-xl">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-xl">
              {message}
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-indigo-700">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-200 bg-gray-100 text-gray-500 rounded-xl"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={isLoading || !newName}
                className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-indigo-300 shadow-md transform hover:translate-y-[-1px] transition"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-2 text-indigo-700">Managing Partners</h3>
            <p className="text-sm text-gray-600 mb-4">
              Add up to 4 partners who can help manage your children's accounts
            </p>

            {partners.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Partners</h4>
                <ul className="space-y-2">
                  {partners.map((partner, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm">
                      <div>
                        <div className="font-medium text-indigo-900">{partner.name}</div>
                        <div className="text-sm text-gray-500">{partner.email}</div>
                      </div>
                      {partnerToRemove === partner.email ? (
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">Remove?</span>
                          <button
                            onClick={() => handleRemovePartner(partner.email)}
                            className="text-xs bg-red-500 text-white px-3 py-2 rounded-xl shadow-sm"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => setPartnerToRemove(null)}
                            className="text-xs bg-gray-300 px-3 py-2 rounded-xl shadow-sm"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPartnerToRemove(partner.email)}
                          className="text-xs text-red-600 hover:text-red-800 bg-transparent p-0 hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {partners.length < 4 && (
              <form onSubmit={handleAddPartner} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Name</label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={(e) => setPartnerName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Email</label>
                  <input
                    type="email"
                    value={partnerEmail}
                    onChange={(e) => setPartnerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partner Password</label>
                  <input
                    type="password"
                    value={partnerPassword}
                    onChange={(e) => setPartnerPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                    placeholder="Create a password for this partner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !partnerName || !partnerEmail || !partnerPassword}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-green-300 shadow-md transform hover:translate-y-[-1px] transition"
                >
                  {isLoading ? 'Adding...' : 'Add Partner'}
                </button>
              </form>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowSettings(false)}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 shadow transform hover:translate-y-[-1px] transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Header */}
      <header className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <MathLogoSVG />
              <div>
                <p className="text-xs font-medium opacity-75">Welcome back</p>
                <p className="font-bold">{user?.name || 'Parent'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowSettings(true)}
                className="text-sm bg-indigo-800 text-white px-4 py-2 rounded-xl hover:bg-indigo-900 shadow-lg"
              >
                Settings
              </button>
              <button 
                onClick={logout}
                className="text-sm bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-indigo-600 text-white py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative z-10">
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Welcome to MathWizard</h1>
              <p className="text-xl opacity-90 mb-6">
                Helping your children develop strong math skills through fun and interactive learning.
              </p>
              {canAddMoreChildren && (
                <Link
                  to="/add-child"
                  className="inline-block bg-white text-indigo-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:translate-y-[-2px]"
                >
                  Add a New Child
                </Link>
              )}
            </div>
            <div className="relative h-64 md:h-auto">
              {/* Placeholder for a math-related hero image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-4 bg-white bg-opacity-20 rounded-full">
                  <svg className="h-40 w-40 text-white opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 5h2v14H7V5zm8 0h2v14h-2V5zm-4 0h2v14h-2V5zm-8 7h18v2H3v-2z" />
                  </svg>
                </div>
              </div>
              {/* Abstract shapes in the background */}
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-yellow-400 rounded-full opacity-20"></div>
              <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-green-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
        {/* Decorative waves */}
        <svg className="absolute bottom-0 w-full h-8 text-white" viewBox="0 0 1440 48" fill="currentColor" preserveAspectRatio="none">
          <path d="M0 48h1440V20.5C1295.1 6.8 1149.6 0 1003.5 0 715.3 0 427.2 16 213.6 24 142.4 27.3 71.2 34.7 0 48v0z" />
        </svg>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {error && !showSettings && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-xl shadow">
            {error}
          </div>
        )}
        
        {message && !showSettings && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-xl shadow">
            {message}
          </div>
        )}
        
        <h2 className="text-2xl font-bold text-indigo-900 mb-8 text-center">Student Dashboard</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Children List */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-indigo-900">Your Children</h2>
                <div className="text-sm text-indigo-600 font-medium px-3 py-1 bg-indigo-100 rounded-full">
                  {currentChildren} of {maxAllowed} children
                </div>
              </div>

              {childUsernames.length > 0 ? (
                <ul className="space-y-6">
                  {childUsernames.map((username, index) => (
                    <li key={index} className="border-b pb-6 last:border-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                          {/* Child avatar - stylized to math theme */}
                          <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {username.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-grow">
                            <h3 className="text-lg font-bold text-indigo-900">{username}</h3>
                            <div className="w-full bg-gray-200 rounded-full h-3 mt-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full" 
                                style={{ width: `50%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm mt-1">
                              <p className="text-indigo-700 font-medium">
                                50% overall progress
                              </p>
                              <p className="text-gray-500">
                                Last active: Today
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <Link 
                            to={`/child/${username}`}
                            className="flex-1 md:flex-none text-center text-sm bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 shadow-md transform hover:translate-y-[-1px] transition"
                          >
                            View Dashboard
                          </Link>
                          {childToRemove === username ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">Confirm:</span>
                              <button
                                onClick={() => handleRemoveChild(username)}
                                className="text-sm bg-red-500 text-white px-3 py-2 rounded-xl hover:bg-red-600 shadow"
                                disabled={isLoading}
                              >
                                {isLoading ? 'Removing...' : 'Yes'}
                              </button>
                              <button
                                onClick={() => setChildToRemove(null)}
                                className="text-sm bg-gray-300 text-gray-700 px-3 py-2 rounded-xl hover:bg-gray-400 shadow"
                                disabled={isLoading}
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setChildToRemove(username)}
                              className="text-sm bg-red-100 text-red-800 px-3 py-2 rounded-xl hover:bg-red-200 shadow"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 text-center">
                  <div className="mb-4 inline-flex items-center justify-center h-24 w-24 rounded-full bg-indigo-100">
                    <svg className="h-12 w-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <p className="text-lg text-gray-500">No children added yet</p>
                  {canAddMoreChildren && (
                    <Link
                      to="/add-child"
                      className="mt-4 inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 shadow-md"
                    >
                      Add Your First Child
                    </Link>
                  )}
                </div>
              )}
            </div>

            {/* Featured Content - Math Learning Resources */}
            <div className="mt-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Math Learning Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                  <div className="text-lg font-semibold mb-2">Multiplication Tables</div>
                  <p className="text-sm opacity-90">Interactive games to help master multiplication facts</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                  <div className="text-lg font-semibold mb-2">Fractions & Decimals</div>
                  <p className="text-sm opacity-90">Visual aids and practice problems with step-by-step solutions</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                  <div className="text-lg font-semibold mb-2">Geometry Basics</div>
                  <p className="text-sm opacity-90">Shapes, angles, and measurement activities</p>
                </div>
                <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                  <div className="text-lg font-semibold mb-2">Word Problems</div>
                  <p className="text-sm opacity-90">Real-world applications of math concepts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-6">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  to="/add-child"
                  className={`block w-full text-center py-3 px-4 rounded-xl font-bold ${
                    canAddMoreChildren
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAddMoreChildren
                    ? `Add New Child (${availableSlots} left)`
                    : 'Maximum Children Reached'}
                </Link>
                <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition">
                  View Billing & Subscription
                </button>
                <button 
                  onClick={() => setShowSettings(true)}
                  className="w-full bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-900 py-3 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition"
                >
                  Account Settings
                </button>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white shadow-lg rounded-2xl p-6 border border-indigo-100">
              <h2 className="text-xl font-bold text-indigo-900 mb-6">Account Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{user?.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Child Account Limit</p>
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full w-full h-2 mr-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (currentChildren/maxAllowed) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-indigo-700 font-medium text-sm">{currentChildren}/{maxAllowed}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Managing Partners</p>
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-full w-full h-2 mr-2">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(100, (partners.length/4) * 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-indigo-700 font-medium text-sm">{partners.length}/4</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Math Progress Stats */}
            <div className="bg-gradient-to-br from-indigo-800 to-purple-900 text-white shadow-lg rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">Math Progress</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Addition & Subtraction</span>
                    <span>78%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{width: '78%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Multiplication</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{width: '65%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Division</span>
                    <span>42%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div className="bg-orange-400 h-2 rounded-full" style={{width: '42%'}}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">Fractions</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <MathLogoSVG />
              <p className="mt-4 text-indigo-100">
                Helping children excel in mathematics through interactive learning and practice.
              </p>
            </div>
            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Features</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><a href="#" className="hover:text-white hover:underline">Interactive Lessons</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Math Games</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Progress Tracking</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Personalized Learning</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Support</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><a href="#" className="hover:text-white hover:underline">Help Center</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Legal</h3>
                <ul className="space-y-2 text-indigo-100">
                  <li><a href="#" className="hover:text-white hover:underline">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white hover:underline">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-indigo-800 text-center text-indigo-200">
            <p>&copy; {new Date().getFullYear()} MathWizard. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Settings Modal */}
      {renderSettingsModal()}
    </div>
  );
};

export default ParentDashboard;