import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  avatar?: string | null;
  role: string;
  activationCode: string;
  token: string;
  username: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const getInitialState = (): AuthState => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return {
        user,
        token: user.token,
        isAuthenticated: true,
        loading: false,
      };
    } catch {
      localStorage.removeItem('user');
    }
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.loading = false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    loginFailure: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;