import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios, { endpoints } from 'src/utils/axios';

const initialState = { 
  credits: null,
  isCreditsLoading: false,
  isCreditsSuccess: false,
  isCreditsError: false,
  creditsMessage: '',
};

export const fetchCredits = createAsyncThunk('credits/fetchCredits', async (_, thunkAPI) => {
  try {
    const response = await axios.get(endpoints.credits.getCredits); 
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || error.message);
  }
});

const handlePending = (state) => {
  state.isCreditsLoading = true;
  state.isCreditsError = false;
}

const handleFulfilled = (state, action) => {
  state.isCreditsLoading = false;
  state.isCreditsSuccess = true;
  state.credits = action.payload;
};

const handleRejected = (state, action) => {
  state.isCreditsLoading = false;
  state.isCreditsError = true;
  state.creditsMessage = action.payload;
};

const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(fetchCredits.pending, handlePending)
    .addCase(fetchCredits.fulfilled, handleFulfilled)
    .addCase(fetchCredits.rejected, handleRejected);
  }
});

export default creditSlice.reducer;