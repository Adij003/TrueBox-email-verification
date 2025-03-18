import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slice/userSlice';
import creditReducer from './slice/creditSlice';
import emailVerificationReducer from './slice/emailSlice'

export const store = configureStore({
  reducer: {
    user: userReducer, 
    credits: creditReducer,
    emailVerification: emailVerificationReducer 

  },
});

export default store;
