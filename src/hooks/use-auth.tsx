
import { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isLoggedIn');
      const storedUser = localStorage.getItem('user');
      
      if (storedAuth === 'true' && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      }
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    // This is where you would normally call your auth API
    // For demo purposes, we're just storing in localStorage
    
    console.log("Logging in with:", email, password);
    
    // Simulate login success
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify({
      name: 'John Doe',
      email,
    }));
    
    setIsAuthenticated(true);
    setUser({
      name: 'John Doe',
      email,
    });
    
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    // This is where you would normally call your auth API
    // For demo purposes, we're just storing in localStorage
    
    console.log("Signing up with:", name, email, password);
    
    // Simulate signup success
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify({
      name,
      email,
    }));
    
    setIsAuthenticated(true);
    setUser({
      name,
      email,
    });
    
    toast({
      title: "Account Created",
      description: "Your account has been created successfully!",
    });
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
