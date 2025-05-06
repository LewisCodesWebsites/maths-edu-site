// src/pages/AddChildPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const AddChildPage = () => {
  const [childName, setChildName] = useState('');
  const [childUsername, setChildUsername] = useState('');
  const [childPassword, setChildPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [childYear, setChildYear] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [useAutoPassword, setUseAutoPassword] = useState(true);
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

    if (!childYear) {
      setError('Please select a year/grade level for your child');
      return;
    }

    // Validate passwords match if custom password is selected
    if (!useAutoPassword) {
      if (childPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      if (childPassword !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    try {
      const result = await addChild({
        name: childName,
        username: childUsername,
        password: useAutoPassword ? undefined : childPassword,
        year: childYear
      });
      
      if (result.success) {
        setMessage(`Child added successfully!\nUsername: ${result.child.username}\nPassword: ${useAutoPassword ? result.child.password : 'Your custom password'}`);
        setChildName('');
        setChildUsername('');
        setChildPassword('');
        setConfirmPassword('');
        setChildYear('');
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

  // Years/grades for UK system
  const yearOptions = [
    { value: "reception", label: "Reception (4-5 years)" },
    { value: "year1", label: "Year 1 (5-6 years)" },
    { value: "year2", label: "Year 2 (6-7 years)" },
    { value: "year3", label: "Year 3 (7-8 years)" },
    { value: "year4", label: "Year 4 (8-9 years)" },
    { value: "year5", label: "Year 5 (9-10 years)" },
    { value: "year6", label: "Year 6 (10-11 years)" },
    { value: "year7", label: "Year 7 (11-12 years)" },
    { value: "year8", label: "Year 8 (12-13 years)" },
    { value: "year9", label: "Year 9 (13-14 years)" },
    { value: "year10", label: "Year 10 (14-15 years)" },
    { value: "year11", label: "Year 11 (15-16 years)" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md mb-6">
        <h1 className="text-2xl font-bold mb-6">Add a Child</h1>
        
        <div className="mb-6 p-4 bg-blue-50 rounded-xl">
          <h3 className="font-medium text-blue-800">Your Child Account Summary</h3>
          <p className="text-blue-700">Current children: {currentChildren} of {maxAllowed}</p>
          <p className="text-blue-700">Available slots: {availableSlots}</p>
        </div>
        
        {/* Feature info for Math Ranked */}
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <h3 className="font-medium text-yellow-800">Enable Maths Ranked</h3>
          <p className="text-gray-700 text-sm mt-1">
            Creating a child account gives your child access to Maths Ranked - our competitive
            gaming platform where they can compete with others in their year group.
          </p>
          <Link to="/features/maths-ranked" className="text-indigo-600 text-sm hover:text-indigo-800 mt-2 inline-block font-medium">
            Learn more about Maths Ranked →
          </Link>
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
                placeholder="Jane Smith"
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
                placeholder="jane_smith"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This username will be used for login and will be visible to other students.
              </p>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Year/Grade Level</label>
              <select
                className="w-full border rounded-xl p-3 bg-white"
                value={childYear}
                onChange={(e) => setChildYear(e.target.value)}
                required
              >
                <option value="">Select year/grade...</option>
                {yearOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-500 mt-1">
                This helps us provide age-appropriate content for your child.
              </p>
            </div>

            <div className="py-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-indigo-600"
                  checked={useAutoPassword}
                  onChange={() => setUseAutoPassword(!useAutoPassword)}
                />
                <span className="ml-2">Generate password automatically</span>
              </label>
            </div>

            {!useAutoPassword && (
              <>
                <div>
                  <label className="block mb-2 font-medium">Password</label>
                  <input
                    type="password"
                    className="w-full border rounded-xl p-3"
                    value={childPassword}
                    onChange={(e) => setChildPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium">Confirm Password</label>
                  <input
                    type="password"
                    className="w-full border rounded-xl p-3"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

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

      {/* Child login instructions */}
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="font-bold text-lg mb-3">How do children log in?</h2>
        <p className="text-gray-700 mb-4">
          Children can log in using the "Child Login" tab on the login page with their username and password.
        </p>
        <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800">
          Go to login page →
        </Link>
      </div>
    </div>
  );
};

export default AddChildPage;