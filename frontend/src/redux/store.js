import { configureStore } from '@reduxjs/toolkit';

import userReducer from './slice/userSlice';
import listNameReducer from './slice/listNameSlice';
import fileUploadReducer from './slice/upload-slice';

export const store = configureStore({
  reducer: {
    fileUpload: fileUploadReducer,
    listName: listNameReducer,
    user: userReducer, 

  },
});

export default store;
