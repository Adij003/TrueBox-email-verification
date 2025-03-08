import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slice/userSlice';
import creditReducer from './slice/creditSlice';
import listNameReducer from './slice/listNameSlice';
import fileUploadReducer from './slice/upload-slice';


export const store = configureStore({
  reducer: {
    fileUpload: fileUploadReducer,
    listName: listNameReducer,
    user: userReducer, 
    credits: creditReducer,

  },
});

export default store;
