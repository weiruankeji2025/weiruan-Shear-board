import axios, { AxiosInstance, AxiosError } from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => response.data,
      (error: AxiosError<any>) => {
        const message = error.response?.data?.error || error.message || 'Network error';

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          toast.error('Session expired. Please login again.');
        } else {
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  get<T = any>(url: string, params?: any) {
    return this.client.get<T, T>(url, { params });
  }

  post<T = any>(url: string, data?: any) {
    return this.client.post<T, T>(url, data);
  }

  put<T = any>(url: string, data?: any) {
    return this.client.put<T, T>(url, data);
  }

  delete<T = any>(url: string) {
    return this.client.delete<T, T>(url);
  }
}

export const apiClient = new ApiClient();
