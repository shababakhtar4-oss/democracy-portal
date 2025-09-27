import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Voter {
  id: string;
  username: string;
  name: string;
  mobileNumber: string;
  userId: string;
  age: number;
  gender: 'Male' | 'Female';
  voterIdNumber: string;
  boothAddress: string;
  boothNo: number;
  mobile: string;
  houseNo: string;
  city: string;
  relatedTo: string;
  isPrint: boolean;
}

interface VotersState {
  users: Voter[];
  filteredUsers: Voter[];
  searchTerm: string;
  loading: boolean;
  error: string | null;
  adminInfo: {
    activationCode: string;
    candidateAdminId: string;
    candidateAdminUsername: string;
    candidateAdminName: string;
    candidateAdminMobileNumber: string;
  } | null;
}

const initialState: VotersState = {
  users: [],
  filteredUsers: [],
  searchTerm: '',
  loading: false,
  error: null,
  adminInfo: null,
};

const votersSlice = createSlice({
  name: 'voters',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      // Filter users based on search term
      if (action.payload.trim() === '') {
        state.filteredUsers = state.users;
      } else {
        const searchLower = action.payload.toLowerCase();
        state.filteredUsers = state.users.filter(
          (user) =>
            user.name.toLowerCase().includes(searchLower) ||
            user.username.toLowerCase().includes(searchLower) ||
            user.mobileNumber.includes(searchLower)
        );
      }
    },
    setUsers: (state, action: PayloadAction<Voter[]>) => {
      state.users = action.payload;
      // Apply current search filter
      if (state.searchTerm.trim() === '') {
        state.filteredUsers = action.payload;
      } else {
        const searchLower = state.searchTerm.toLowerCase();
        state.filteredUsers = action.payload.filter(
          (user) =>
            user.name.toLowerCase().includes(searchLower) ||
            user.username.toLowerCase().includes(searchLower) ||
            user.mobileNumber.includes(searchLower)
        );
      }
    },
    setAdminInfo: (state, action: PayloadAction<VotersState['adminInfo']>) => {
      state.adminInfo = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSearchTerm, setUsers, setAdminInfo, setLoading, setError } = votersSlice.actions;
export default votersSlice.reducer;