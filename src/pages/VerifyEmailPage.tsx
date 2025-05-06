import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import API_BASE from '../api';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'loading' | 'form' | 'success' | 'error'>(token ? 'loading' : 'form');
  const [message, setMessage] = useState<string>(token ? 'Verifying...' : 'Enter the 6-digit code sent to your email.');

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE}/api/verify-email?token=${encodeURIComponent(token)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setStatus('success');
            setMessage(data.message || 'Email verified successfully.');
          } else {
            setStatus('error');
            setMessage(data.error || 'Verification failed.');
          }
        })
        .catch(() => {
          setStatus('error');
          setMessage('Network error during verification.');
        });
    }
  }, [token]);

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setStatus('error'); setMessage('Email parameter missing.'); return;
    }
    setStatus('loading'); setMessage('Verifying code...');
    try {
      const res = await fetch(`${API_BASE}/api/verify-code`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success'); setMessage(data.message || 'Email verified successfully.');
      } else {
        setStatus('error'); setMessage(data.error || 'Invalid code.');
      }
    } catch (error) {
      console.error('Verification code error:', error);
      setStatus('error'); setMessage('Network error during code verification.');
    }
  };

  // Render
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6 text-center">
        {status === 'loading' && <p className="text-gray-700">{message}</p>}

        {status === 'form' && (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <h1 className="text-xl font-medium">Verify Email</h1>
            <p className="text-gray-600">{message}</p>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              required
              className="w-full p-3 border rounded-md"
            />
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Verify Code
            </button>
          </form>
        )}

        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Success!</h1>
            <p className="text-gray-700 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go to Login
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
            <p className="text-gray-700 mb-4">{message}</p>
            <div className="flex justify-center gap-4">
              <Link to="/register/parent" className="text-blue-600 hover:underline">Register Again</Link>
              <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;