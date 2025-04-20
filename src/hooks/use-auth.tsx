
import { useCallback, useEffect, createContext, useContext, useState } from 'react';
import { useFirebaseAuth } from '@/hooks/use-firebase-auth';

export interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
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
        const userData = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: firebaseUser.metadata?.creationTime 
            ? new Date(firebaseUser.metadata.creationTime) 
            : new Date()
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

  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
