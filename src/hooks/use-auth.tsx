
import { useCallback, useEffect, createContext, useContext, useState } from 'react';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';

export interface User {
  id: string;
  uid: string; // Added for compatibility
  email: string | null;
  name: string; // Added to match usage in components
  displayName: string | null;
  photoURL: string | null;
  profileImage: string | null; // Added for profile image usage
  createdAt: Date;
  isAdmin?: boolean; // Added for admin checks
  metadata?: { // Added for metadata usage
    creationTime?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean; // Added for compatibility
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  // Added compatibility methods for other components
  login: (email: string, password: string) => Promise<void>; 
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfileImage: (imageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateProfileImage: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { 
    user: firebaseUser, 
    loading: firebaseLoading,
    signIn: firebaseSignIn,
    signUp: firebaseSignUp,
    signOut: firebaseSignOut,
    resetPassword: firebaseResetPassword
  } = useFirebaseAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!firebaseLoading) {
      if (firebaseUser) {
        const userData: User = {
          id: firebaseUser.uid,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          profileImage: firebaseUser.photoURL,
          isAdmin: firebaseUser.email?.toLowerCase() === 'Pickcreations@gmail.com'.toLowerCase(),
          createdAt: firebaseUser.metadata?.creationTime 
            ? new Date(firebaseUser.metadata.creationTime) 
            : new Date(),
          metadata: firebaseUser.metadata
        };

        // Store user data in localStorage for our RevenueCat mock to use
        localStorage.setItem('userData', JSON.stringify(userData));
        
        setUser(userData);
      } else {
        setUser(null);
        localStorage.removeItem('userData');
      }
      setIsLoading(false);
    }
  }, [firebaseUser, firebaseLoading]);

  const signIn = useCallback(async (email: string, password: string) => {
    await firebaseSignIn(email, password);
  }, [firebaseSignIn]);

  const signUp = useCallback(async (email: string, password: string) => {
    await firebaseSignUp(email, password);
  }, [firebaseSignUp]);

  const signOut = useCallback(async () => {
    await firebaseSignOut();
  }, [firebaseSignOut]);

  const resetPassword = useCallback(async (email: string) => {
    await firebaseResetPassword(email);
  }, [firebaseResetPassword]);

  // Added compatibility methods for other components
  const login = useCallback(async (email: string, password: string) => {
    await firebaseSignIn(email, password);
  }, [firebaseSignIn]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    // Here you would typically update the displayName after signup
    await firebaseSignUp(email, password);
    // Note: Additional logic may be needed to set the user name after signup
    // but this depends on your Firebase service implementation
  }, [firebaseSignUp]);

  const logout = useCallback(async () => {
    await firebaseSignOut();
  }, [firebaseSignOut]);

  const updateProfileImage = useCallback((imageUrl: string) => {
    if (user) {
      const updatedUser = { ...user, profileImage: imageUrl };
      setUser(updatedUser);
      
      // Update the localStorage data as well
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  }, [user]);

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loading: isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        login,
        signup,
        logout,
        updateProfileImage
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
