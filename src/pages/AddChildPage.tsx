// src/pages/AddChildPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AddChildPage = () => {
  const [childName, setChildName] = useState('');
  const [childUsername, setChildUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { user, addChild, isLoading } = useAuth();

  // Redirect if not logged in or not a parent
  if (!user || user.role !== 'parent') {
    return <Navigate to="/login" />;
  }

  // Calculate child slots info
  const currentChildren = user.children?.length || 0;
  const maxAllowed = user.maxChildren || currentChildren;
  const availableSlots = user.availableChildSlots ?? Math.max(0, maxAllowed - currentChildren);
  const canAddMoreChildren = availableSlots > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'parent') return;
    
    setMessage('');
    setError('');
    
    try {
      const result = await addChild({
        name: childName,
        username: childUsername
      });
      
      if (result.success) {
        setMessage(`Child added successfully!\nUsername: ${result.child.username}\nPassword: ${result.child.password}`);
        setChildName('');
        setChildUsername('');
      } else {
        setError('Error adding child: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      let errorMessage = 'Network error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Add a Child</h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-medium text-blue-800">Your Child Account Summary</h3>
          <p className="text-blue-700">Current children: {currentChildren} of {maxAllowed}</p>
          <p className="text-blue-700">Available slots: {availableSlots}</p>
        </div>
        
        {!canAddMoreChildren ? (
          <div className="text-center p-4 mb-6 bg-yellow-50 rounded-xl text-yellow-800">
            <p className="font-bold">You've reached your maximum number of children ({maxAllowed}).</p>
            <p>To add more children, you need to remove existing ones first.</p>
          </div>
        ) : null}
        
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {message && <div className="text-green-500 mb-4 text-center whitespace-pre-line">{message}</div>}
        
        {canAddMoreChildren ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Child's Full Name</label>
              <input
                type="text"
                className="w-full border rounded-xl p-3"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Username</label>
              <input
                type="text"
                className="w-full border rounded-xl p-3"
                value={childUsername}
                onChange={(e) => setChildUsername(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:bg-gray-400"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Child'}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default AddChildPage;