'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { getDemoUserById, getTrialDaysRemaining, isTrialExpired, demoUsers } from '../data/demoData';

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
    const token = localStorage.getItem('teachgage_token');
    const refreshToken = localStorage.getItem('teachgage_refresh_token');
    const userId = localStorage.getItem('teachgage_user_id');

    if (token && userId) {
      // Get user from demo data
      const user = getDemoUserById(userId);
      if (user) {
        const trialStatus = getTrialStatus(user);
        const mustChangePassword = user.mustChangePassword || user.status === 'pending_password_change';

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
      } else {
        // Invalid user, clear storage
        localStorage.removeItem('teachgage_token');
        localStorage.removeItem('teachgage_refresh_token');
        localStorage.removeItem('teachgage_user_id');
        dispatch({ type: AUTH_ACTIONS.INIT_COMPLETE });
      }
    } else {
      // No stored auth, initialization complete
      dispatch({ type: AUTH_ACTIONS.INIT_COMPLETE });
    }
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
        const daysRemaining = getTrialDaysRemaining(user.trialEndDate);
        const expired = isTrialExpired(user.trialEndDate);

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

    try {
      const response = await fetch('/api/auth/login', {
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

      const { user, token, refreshToken, trialStatus, mustChangePassword } = data.data;

      // Store in localStorage
      localStorage.setItem('teachgage_token', token);
      localStorage.setItem('teachgage_refresh_token', refreshToken);
      localStorage.setItem('teachgage_user_id', user.id);

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

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

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
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Demo password validation
      if (currentPassword !== 'TempPass123!' && currentPassword !== 'password123') {
        throw new Error('Current password is incorrect');
      }

      if (newPassword.length < 8) {
        throw new Error('New password must be at least 8 characters long');
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

    // Demo permission logic based on account tier and role
    const { accountTier, role } = state.user;

    switch (permission) {
      case 'create_courses':
        return accountTier !== 'basic' || role === 'organization_admin';
      case 'manage_organization':
        return role === 'organization_admin';
      case 'create_surveys':
        return true; // All users can create surveys
      case 'view_analytics':
        return true; // All users can view their analytics
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

