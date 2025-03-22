import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axiosInstance, { endpoints } from 'src/utils/axios'; 

const initialState = {
  emailVerification: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
  verificationType: null, // "single" or "bulk"
  emailLists: [], 
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  },
  statusCount: {
    pending: 0,
    completed: 0,
    verifying: 0,
    all: 0,
    ready: 0
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
    jobId: '',
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

// Thunk to upload bulk email lists
export const uploadBulkEmails = createAsyncThunk(
  "emails/uploadBulkEmails",
  async ({ file, emailListName }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("csv_file", file);
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

// Thunk to start bulk email verification
export const startBulkVerification = createAsyncThunk('emails/startBulkVerification', async (jobId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.patch(endpoints.emailList.startBulkVerification(jobId));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong in EmailVerificaiton Reducer');
  }
});

// Thunk to check the status of bulk email verification
export const checkBulkStatus = createAsyncThunk('emails/checkBulkStatus', async (jobId, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get(endpoints.emailList.checkBulkStatus(jobId));
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong in EmailVerificaiton Reducer');
  }
});

// Thunk to download bulk email verification results
export const downloadBulkResults = createAsyncThunk(
  'emails/downloadBulkResults',
  async (jobId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        endpoints.emailList.downloadBulkResults(jobId),
        {},
        { responseType: 'blob' } 
      );
    
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      
      link.download = 'bulk_results.csv'; 

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return response.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Something went wrong in EmailVerificaiton Reducer');
    }
  }
);

// Thunk to verify a single email
export const verifySingleEmail = createAsyncThunk('emails/verifySingleEmail', async (emailData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post(endpoints.emailList.verifySingleEmail, emailData);

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Something went wrong in EmailVerificaiton Reducer');
  }
});


// Thunk to fetch email lists
export const fetchEmailLists = createAsyncThunk(
  "emails/fetchEmailLists",
  async ({ type, status, page, limit, search }, { rejectWithValue }) => {
    try {    
      const response = await axiosInstance.get(endpoints.emailList.getEmailList, {
        params: { type, status, page, limit, search },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Fetch email lists error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch email lists"
      );
    }
  }
);

const handlePending = (state, action) => {
  switch (action.type) {
    case 'emails/uploadBulkEmails':
      state.isLoading = true
      break;
    case 'emails/startBulkVerification':
      state.isLoading = true;
      break;
    case 'emails/checkBulkStatus':
      state.isLoading = true;
      break;
    case 'emails/downloadBulkResults':
      state.isLoading = true;
      break;
    case 'emails/verifySingleEmail':
      state.isLoading = true;
      break;
    case 'emails/fetchEmailLists':
      state.isLoading = true;
      break;
    default:
      break; 
  }
}

const handleFulfilled = (state, action) => {
  state.isLoading = false;
  state.isSuccess = true;

  switch (action.type) {
    case uploadBulkEmails.fulfilled.type: // this resolves to emails/uploadBulkEmail/fulfilled
      state.bulk.jobId = action.payload.jobId;
      break;

    case startBulkVerification.fulfilled.type: // and this resolves to emails/startBulkVerification/fulfilled
      state.bulk.status = 'in_progress';
      break;

    case checkBulkStatus.fulfilled.type:
      state.bulk = { ...state.bulk, ...action.payload };
      break;

    case verifySingleEmail.fulfilled.type:
      state.verificationType = 'single';
      state.single = action.payload;
      break;

    case fetchEmailLists.fulfilled.type:
      state.emailLists = action.payload.emailLists || [];
      state.pagination = action.payload.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        itemsPerPage: 5,
      };
      state.statusCount = {
        pending: action.payload.statusCount?.pending || 0,
        completed: action.payload.statusCount?.completed || 0,
        verifying: action.payload.statusCount?.verifying || 0, 
        ready: action.payload.statusCount?.ready || 0, 
        all: action.payload.statusCount?.all || 0, 

        
      };
      break;

    default:
      break;
  }
};

const handleRejected = (state, action) => {
  switch (action.type) {
    case 'emails/uploadBulkEmails':
      state.isLoading = false
      state.isError = true;
      state.message = action.payload;
      break;
    case 'emails/startBulkVerification':
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      break;
    case 'emails/checkBulkStatus':
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      break;
    case 'emails/downloadBulkResults':
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      break;
    case 'emails/verifySingleEmail':
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
      break;
    case 'emails/fetchEmailLists':
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload || "Failed to fetch email lists";
      break;
    default:
      break; 
  }
}

// Redux slice for email verification
const emailVerificationSlice = createSlice({
  name: 'emailVerification',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(uploadBulkEmails.pending, handlePending)
    .addCase(uploadBulkEmails.fulfilled, handleFulfilled)
    .addCase(uploadBulkEmails.rejected, handleRejected)


    .addCase(startBulkVerification.pending, handlePending)
    .addCase(startBulkVerification.fulfilled, handleFulfilled)
    .addCase(startBulkVerification.rejected, handleRejected)

    .addCase(checkBulkStatus.pending, handlePending)
    .addCase(checkBulkStatus.fulfilled, handleFulfilled)
    .addCase(checkBulkStatus.rejected, handleRejected)

    .addCase(downloadBulkResults.pending, handlePending)
    .addCase(downloadBulkResults.fulfilled, handleFulfilled)
    .addCase(downloadBulkResults.rejected, handleRejected)

    .addCase(verifySingleEmail.pending, handlePending)
    .addCase(verifySingleEmail.fulfilled, handleFulfilled)
    .addCase(verifySingleEmail.rejected, handleRejected)

    .addCase(fetchEmailLists.pending, handlePending )
    .addCase(fetchEmailLists.fulfilled, handleFulfilled)
    .addCase(fetchEmailLists.rejected, handleRejected);
  }
});

export default emailVerificationSlice.reducer;