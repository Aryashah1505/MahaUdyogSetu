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

export const AUTH_STORAGE_KEY = 'mahau_is_authenticated';
export const TOKEN_STORAGE_KEY = 'mahau_session_token';
export const LEGACY_TOKEN_KEY = 'mahau_auth_token';
export const PROFILE_STORAGE_KEY = 'mahau_active_company';
export const REDIRECT_STORAGE_KEY = 'mahau_redirect_after_login';

/**
 * Safely parse and validate the HMAC-SHA256 session token format and expiration client-side
 */
export function parseAndValidateTokenLocally(tokenString: string | null | undefined): {
  valid: boolean;
  companyId?: string;
  email?: string;
  expired?: boolean;
} {
  if (!tokenString || typeof tokenString !== 'string' || !tokenString.includes('.')) {
    return { valid: false };
  }
  const parts = tokenString.trim().split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false };
  }
  try {
    const base64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
    const jsonStr = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const payload = JSON.parse(jsonStr);
    if (!payload || typeof payload !== 'object' || !payload.companyId || typeof payload.companyId !== 'string') {
      return { valid: false };
    }
    if (typeof payload.expiresAt === 'number' && Date.now() > payload.expiresAt) {
      return { valid: false, expired: true };
    }
    return { valid: true, companyId: payload.companyId, email: payload.email };
  } catch {
    return { valid: false };
  }
}

/**
 * Completely clean all stored authentication keys from both storage scopes
 */
export function clearAllStoredAuthData() {
  try {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(LEGACY_TOKEN_KEY);
    localStorage.removeItem(LEGACY_TOKEN_KEY);
    sessionStorage.removeItem(PROFILE_STORAGE_KEY);
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    localStorage.removeItem(REDIRECT_STORAGE_KEY);
    localStorage.removeItem('mahau_active_approvals');
    localStorage.removeItem('mahau_active_documents');
  } catch (err) {
    console.error('Error clearing auth storage keys:', err);
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [activeProfile, setActiveProfile] = useState<BusinessProfile>(DEFAULT_BUSINESS_PROFILE);

  // Initial session hydration on app startup
  useEffect(() => {
    let isMounted = true;

    async function hydrateAuth() {
      try {
        const storedToken =
          sessionStorage.getItem(TOKEN_STORAGE_KEY) ||
          localStorage.getItem(TOKEN_STORAGE_KEY) ||
          sessionStorage.getItem(LEGACY_TOKEN_KEY) ||
          localStorage.getItem(LEGACY_TOKEN_KEY);

        // Case 1: No token found -> definitively unauthenticated
        if (!storedToken || !storedToken.trim()) {
          clearAllStoredAuthData();
          if (isMounted) {
            setIsAuthenticated(false);
            setToken(null);
            setActiveProfile(DEFAULT_BUSINESS_PROFILE);
            setIsLoading(false);
          }
          return;
        }

        // Case 2: Validate token format and expiration locally
        const tokenStatus = parseAndValidateTokenLocally(storedToken);
        if (!tokenStatus.valid) {
          console.warn('Session hydration: Stored token is invalid or expired. Clearing session.');
          clearAllStoredAuthData();
          if (isMounted) {
            setIsAuthenticated(false);
            setToken(null);
            setActiveProfile(DEFAULT_BUSINESS_PROFILE);
            setIsLoading(false);
          }
          return;
        }

        // Token passed local checks; load cached profile if available
        const storedProfileStr =
          localStorage.getItem(PROFILE_STORAGE_KEY) ||
          sessionStorage.getItem(PROFILE_STORAGE_KEY);
        let resolvedProfile = DEFAULT_BUSINESS_PROFILE;
        if (storedProfileStr) {
          try {
            resolvedProfile = JSON.parse(storedProfileStr);
          } catch (e) {}
        }

        // Validate token against backend API
        try {
          const res = await fetch('/api/company/profile', {
            headers: {
              Authorization: `Bearer ${storedToken}`,
              'x-company-token': storedToken
            }
          });

          // If the server explicitly rejected the token (401 Unauthorized / 403 Forbidden)
          if (res.status === 401 || res.status === 403) {
            console.warn('Session hydration: Server rejected authorization token. Clearing session.');
            clearAllStoredAuthData();
            if (isMounted) {
              setIsAuthenticated(false);
              setToken(null);
              setActiveProfile(DEFAULT_BUSINESS_PROFILE);
              setIsLoading(false);
            }
            return;
          }

          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data.profile) {
              resolvedProfile = data.profile;
              try {
                localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data.profile));
                sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data.profile));
              } catch (e) {}
            }
          }
        } catch (apiErr) {
          // Network offline / latency fallback: preserve authentication if local token is valid
          console.warn('Session hydration: Background sync unreachable, proceeding with verified token.');
        }

        if (isMounted) {
          setActiveProfile(resolvedProfile);
          setToken(storedToken);
          setIsAuthenticated(true);
          try {
            sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
            localStorage.setItem(AUTH_STORAGE_KEY, 'true');
            sessionStorage.setItem(TOKEN_STORAGE_KEY, storedToken);
            localStorage.setItem(TOKEN_STORAGE_KEY, storedToken);
          } catch (e) {}
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Error hydrating auth session:', err);
        clearAllStoredAuthData();
        if (isMounted) {
          setIsAuthenticated(false);
          setToken(null);
          setActiveProfile(DEFAULT_BUSINESS_PROFILE);
          setIsLoading(false);
        }
      }
    }

    hydrateAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = (profile: BusinessProfile, sessionToken?: string, _redirectTo?: string) => {
    setActiveProfile(profile);
    setIsAuthenticated(true);
    if (sessionToken) {
      setToken(sessionToken);
    }
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      localStorage.setItem(AUTH_STORAGE_KEY, 'true');
      if (sessionToken) {
        sessionStorage.setItem(TOKEN_STORAGE_KEY, sessionToken);
        localStorage.setItem(TOKEN_STORAGE_KEY, sessionToken);
        sessionStorage.setItem(LEGACY_TOKEN_KEY, sessionToken);
        localStorage.setItem(LEGACY_TOKEN_KEY, sessionToken);
      }
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (err) {
      console.error('Error saving login session:', err);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setActiveProfile(DEFAULT_BUSINESS_PROFILE);
    clearAllStoredAuthData();
  };

  const updateProfile = async (newProfile: BusinessProfile) => {
    setActiveProfile(newProfile);
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      const currentToken =
        token ||
        sessionStorage.getItem(TOKEN_STORAGE_KEY) ||
        localStorage.getItem(TOKEN_STORAGE_KEY);
      if (currentToken) {
        await fetch('/api/company/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentToken}`,
            'x-company-token': currentToken
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
