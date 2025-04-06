
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  isAdmin?: boolean;
}

interface UserProfileUpdate {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUserProfile: (userData: UserProfileUpdate) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is already authenticated from localStorage
    const storedUser = localStorage.getItem("userProfile");
    const loginStatus = localStorage.getItem("isAuthenticated");
    
    if (storedUser && loginStatus === "true") {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // Default admin user for testing
    if (loginStatus === "true" && !storedUser) {
      const defaultUser = {
        name: "Admin",
        email: "Pickcreations@gmail.com",
        isAdmin: true
      };
      setUser(defaultUser);
      localStorage.setItem("userProfile", JSON.stringify(defaultUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    // Admin login
    if (email === "Pickcreations@gmail.com" && password === "Admin123!") {
      const adminUser = {
        name: "Admin",
        email: "Pickcreations@gmail.com",
        isAdmin: true
      };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userProfile", JSON.stringify(adminUser));
      return true;
    }
    
    // Regular user login
    if (email && password.length >= 4) {
      const userData = {
        name: email.split('@')[0],
        email: email,
        isAdmin: false
      };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userProfile", JSON.stringify(userData));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userProfile");
  };
  
  const updateUserProfile = (userData: UserProfileUpdate) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      ...userData
    };
    
    setUser(updatedUser);
    localStorage.setItem("userProfile", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
