import axios from 'axios';
import Router from 'next/router';
import {AuthService} from './zynerator/security/Auth.service';

const axiosInstance = axios.create({
  // Configurations par défaut pour votre axios
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    if (token) {
      config.headers.Authorization = token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // if ([418].includes(error.response?.status) && window.location.pathname !== '/licence-due-page') {
    //   Router.replace('/licence-due-page');
    // }
    
    if ([401, 403, 419, 409].includes(error.response?.status)) {
      const authService = new AuthService();
      authService.signOut();
    }
    
    return Promise.reject(error);
  }
);


export default axiosInstance;
