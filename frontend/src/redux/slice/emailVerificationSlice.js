import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios'; 


const initialState = {
  emailVerification: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  verificationType: null, // "single" or "bulk"
  emailLists: [], // Store fetched email lists
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  },
  single: {
    email: '',
    result: '',
    message: '',
    user: '',
    domain: '',
    acceptAll: null,
    role: null,
    freeEmail: null,
    disposable: null,
    spamtrap: null,
    success: false,
  },
  bulk: {
    job_id: '',
    status: 'pending',
    previousCredits: 0,
    creditsConsumed: 0,
    createdAt: null,
    completedAt: null,
    total: 0,
    verified: 0,
    pending: 0,
    analysis: {
      common_isp: 0,
      role_based: 0,
      disposable: 0,
      spamtrap: 0,
      syntax_error: 0,
    },
    results: {
      deliverable: 0,
      undeliverable: 0,
      acceptAll: 0,
      unknown: 0,
    },
  },
};


export const uploadBulkEmails = createAsyncThunk(
  "emails/uploadBulkEmails",
  async ({ file, emailListName }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("emailListName", emailListName); 

      const response = await axiosInstance.post(
        endpoints.emailList.uploadBulkEmail,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong in EmailVerification Reducer"
      );
    }
  }
);


export const startBulkVerification = createAsyncThunk('emails/startBulkVerification', async (jobId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(endpoints.emailList.startBulkVerification(jobId));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong in EmailVerificaiton Reducer');
  }
});

export const checkBulkStatus = createAsyncThunk('emails/checkBulkStatus', async (jobId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(endpoints.emailList.checkBulkStatus(jobId));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong in EmailVerificaiton Reducer');
  }
});

export const downloadBulkResults = createAsyncThunk(
  'emails/downloadBulkResults',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        endpoints.emailList.downloadBulkResults(jobId),
        {},
        { responseType: 'blob' } 
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong in EmailVerificaiton Reducer');
    }
  }
);


export const verifySingleEmail = createAsyncThunk('emails/verifySingleEmail', async (emailData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(endpoints.emailList.verifySingleEmail, emailData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong in EmailVerificaiton Reducer');
  }
});

export const fetchEmailLists = createAsyncThunk(
  "emails/fetchEmailLists",
  async ({ type, page = 1, limit = 5 }, { rejectWithValue }) => {
    console.log('we are reacing fetch email list async thunk')
    try {
      const response = await axiosInstance.get(endpoints.emailList.getEmailList, {
        params: { type, page, limit },
      });
      console.log('we are in fetchEmailLit async thunk', response.data.data)
      return response.data.data; // Extracting the `data` field from the response
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch email lists"
      );
    }
  }
);




const emailVerificationSlice = createSlice({
  name: 'emailVerification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(uploadBulkEmails.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(uploadBulkEmails.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.bulk.job_id = action.payload.job_id;
    })
    .addCase(uploadBulkEmails.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })


    .addCase(startBulkVerification.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(startBulkVerification.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.bulk.status = 'in-progress';
    })
    .addCase(startBulkVerification.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })

    .addCase(checkBulkStatus.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(checkBulkStatus.fulfilled, (state, action) => {
      state.isLoading = false;
      state.bulk = { ...state.bulk, ...action.payload };
    })
    .addCase(checkBulkStatus.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })

    .addCase(downloadBulkResults.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(downloadBulkResults.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    })
    .addCase(downloadBulkResults.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })

    .addCase(verifySingleEmail.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(verifySingleEmail.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.verificationType = 'single';
      state.single = action.payload;
    })
    .addCase(verifySingleEmail.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    })

    .addCase(fetchEmailLists.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.message = "";
    })
    .addCase(fetchEmailLists.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.emailLists = action.payload.emailLists;
      state.pagination = action.payload.pagination; // Store pagination data
    })
    .addCase(fetchEmailLists.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload || "Failed to fetch email lists";
    });
  }
});

export default emailVerificationSlice.reducer;