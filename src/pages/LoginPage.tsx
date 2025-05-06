// src/pages/LoginPage.tsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Logo from '../pictures/logo.svg';
import API_BASE from '../api';

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [childPassword, setChildPassword] = useState("");
  const [loginType, setLoginType] = useState<"adult" | "child">("adult");
  const [loginStep, setLoginStep] = useState(1); // Step 1: Email, Step 2: Password
  const { login, loginChild, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [accountType, setAccountType] = useState<string>(""); // "parent" or "school"

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !email.includes('@')) {
      setError("Please enter a valid email address");
      return;
    }
    
    try {
      // Call API to verify email exists
      const response = await fetch(`${API_BASE}/api/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.exists) {
        setEmailExists(true);
        setAccountType(data.accountType || "parent"); // Default to parent if not specified
        setLoginStep(2);
      } else {
        setError("No account found with this email. Please register first.");
      }
    } catch (err) {
      setError("An error occurred while checking your email");
      console.error(err);
    }
  };

  const handleAdultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const success = await login(email, password);
      if (success) {
        navigate("/dashboard");
      } else {
        setError("Invalid password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    }
  };

  const handleChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try {
      const success = await loginChild(username, childPassword);
      if (success) {
        navigate("/child/" + username);
      } else {
        setError("Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred during login");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <header className="header">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-4">
            <img src={Logo} alt="MathWizard Logo" className="h-14 w-auto drop-shadow-lg animate-float" />
            <span className="text-2xl font-extrabold text-primary tracking-tight">MathWizard</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/" className="btn-primary">Back to Home</Link>
          </div>
        </div>
      </header>
      {/* Fun floating background shapes */}
      <div className="bg-shape w-60 h-60 bg-primary top-[-60px] left-[-60px] animate-float" style={{zIndex:0}}></div>
      <div className="bg-shape w-48 h-48 bg-primary bottom-[-48px] right-[-48px] animate-float" style={{zIndex:0}}></div>

      <div className="relative overflow-hidden py-8">
        <div className="max-w-md mx-auto px-4 sm:px-6 relative z-10">
          <div className="card">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-indigo-900">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to access your account</p>
            </div>

            {/* Login Type Toggle */}
            <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
              <button
                onClick={() => {
                  setLoginType("adult");
                  setLoginStep(1);
                  setError("");
                }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  loginType === "adult"
                    ? "bg-white shadow text-indigo-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Parent/School Login
              </button>
              <button
                onClick={() => {
                  setLoginType("child");
                  setError("");
                }}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                  loginType === "child"
                    ? "bg-white shadow text-indigo-700"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Child Login
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-xl text-center">
                {error}
              </div>
            )}
            
            {loginType === "adult" ? (
              // Parent/School Login Form - Two-Step Process
              loginStep === 1 ? (
                // Step 1: Email
                <form className="space-y-4" onSubmit={handleCheckEmail}>
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
                  
                  <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition disabled:opacity-70"
                    disabled={isLoading}
                  >
                    {isLoading ? "Checking..." : "Next"}
                  </button>
                </form>
              ) : (
                // Step 2: Password
                <form className="space-y-4" onSubmit={handleAdultSubmit}>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                      <button 
                        type="button"
                        onClick={() => {
                          setLoginStep(1);
                          setPassword("");
                          setError("");
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Change
                      </button>
                    </div>
                    <div className="p-2 bg-gray-50 rounded-lg mb-4 text-gray-700 border border-gray-200">
                      {email}
                      {accountType === "parent" ? (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Parent Account
                        </span>
                      ) : (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          School Account
                        </span>
                      )}
                    </div>
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
                      autoFocus
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
                      <button 
                        type="button"
                        onClick={() => navigate("/reset-password")}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        Forgot password?
                      </button>
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
              )
            ) : (
              // Child Login Form (Unchanged)
              <form className="space-y-4" onSubmit={handleChildSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    id="username"
                    type="text"
                    placeholder="Your username"
                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="childPassword" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    id="childPassword"
                    type="password"
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    value={childPassword}
                    onChange={(e) => setChildPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center">
                  <input
                    id="remember-me-child"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="remember-me-child" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-4 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:translate-y-[-1px] transition disabled:opacity-70"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>

                <div className="text-center text-sm text-indigo-600 mt-2">
                  <p>Ask your parent for your username and password</p>
                </div>
              </form>
            )}
            
            {loginType === "adult" && loginStep === 1 && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => navigate("/register/parent")}
                    className="w-full inline-flex justify-center py-3 px-4 border border-indigo-300 rounded-xl bg-indigo-50 text-indigo-800 text-sm font-medium hover:bg-indigo-100 transition"
                  >
                    Register as Parent
                  </button>
                  <button
                    onClick={() => navigate("/register/school")}
                    className="w-full inline-flex justify-center py-3 px-4 border border-indigo-300 rounded-xl bg-indigo-50 text-indigo-800 text-sm font-medium hover:bg-indigo-100 transition"
                  >
                    Register as School
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Additional helper text */}
          <div className="text-center mt-6 text-sm text-gray-600">
            Having trouble? <button onClick={() => navigate("/support/contact")} className="text-indigo-600 hover:underline">Contact support</button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-primary text-white py-8 rounded-t-3xl shadow-2xl">
        <div className="container text-center">
          <p className="text-secondary">
            &copy; {new Date().getFullYear()} MathWizard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}