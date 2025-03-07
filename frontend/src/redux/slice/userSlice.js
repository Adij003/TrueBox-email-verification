import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios, { endpoints } from 'src/utils/axios';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk to check user session
export const fetchUserSession = createAsyncThunk(
  'auth/fetchUserSession',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(endpoints.auth.me);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserSession.fulfilled, (state, action) => {
        const userData = action.payload.data;
        state.user = {
          ...userData,
          displayName: `${userData.first_name} ${userData.last_name}`,
        };
        state.status = 'authenticated';
      })
      .addCase(fetchUserSession.rejected, (state, action) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
