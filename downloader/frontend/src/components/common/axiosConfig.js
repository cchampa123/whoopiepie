import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function(config) {
    const token = "Token "+localStorage.getItem('tokens');
    config.headers.Authorization = token;
    return config;
  }
)

export default axiosInstance;
