// src/pages/ParentDashboard.tsx
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import API_BASE from '../api';
import Logo from '../pictures/logo.svg';

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

  const [childProgress, setChildProgress] = useState<Record<string, any[]>>({});
  const [childYears, setChildYears] = useState<Record<string, string>>({});
  const [topicsByYear, setTopicsByYear] = useState<Record<string, any>>({});

  useEffect(() => {
    async function fetchAll() {
      if (!user?.children || user.children.length === 0) return;
      const progressObj: Record<string, any[]> = {};
      const yearsObj: Record<string, string> = {};
      const topicsObj: Record<string, any> = {};
      for (const username of user.children) {
        // Fetch child info (progress, year)
        const res = await fetch(`${API_BASE}/api/children/${username}`);
        const data = await res.json();
        if (data.success && data.child) {
          progressObj[username] = data.child.progress || [];
          yearsObj[username] = data.child.year || 'reception';
          // Fetch topics for this child's year if not already fetched
          if (!topicsObj[yearsObj[username]]) {
            const tRes = await fetch(`${API_BASE}/api/topics/${yearsObj[username]}`);
            const tData = await tRes.json();
            topicsObj[yearsObj[username]] = tData.topics || {};
          }
        }
      }
      setChildProgress(progressObj);
      setChildYears(yearsObj);
      setTopicsByYear(topicsObj);
    }
    fetchAll();
  }, [user]);

  // Helper to get progress for a topic
  const getTopicScore = (progressArr: any[], topicTitle: string) => {
    const entry = progressArr.find((p) => p.topic === topicTitle);
    return entry ? entry.score : 0;
  };

  // Fetch partners when dashboard loads
  const fetchPartners = useCallback(async () => {
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
  }, [user?.email]);

  useEffect(() => {
    if (user && user.email) {
      fetchPartners();
    }
  }, [user, fetchPartners]);

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
      <header className="header">
        <div className="container flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={Logo} alt="MathWizard Logo" className="h-14 w-auto drop-shadow-lg animate-float" />
            <span className="text-2xl font-extrabold text-primary tracking-tight">MathWizard</span>
            <div className="ml-4">
              <p className="text-xs font-medium text-gray-600">Welcome back</p>
              <p className="font-bold text-primary">{user?.name || 'Parent'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => setShowSettings(true)} className="btn-primary">Settings</button>
            <button onClick={logout} className="btn-primary">Logout</button>
          </div>
        </div>
      </header>
      {/* Fun floating background shapes */}
      <div className="bg-shape w-72 h-72 bg-primary top-[-80px] left-[-80px] animate-float" style={{zIndex:0}}></div>
      <div className="bg-shape w-60 h-60 bg-primary bottom-[-60px] right-[-60px] animate-float" style={{zIndex:0}}></div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-primary to-green text-white py-12 relative overflow-hidden">
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

      <main className="container py-10">
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
        
        <h2 className="text-3xl font-extrabold text-primary mb-8 text-center drop-shadow-lg">Student Dashboard</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Children List */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-indigo-900">Your Children</h2>
                <div className="text-sm text-indigo-600 font-medium px-3 py-1 bg-indigo-100 rounded-full">
                  {currentChildren} of {maxAllowed} children
                </div>
              </div>

              {childUsernames.length > 0 ? (
                <ul className="space-y-6">
                  {childUsernames.map((username) => (
                    <li key={username} className="border-b pb-6 last:border-0">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                          {/* Child avatar - stylized to math theme */}
                          <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                            {username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-indigo-900">{username}</h3>
                            {/* Show topics for this child's year */}
                            {topicsByYear[childYears[username]] && Object.keys(topicsByYear[childYears[username]]).length > 0 ? (
                              Object.entries(topicsByYear[childYears[username]]).map(([section, levels]: any) => (
                                <div key={section} className="mb-2">
                                  <div className="font-semibold text-indigo-700">{section}</div>
                                  {Object.entries(levels).map(([level, topicList]: any) => (
                                    <div key={level} className="ml-2">
                                      <div className="text-sm font-medium capitalize text-gray-700">{level}</div>
                                      <ul className="ml-4">
                                        {topicList.map((topic: any) => (
                                          <li key={topic._id} className="mb-1">
                                            <span className="font-bold">{topic.title}:</span> {getTopicScore(childProgress[username] || [], topic.title)}% Correct
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  ))}
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-500 text-sm">No topics found</div>
                            )}
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
            <div className="mt-8 bg-gradient-to-r from-primary to-primary text-white rounded-3xl p-10 shadow-2xl">
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
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                {/* Close all open divs and main */}
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-primary text-white py-10 mt-16 rounded-t-3xl shadow-2xl">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <img src={Logo} alt="MathWizard Logo" className="h-10 w-auto" />
              <p className="mt-4 text-secondary">
                Helping children excel in mathematics through interactive learning and practice.
              </p>
            </div>
            {/* ...existing code... */}
          </div>
          {/* ...existing code... */}
        </div>
      </footer>
      {/* Settings Modal */}
      {renderSettingsModal()}
    </div>
  );
};

export default ParentDashboard;