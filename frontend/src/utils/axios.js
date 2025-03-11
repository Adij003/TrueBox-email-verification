import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.site.serverUrl,
  withCredentials: true
 });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
 
  auth: {
    me: '/auth/verify-session',
    signIn: 'auth/signin',
    signUp: '/auth/signup',
    logout: '/auth/logout'
  },
  credits: {
    getCredits: '/credits'
  },
  emailList: {
    uploadBulkEmail: '/bulk',
    startBulkVerification: (jobId) => `/email-lists/verify/bulk/${jobId}`,
    checkBulkStatus: (jobId) => `/email-lists/status/${jobId}`,
    downloadBulkResults: (jobId) => `/email-lists/download/${jobId}`,
    verifySingleEmail: '/email-lists/verify/single',
    getEmailList: '/email-lists',

  }
  
};
