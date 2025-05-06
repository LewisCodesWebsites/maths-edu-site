// src/pages/AdminPage.tsx
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import API_BASE from '../api';

type UserData = {
  id: string;
  email: string;
  name?: string;
  role: 'parent' | 'teacher' | 'school' | 'admin';
  children?: string[];
  schoolId?: string;
  maxChildren?: number;
  numberOfTeachers?: number;
  createdAt: string;
};

const AdminPage = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'schools' | 'reports'>('users');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<UserData | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [newRole, setNewRole] = useState<'parent' | 'school'>('parent');
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newNumberOfTeachers, setNewNumberOfTeachers] = useState(1);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    maxChildren: 0,
    numberOfTeachers: 1
  });

  const [logs, setLogs] = useState<any[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/users`, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError('Error fetching users: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Fetch users error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSystemLogs = useCallback(async () => {
    setLogsLoading(true);
    setLogsError(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/system-logs`, {
        headers: {
          'Content-Type': 'application/json',
          'Admin-Email': user?.email || 'Unknown',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch system logs');
      }
      
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (err) {
      setLogsError('Error fetching logs: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Fetch logs error:', err);
    } finally {
      setLogsLoading(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
    if (activeTab === 'reports') {
      fetchSystemLogs();
    }
  }, [activeTab, fetchUsers, fetchSystemLogs]);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleDeleteUser = async (userId: string) => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const response = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Admin-Email': user?.email || 'Unknown',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMsg(`User successfully removed`);
        setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
        setUserToDelete(null);
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Error deleting user: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Delete user error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const endpoint = newRole === 'parent' ? '/api/register/parent' : '/api/register/school';
    const payload = newRole === 'parent'
      ? { name: newName, email: newEmail, password: newPassword }
      : { schoolName: newName, adminEmail: newEmail, password: newPassword, numberOfTeachers: newNumberOfTeachers };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMsg('Account created successfully');
        fetchUsers();
        setNewName(''); setNewEmail(''); setNewPassword(''); setNewNumberOfTeachers(1);
      } else {
        setError(data.error || data.message || 'Failed to create account');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (userData: UserData) => {
    setUserToEdit(userData);
    setEditFormData({
      name: userData.name || '',
      email: userData.email,
      maxChildren: userData.maxChildren || 0,
      numberOfTeachers: userData.numberOfTeachers || 1
    });
  };

  const handleSaveEdit = async () => {
    if (!userToEdit) return;
    
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    
    try {
      const endpoint = userToEdit.role === 'parent' 
        ? '/api/admin/update-parent'
        : '/api/admin/update-school';
        
      const response = await fetch(`${API_BASE}${endpoint}/${userToEdit.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Admin-Email': user?.email || 'Unknown',
        },
        body: JSON.stringify(editFormData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSuccessMsg('User updated successfully');
        setUsers(users.map(u => 
          u.id === userToEdit.id 
            ? { ...u, ...editFormData }
            : u
        ));
        setUserToEdit(null);
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Network error occurred while updating user');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (filterRole !== 'all' && user.role !== filterRole) {
      return false;
    }
    
    if (searchTerm && !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!user.name || !user.name.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    return true;
  });

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'parent': return 'bg-blue-100 text-blue-800';
      case 'teacher': return 'bg-green-100 text-green-800';
      case 'school': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLogTypeColor = (type: string) => {
    switch(type) {
      case 'error': return 'bg-red-100 text-red-800';
      case 'deletion': return 'bg-orange-100 text-orange-800';
      case 'edit': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderUserActions = (userData: UserData) => {
    if (userToDelete === userData.id) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Confirm delete?</span>
          <button
            onClick={() => handleDeleteUser(userData.id)}
            className="text-white bg-red-600 hover:bg-red-800 px-2 py-1 rounded"
          >
            Yes
          </button>
          <button
            onClick={() => setUserToDelete(null)}
            className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
          >
            No
          </button>
        </div>
      );
    }

    return (
      <>
        <button
          onClick={() => handleEditUser(userData)}
          className="text-indigo-600 hover:text-indigo-900 mr-4"
        >
          Edit
        </button>
        <button
          onClick={() => setUserToDelete(userData.id)}
          className="text-red-600 hover:text-red-900"
        >
          Delete
        </button>
      </>
    );
  };

  const renderEditModal = () => {
    if (!userToEdit) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-lg font-semibold mb-4">Edit {userToEdit.role === 'parent' ? 'Parent' : 'School'}</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={editFormData.name}
                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            
            {userToEdit.role === 'parent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Children</label>
                <input
                  type="number"
                  min="0"
                  value={editFormData.maxChildren}
                  onChange={(e) => setEditFormData({...editFormData, maxChildren: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
            
            {userToEdit.role === 'school' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Number of Teachers</label>
                <input
                  type="number"
                  min="1"
                  value={editFormData.numberOfTeachers}
                  onChange={(e) => setEditFormData({...editFormData, numberOfTeachers: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setUserToEdit(null)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReportsTab = () => {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">System Reports</h2>
              <p className="text-gray-500">View system logs and activity</p>
            </div>
            <button
              onClick={fetchSystemLogs}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={logsLoading}
            >
              {logsLoading ? 'Loading...' : 'Refresh Logs'}
            </button>
          </div>
        </div>
        
        {logsError && (
          <div className="p-4 bg-red-100 text-red-800">
            {logsError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logsLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading logs...</td>
                </tr>
              )}
              
              {!logsLoading && logs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No logs found
                  </td>
                </tr>
              )}
              
              {logs.map((log, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLogTypeColor(log.type)}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{log.message}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{log.adminEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => alert(JSON.stringify(log.details, null, 2))}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button 
            onClick={logout}
            className="text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow mb-6">
          <nav className="flex">
            <button 
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'users' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manage Users
            </button>
            <button 
              onClick={() => setActiveTab('schools')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'schools' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              Manage Schools
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-4 text-sm font-medium ${activeTab === 'reports' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
            >
              View Reports
            </button>
          </nav>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg">
            {successMsg}
          </div>
        )}

        {activeTab === 'users' && (
          <>
            <div className="bg-white shadow rounded-lg mb-6 p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Account</h2>
              <form onSubmit={handleCreateAccount} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select value={newRole} onChange={e => setNewRole(e.target.value as any)} className="mt-1 block w-full border-gray-300 rounded-md">
                    <option value="parent">Parent</option>
                    <option value="school">School</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {newRole === 'parent' ? 'Parent Name' : 'School Name'}
                  </label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    {newRole === 'parent' ? 'Email' : 'Admin Email'}
                  </label>
                  <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md" />
                </div>
                {newRole === 'school' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Number of Teachers</label>
                    <input type="number" min={1} value={newNumberOfTeachers} onChange={e => setNewNumberOfTeachers(Number(e.target.value))} required className="mt-1 block w-full border-gray-300 rounded-md" />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Manage User Accounts</h2>
                <p className="text-gray-500">View, search and manage user accounts</p>
              </div>
              
              <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by role:</label>
                  <select 
                    value={filterRole} 
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="all">All roles</option>
                    <option value="parent">Parents</option>
                    <option value="teacher">Teachers</option>
                    <option value="school">Schools</option>
                    <option value="admin">Admins</option>
                  </select>
                </div>
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search:</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by email or name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="flex-none self-end">
                  <button
                    onClick={fetchUsers}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Refresh'}
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading users...</td>
                      </tr>
                    )}
                    
                    {!loading && filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                          No users found matching your criteria
                        </td>
                      </tr>
                    )}
                    
                    {filteredUsers.map(userData => (
                      <tr key={userData.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{userData.name || 'No name'}</div>
                          <div className="text-sm text-gray-500">{userData.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(userData.role)}`}>
                            {userData.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {userData.role === 'parent' && (
                              <>Children: <span className="font-medium">{userData.children?.length || 0}/{userData.maxChildren || 0}</span></>
                            )}
                            {userData.role === 'school' && (
                              <>School ID: {userData.schoolId}</>
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            Created: {new Date(userData.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {renderUserActions(userData)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'schools' && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Schools</h2>
            <p className="text-gray-500">School management functionality to be implemented</p>
          </div>
        )}

        {activeTab === 'reports' && (
          renderReportsTab()
        )}

        {renderEditModal()}
      </main>
    </div>
  );
};

export default AdminPage;