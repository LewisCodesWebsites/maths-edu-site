// src/pages/LoginPage.tsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-4">
              <MathLogoSVG />
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-sm text-white px-4 py-2 hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden py-12">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-yellow-400 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 bg-green-400 rounded-full opacity-20"></div>
        
        <div className="max-w-md mx-auto px-4 sm:px-6 relative z-10">
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-indigo-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-indigo-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to access your account</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-xl text-center">
                {error}
              </div>
            )}
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <a href="#" className="text-indigo-600 hover:text-indigo-800">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition disabled:opacity-70"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/register/parent")}
                  className="w-full inline-flex justify-center py-3 px-4 border border-indigo-300 rounded-xl bg-indigo-50 text-indigo-800 text-sm font-medium hover:bg-indigo-100 transition"
                >
                  Register as Parent
                </button>
                <button
                  onClick={() => navigate("/register/school")}
                  className="w-full inline-flex justify-center py-3 px-4 border border-green-300 rounded-xl bg-green-50 text-green-800 text-sm font-medium hover:bg-green-100 transition"
                >
                  Register as School
                </button>
              </div>
            </div>
          </div>
          
          {/* Additional helper text */}
          <div className="text-center mt-8 text-sm text-gray-600">
            Having trouble? <a href="#" className="text-indigo-600 hover:underline">Contact support</a>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-indigo-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-indigo-200">
            &copy; {new Date().getFullYear()} MathWizard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}