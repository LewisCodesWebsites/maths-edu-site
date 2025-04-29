import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterParentPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [maxChildren, setMaxChildren] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (maxChildren < 1) {
      setError("Number of children must be at least 1");
      return;
    }
    
    try {
      const result = await register({
        name,
        email,
        password,
        role: 'parent',
        maxChildren
      });
      
      if (result.success) {
        setMessage("Registration successful! Check your email for verification code.");
        // Redirect to verification page with email param
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred during registration");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register as Parent</h2>
        
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {message && <div className="text-green-500 mb-4 text-center">{message}</div>}
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Full Name</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded-xl p-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full border rounded-xl p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border rounded-xl p-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block mb-1 font-medium">Number of Children</label>
            <input
              type="number"
              min="1"
              className="w-full border rounded-xl p-3"
              value={maxChildren}
              onChange={(e) => setMaxChildren(parseInt(e.target.value))}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Set the maximum number of children you can add to your account
            </p>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:bg-green-400"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">Already have an account?</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-2 text-blue-600 hover:underline"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
