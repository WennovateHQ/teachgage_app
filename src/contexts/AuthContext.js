'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';

// Auth action types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  UPDATE_TRIAL_STATUS: 'UPDATE_TRIAL_STATUS',
  FORCE_PASSWORD_CHANGE: 'FORCE_PASSWORD_CHANGE',
  PASSWORD_CHANGED: 'PASSWORD_CHANGED',
  CLEAR_ERROR: 'CLEAR_ERROR',
  INIT_COMPLETE: 'INIT_COMPLETE'
};

// Initial auth state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true
  error: null,
  trialStatus: null,
  mustChangePassword: false
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        trialStatus: action.payload.trialStatus,
        mustChangePassword: action.payload.mustChangePassword || false
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
        trialStatus: null,
        mustChangePassword: false
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState
      };

    case AUTH_ACTIONS.UPDATE_TRIAL_STATUS:
      return {
        ...state,
        trialStatus: action.payload.trialStatus
      };

    case AUTH_ACTIONS.FORCE_PASSWORD_CHANGE:
      return {
        ...state,
        mustChangePassword: true
      };

    case AUTH_ACTIONS.PASSWORD_CHANGED:
      return {
        ...state,
        mustChangePassword: false,
        user: {
          ...state.user,
          status: 'active'
        }
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.INIT_COMPLETE:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
}

// Create auth context
const AuthContext = createContext();

