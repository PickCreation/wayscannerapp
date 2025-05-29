
import { useState, useEffect, createContext, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  profileImage?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfileImage: (imageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'Pickcreations@gmail.com';
const ADMIN_PASSWORD = 'Admin123!';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const firebaseAuth = useFirebaseAuth();

  useEffect(() => {
    if (firebaseAuth.isAuthenticated && firebaseAuth.user) {
      setIsAuthenticated(true);
      setUser(firebaseAuth.user);
      return;
    }

    const checkAuth = () => {
      const storedAuth = localStorage.getItem('isLoggedIn');
      const storedUser = localStorage.getItem('user');
      
      if (storedAuth === 'true' && storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
        return;
      }
      
      // Auto-login admin if no other authentication is present
      const adminUser = {
        id: 'admin-123',
        name: 'Admin',
        email: ADMIN_EMAIL,
        isAdmin: true,
        profileImage: '',
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      setIsAuthenticated(true);
      setUser(adminUser);
      
      localStorage.removeItem('profileData');
    };
    
    checkAuth();
  }, [firebaseAuth.isAuthenticated, firebaseAuth.user]);

  const updateProfileImage = (imageUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profileImage: imageUrl };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const login = async (email: string, password: string) => {
    console.log("Combined auth login attempt with:", email);
    
    try {
      await firebaseAuth.login(email, password);
      console.log("Firebase login successful");
      return;
    } catch (error) {
      console.log("Firebase login failed, falling back to local login:", error);
    }

    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      console.log("Admin fallback login successful");
      const adminUser = {
        id: 'admin-123',
        name: 'Admin',
        email: ADMIN_EMAIL,
        isAdmin: true,
        profileImage: '',
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(adminUser));
      
      setIsAuthenticated(true);
      setUser(adminUser);
      
      localStorage.removeItem('profileData');
      
      toast({
        title: "Admin Login Successful",
        description: "Welcome back, Admin!",
      });
      
      return;
    }
    
    const regularUser = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0],
      email,
      profileImage: '',
    };
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(regularUser));
    
    setIsAuthenticated(true);
    setUser(regularUser);
    
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      await firebaseAuth.signup(name, email, password);
      return;
    } catch (error) {
      console.log("Falling back to local signup", error);
    }

    console.log("Signing up with:", name, email, password);
    
    const userId = 'user-' + Date.now();
    const newUser = {
      id: userId,
      name,
      email,
      profileImage: '',
    };
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('user', JSON.stringify(newUser));
    
    setIsAuthenticated(true);
    setUser(newUser);
    
    toast({
      title: "Account Created",
      description: "Your account has been created successfully!",
    });
  };

  const logout = () => {
    try {
      firebaseAuth.logout();
    } catch (error) {
      console.log("Error with Firebase logout, proceeding with local logout", error);
    }

    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('profileData');
    
    setIsAuthenticated(false);
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      signup, 
      logout,
      updateProfileImage 
    }}>
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
