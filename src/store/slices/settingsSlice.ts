import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  visibleFields: Record<string, boolean>;
  profileImage: string | null;
  loading: boolean;
  error: string | null;
}

const getInitialVisibleFields = () => {
  const stored = localStorage.getItem('visibleFields');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fall back to defaults if parsing fails
    }
  }
  
  // Default: all fields visible
  return {
    name: true,
    age: true,
    gender: true,
    boothAddress: true,
    houseNo: true,
    mobileNumber: true,
    relatedTo: true,
    partNo: true,
    city: true,
    voterIdNumber: true,
  };
};

const initialState: SettingsState = {
  visibleFields: getInitialVisibleFields(),
  profileImage: null,
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateVisibleField: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.visibleFields[action.payload.key] = action.payload.value;
      localStorage.setItem('visibleFields', JSON.stringify(state.visibleFields));
    },
    setVisibleFields: (state, action: PayloadAction<Record<string, boolean>>) => {
      state.visibleFields = action.payload;
      localStorage.setItem('visibleFields', JSON.stringify(action.payload));
    },
    setProfileImage: (state, action: PayloadAction<string | null>) => {
      state.profileImage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { updateVisibleField, setVisibleFields, setProfileImage, setLoading, setError } = settingsSlice.actions;
export default settingsSlice.reducer;