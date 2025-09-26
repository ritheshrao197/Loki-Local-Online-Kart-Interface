'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Lock, 
  User, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  LogIn,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string | string[];
  fallback?: React.ReactNode;
  redirectTo?: string;
  className?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  isAuthenticated: boolean;
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  fallback,
  redirectTo = '/login',
  className = ''
}: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Simulate auth check - replace with actual auth logic
      const token = localStorage.getItem('auth_token');
      
      if (!token && requireAuth) {
        setIsLoading(false);
        return;
      }

      if (token) {
        // Simulate user data fetch - replace with actual API call
        const userData: User = {
          id: '1',
          email: 'user@example.com',
          role: 'user',
          isAuthenticated: true
        };
        
        setUser(userData);
        
        // Check role requirements
        if (requireRole) {
          const roles = Array.isArray(requireRole) ? requireRole : [requireRole];
          const hasRequiredRole = roles.includes(userData.role);
          
          if (!hasRequiredRole) {
            setIsAuthorized(false);
            setIsLoading(false);
            return;
          }
        }
        
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    router.push(redirectTo);
  };

  const handleSignUp = () => {
    router.push('/seller-signup');
  };

  if (isLoading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", className)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthorized) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={cn("min-h-screen flex items-center justify-center p-4", className)}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="max-w-md w-full"
        >
          <Card>
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Shield className="w-8 h-8 text-red-500" />
              </motion.div>
              <CardTitle className="text-xl">
                {requireRole ? 'Access Denied' : 'Authentication Required'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-muted-foreground text-center"
              >
                {requireRole 
                  ? `You need ${Array.isArray(requireRole) ? requireRole.join(' or ') : requireRole} role to access this resource.`
                  : 'Please log in to access this page.'
                }
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <Button onClick={handleLogin} className="flex-1">
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </Button>
                <Button variant="outline" onClick={handleSignUp} className="flex-1">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}

// Role-based access control
interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
  className?: string;
}

export function RoleGuard({
  children,
  allowedRoles,
  fallback,
  className = ''
}: RoleGuardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate user role check
    const userData: User = {
      id: '1',
      email: 'user@example.com',
      role: 'user',
      isAuthenticated: true
    };
    
    setUser(userData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback || (
      <div className={cn("p-4 text-center", className)}>
        <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
        <p className="text-sm text-muted-foreground">
          You don't have permission to view this content.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

// Permission-based access control
interface PermissionGuardProps {
  children: React.ReactNode;
  permission: string;
  fallback?: React.ReactNode;
  className?: string;
}

export function PermissionGuard({
  children,
  permission,
  fallback,
  className = ''
}: PermissionGuardProps) {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate permission check
    const userPermissions = ['read:products', 'write:products', 'delete:products'];
    setHasPermission(userPermissions.includes(permission));
    setIsLoading(false);
  }, [permission]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  if (!hasPermission) {
    return fallback || (
      <div className={cn("p-4 text-center", className)}>
        <Lock className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="text-sm text-muted-foreground">
          You don't have permission to perform this action.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

// Auth status indicator
interface AuthStatusProps {
  className?: string;
  showUserInfo?: boolean;
}

export function AuthStatus({ className = '', showUserInfo = true }: AuthStatusProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth status check
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      const userData: User = {
        id: '1',
        email: 'user@example.com',
        role: 'user',
        isAuthenticated: true
      };
      setUser(userData);
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Not logged in</span>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <CheckCircle className="w-4 h-4 text-green-500" />
      {showUserInfo && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{user.email}</span>
          <Badge variant="outline" className="text-xs">
            {user.role}
          </Badge>
        </div>
      )}
    </div>
  );
}

// Auth context provider
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    try {
      // Simulate login API call
      const userData: User = {
        id: '1',
        email,
        role: 'user',
        isAuthenticated: true
      };
      
      localStorage.setItem('auth_token', 'fake-token');
      setUser(userData);
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const hasRole = (role: string) => {
    return user?.role === role;
  };

  const hasPermission = (permission: string) => {
    // Simulate permission check
    const userPermissions = ['read:products', 'write:products', 'delete:products'];
    return userPermissions.includes(permission);
  };

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      const userData: User = {
        id: '1',
        email: 'user@example.com',
        role: 'user',
        isAuthenticated: true
      };
      setUser(userData);
    }
    
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        hasRole,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Auth hook
export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
