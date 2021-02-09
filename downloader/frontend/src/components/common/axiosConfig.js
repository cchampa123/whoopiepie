import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(function(config) {
    const token = "Token "+localStorage.getItem('tokens');
    config.headers.Authorization = token;
    return config;
  }
)

axiosInstance.interceptors.response.use((response) => {
  return response
}, function(error) {
  const originalRequest = error.config;
  if (error.response.status===401) {
    localStorage.setItem('tokens', null)
  }
})

export default axiosInstance;