// Auth provider component
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const loadAuthState = async () => {
      console.log('🔄 Loading auth state from localStorage...');
      const token = localStorage.getItem('teachgage_token');
      const refreshToken = localStorage.getItem('teachgage_refresh_token');
      const userId = localStorage.getItem('teachgage_user_id');

      console.log('Token found:', token ? 'YES' : 'NO');
      console.log('User ID found:', userId || 'NO');

      if (token && userId) {
        try {
          console.log('📡 Fetching session from backend...');
          // Verify token with backend and get current user
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const response = await fetch(`${apiUrl}/api/auth/session`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const user = data.user || data.data?.user;
            
            console.log('✅ Session response OK. User:', user?.email);
            
            if (user) {
              const trialStatus = getTrialStatus(user);
              const mustChangePassword = user.mustChangePassword || user.must_change_password || user.status === 'pending_password_change';

              console.log('✅ Restoring session for user:', user.email);
              dispatch({
                type: AUTH_ACTIONS.LOGIN_SUCCESS,
                payload: {
                  user,
                  token,
                  refreshToken,
                  trialStatus,
                  mustChangePassword
                }
              });
              console.log('✅ Session restored successfully');
              return;
            }
          } else {
            console.log('❌ Session response not OK:', response.status);
          }
          
          // Token invalid/expired - this is expected, silently clear storage
          localStorage.removeItem('teachgage_token');
          localStorage.removeItem('teachgage_refresh_token');
          localStorage.removeItem('teachgage_user_id');
          dispatch({ type: AUTH_ACTIONS.INIT_COMPLETE });
        } catch (error) {
          console.error('Failed to restore auth session:', error);
          // Clear invalid session
          localStorage.removeItem('teachgage_token');
          localStorage.removeItem('teachgage_refresh_token');
          localStorage.removeItem('teachgage_user_id');
          dispatch({ type: AUTH_ACTIONS.INIT_COMPLETE });
        }
      } else {
        // No stored auth, initialization complete
        dispatch({ type: AUTH_ACTIONS.INIT_COMPLETE });
      }
    };

    loadAuthState();
  }, []);

  // Helper function to get trial status
  const getTrialStatus = (user) => {
    if (!user || user.accountTier === 'basic') {
      return null;
    }

    if (user.accountTier === 'professional' || user.accountTier === 'organizational') {
      if (user.hasSubscription) {
        return {
          isTrialActive: false,
          hasSubscription: true,
          subscriptionStatus: user.subscriptionStatus || 'active'
        };
      }

      if (user.trialEndDate) {
        const trialEnd = new Date(user.trialEndDate);
        const now = new Date();
        const diffMs = trialEnd - now;
        const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        const expired = daysRemaining === 0;

        return {
          isTrialActive: !expired,
          trialStartDate: user.trialStartDate,
          trialEndDate: user.trialEndDate,
          daysRemaining,
          expired,
          requiresSubscription: expired
        };
      }
    }

    return null;
  };
  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const loginUrl = `${apiUrl}/api/auth/login`;

    try {
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Backend returns user and token at root level, not nested in data.data
      const { user, token, refreshToken, trialStatus, mustChangePassword } = data;

      // Store in localStorage
      console.log('📦 Storing auth data in localStorage...');
      console.log('Token:', token ? 'YES' : 'NO');
      console.log('User ID:', user?.user_id || user?.id);
      
      localStorage.setItem('teachgage_token', token || '');
      if (refreshToken) {
        localStorage.setItem('teachgage_refresh_token', refreshToken);
      }
      if (user?.user_id || user?.id) {
        localStorage.setItem('teachgage_user_id', user.user_id || user.id);
      }

      console.log('✅ Auth data stored. Dispatching LOGIN_SUCCESS...');

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: {
          user,
          token,
          refreshToken,
          trialStatus,
          mustChangePassword
        }
      });
      
      console.log('✅ Login complete. isAuthenticated should be true now.');

      return { success: true, user, trialStatus, mustChangePassword };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message }
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const registerUrl = `${apiUrl}/api/auth/register`;
    
    console.log('\n========== REGISTRATION ATTEMPT ==========');
    console.log('Timestamp:', new Date().toISOString());
    console.log('User Data:', JSON.stringify(userData, null, 2));
    console.log('API URL:', apiUrl);
    console.log('Full Register URL:', registerUrl);
    console.log('==========================================\n');

    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      console.log('\n========== REGISTRATION RESPONSE ==========');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', JSON.stringify([...response.headers.entries()], null, 2));
      console.log('===========================================\n');

      const data = await response.json();
      
      console.log('\n========== RESPONSE DATA ==========');
      console.log('Data:', JSON.stringify(data, null, 2));
      console.log('===================================\n');

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      if (!data.success) {
        throw new Error(data.message || 'Registration failed');
      }

      const { user, token, refreshToken, trialStatus } = data.data;

      // Store in localStorage
      localStorage.setItem('teachgage_token', token);
      localStorage.setItem('teachgage_refresh_token', refreshToken);
      localStorage.setItem('teachgage_user_id', user.id);

      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: {
          user,
          token,
          refreshToken,
          trialStatus,
          mustChangePassword: false
        }
      });

      return { success: true, user, trialStatus };
    } catch (error) {
      console.error('\n========== REGISTRATION ERROR ==========');
      console.error('Error Name:', error.name);
      console.error('Error Message:', error.message);
      console.error('Stack Trace:', error.stack);
      console.error('========================================\n');
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: { error: error.message }
      });
      return { success: false, error: error.message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('teachgage_token');
    localStorage.removeItem('teachgage_refresh_token');
    localStorage.removeItem('teachgage_user_id');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Change password function
  const changePassword = async (currentPassword, newPassword) => {
    try {
      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/password-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${state.token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password change failed');
      }

      dispatch({ type: AUTH_ACTIONS.PASSWORD_CHANGED });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Update trial status
  const updateTrialStatus = () => {
    if (state.user) {
      const trialStatus = getTrialStatus(state.user);
      dispatch({
        type: AUTH_ACTIONS.UPDATE_TRIAL_STATUS,
        payload: { trialStatus }
      });
    }
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has permission
  const hasPermission = (permission) => {
    if (!state.user) return false;

    const { accountTier, role } = state.user;

    switch (permission) {
      case 'create_courses':
        return accountTier !== 'basic' || role === 'organization_admin';
      case 'manage_organization':
        return role === 'organization_admin';
      case 'create_surveys':
        return true;
      case 'view_analytics':
        return true;
      case 'manage_billing':
        return role === 'organization_admin' || accountTier === 'professional';
      default:
        return false;
    }
  };

  // Check if trial is expired and requires subscription
  const requiresSubscription = () => {
    return state.trialStatus?.expired && state.trialStatus?.requiresSubscription;
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    changePassword,
    updateTrialStatus,
    clearError,
    hasPermission,
    requiresSubscription
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

