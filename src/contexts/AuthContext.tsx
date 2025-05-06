// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import API_BASE from '../api';

type UserRole = 'parent' | 'teacher' | 'school' | 'admin' | 'child';

type User = {
  email?: string;
  name?: string;
  username?: string; // Added for child accounts
  role: UserRole;
  children?: string[];
  schoolId?: string;
  maxChildren?: number;
  availableChildSlots?: number;
  parentEmail?: string; // Added for child accounts
  yearGroup?: number; // Added for child accounts
  year?: string; // Added for child accounts with UK year system
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginChild: (username: string, password: string) => Promise<boolean>; // New child login method
  register: (userData: any) => Promise<{ success: boolean, message?: string }>;
  logout: () => void;
  addChild: (childData: { name: string, username: string, password?: string, year: string }) => Promise<{ success: boolean, error?: string, child?: any }>;
  removeChild: (username: string) => Promise<{ success: boolean, error?: string }>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to retrieve user from localStorage
const getSavedUser = (): User | null => {
  const savedUser = localStorage.getItem('user');
  return savedUser ? JSON.parse(savedUser) : null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getSavedUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        // Calculate available child slots based on maxChildren if user is a parent
        if (data.user.role === 'parent') {
          const currentChildren = data.user.children || [];
          const maxAllowed = data.user.maxChildren || currentChildren.length;
          data.user.availableChildSlots = Math.max(0, maxAllowed - currentChildren.length);
        }
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // New method for child login
  const loginChild = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/login/child`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        // Set child user data
        setUser({
          ...data.user,
          role: 'child' // Ensure the role is set to child
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Child login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const endpoint = userData.role === 'parent' 
        ? `${API_BASE}/api/register/parent`
        : `${API_BASE}/api/register/school`;
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      return {
        success: data.success || false,
        message: data.message || data.error
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const addChild = async (childData: { name: string, username: string, password?: string, year: string }) => {
    if (!user || user.role !== 'parent') {
      return { success: false, error: 'Only parents can add children' };
    }
    
    // Check if parent has reached their child limit
    const currentChildren = user.children || [];
    const maxAllowed = user.maxChildren || currentChildren.length;
    const availableSlots = Math.max(0, maxAllowed - currentChildren.length);
    
    if (availableSlots <= 0) {
      return { 
        success: false, 
        error: 'You have reached your maximum allowed number of children. To add more, please remove existing children first.' 
      };
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/children`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentEmail: user.email,
          name: childData.name,
          username: childData.username,
          password: childData.password, // Now passing the password to the API
          year: childData.year // Add the year to the API request
        })
      });
      
      const data = await response.json();
      
      if (data.success && data.child) {
        // Update local user state with new child and decrement available slots
        setUser({
          ...user,
          children: [...(user.children || []), childData.username],
          availableChildSlots: availableSlots - 1
        });
        return { success: true, child: data.child };
      } else {
        return { success: false, error: data.error || 'Failed to add child' };
      }
    } catch (error) {
      console.error('Add child error:', error);
      return { success: false, error: 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const removeChild = async (username: string) => {
    if (!user || user.role !== 'parent') {
      return { success: false, error: 'Only parents can remove children' };
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/children/${encodeURIComponent(username)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ parentEmail: user.email })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update local user state by removing the child and incrementing available slots
        setUser({
          ...user,
          children: (user.children || []).filter(child => child !== username),
          availableChildSlots: (user.availableChildSlots || 0) + 1
        });
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to remove child' };
      }
    } catch (error) {
      console.error('Remove child error:', error);
      return { success: false, error: 'Network error occurred when trying to remove child' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginChild, // Added the new child login method to the context
      register, 
      logout, 
      addChild, 
      removeChild, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}