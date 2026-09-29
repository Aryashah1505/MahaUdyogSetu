import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BusinessProfile } from '../types';
import { DEFAULT_BUSINESS_PROFILE } from '../data/mockData';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  activeProfile: BusinessProfile;
  token: string | null;
  login: (profile: BusinessProfile, token?: string, redirectTo?: string) => void;
  logout: () => void;
  updateProfile: (profile: BusinessProfile) => Promise<void>;
}

const AUTH_STORAGE_KEY = 'mahau_is_authenticated';
const TOKEN_STORAGE_KEY = 'mahau_session_token';
const PROFILE_STORAGE_KEY = 'mahau_active_company';
const REDIRECT_STORAGE_KEY = 'mahau_redirect_after_login';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<BusinessProfile>(DEFAULT_BUSINESS_PROFILE);

  // Initial session hydration on app startup
  useEffect(() => {
    async function hydrateAuth() {
      try {
        const storedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
        const storedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
        const storedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

        if (storedProfile) {
          try {
            setActiveProfile(JSON.parse(storedProfile));
          } catch (e) {}
        }

        if (storedAuth === 'true' && storedToken) {
          setIsAuthenticated(true);
          setToken(storedToken);

          // Fetch latest live profile from Supabase-backed API
          try {
            const res = await fetch('/api/company/profile', {
              headers: {
                Authorization: `Bearer ${storedToken}`
              }
            });
            if (res.ok) {
              const data = await res.json();
              if (data.profile) {
                setActiveProfile(data.profile);
                localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data.profile));
              }
            }
          } catch (apiErr) {
            console.warn('Notice: Background profile sync using local cache.');
          }
        } else if (storedAuth === 'true') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error hydrating auth session:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateAuth();
  }, []);

  const login = (profile: BusinessProfile, sessionToken?: string, _redirectTo?: string) => {
    setActiveProfile(profile);
    setIsAuthenticated(true);
    if (sessionToken) {
      setToken(sessionToken);
    }
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      if (sessionToken) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, sessionToken);
      }
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('Error saving login session:', err);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    try {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      sessionStorage.removeItem(TOKEN_STORAGE_KEY);
      sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing auth session:', err);
    }
  };

  const updateProfile = async (newProfile: BusinessProfile) => {
    setActiveProfile(newProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      const currentToken = token || sessionStorage.getItem(TOKEN_STORAGE_KEY);
      if (currentToken) {
        await fetch('/api/company/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`
          },
          body: JSON.stringify(newProfile)
        });
      }
    } catch (err) {
      console.error('Error updating company profile in Supabase:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        activeProfile,
        token,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
