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



const creditSlice = createSlice({
  name: 'credit',
  initialState,
  reducers: {
    resetCreditsState: (state) => {
      state.isCreditsLoading = false;
      state.isCreditsSuccess = false;
      state.isCreditsError = false;
      state.creditsMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchCredits.pending, (state) => {
      state.isCreditsLoading = true;
      state.isCreditsError = false;
    })
    .addCase(fetchCredits.fulfilled, (state, action) => {
      state.isCreditsLoading = false;
      state.isCreditsSuccess = true;
      state.credits = action.payload;
    })
    .addCase(fetchCredits.rejected, (state, action) => {
      state.isCreditsLoading = false;
      state.isCreditsError = true;
      state.creditsMessage = action.payload;
    })
  }
});

export default creditSlice.reducer;