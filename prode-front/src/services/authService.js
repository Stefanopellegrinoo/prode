// import { API_URL } from '../config/constants';
// authClient.js
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// const api = axios.create({ baseURL: API_URL });

// // ===== REQUEST INTERCEPTOR =====
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ===== RESPONSE INTERCEPTOR WITH REFRESH LOGIC =====
// let isRefreshing = false;
// let refreshSubscribers = [];

// const onTokenRefreshed = (newToken) => {
//   refreshSubscribers.forEach((cb) => cb(newToken));
//   refreshSubscribers = [];
// };

// const subscribeTokenRefresh = (cb) => {
//   refreshSubscribers.push(cb);
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem('refreshToken');

//       if (!refreshToken) {
//         localStorage.clear();
//         window.location.href = '/login';
//         return Promise.reject(error);
//       }

//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           const { data } = await axios.post(`${API_URL}/auth/refresh`, { token: refreshToken });
//           localStorage.setItem('accessToken', data.accessToken);
//           onTokenRefreshed(data.accessToken);
//         } catch (refreshErr) {
//           localStorage.clear();
//           window.location.href = '/login';
//           return Promise.reject(refreshErr);
//         } finally {
//           isRefreshing = false;
//         }
//       }

//       return new Promise((resolve) => {
//         subscribeTokenRefresh((newToken) => {
//           originalRequest.headers.Authorization = `Bearer ${newToken}`;
//           resolve(api(originalRequest));
//         });
//       });
//     }

//     return Promise.reject(error);
//   }
// );

// // ===== API FUNCTIONS =====
// export const loginUser = async (email, password) => {
//   const { data } = await api.post('/auth/login', { email, password });
//   localStorage.setItem('accessToken', data.accessToken);
//   localStorage.setItem('refreshToken', data.refreshToken);
//   return data.user;
// };

// export const registerUser = async (userData) => {
  
//   const { data } = await api.post('/auth/register', userData);
//   console.log('User registered:', data);
//   localStorage.setItem('accessToken', data.accessToken);
//   localStorage.setItem('refreshToken', data.refreshToken);
//   return data.user;
// };
// export const logoutUser = async () => {
//   try {
//     await api.post('/auth/logout');
//   } catch {
//     console.error('Error logging out, but localStorage will be cleared anyway.');
//   }
//   localStorage.clear();
//   return true;
// };

// export const getCurrentUser = async () => {
//   try {
//     const token = localStorage.getItem('accessToken');
//     if (!token) return null;
//     const { data } = await api.get('/auth/me');
//     return data;
//   } catch (error) {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');

//     // Redirigí sólo si no estás en login
//     if (window.location.pathname !== '/login') {
//       window.location.href = '/login';
//     }
//   }
// };
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3030/api'
    : 'https://api.proderugbyargentina.fyi/api'
);


// Creamos instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 🔥 Esto permite enviar cookies automáticamente
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    // Do NOT attempt refresh token rotation on auth endpoints (login, register, refresh, me)
    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/me');

    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      isRefreshing = true;

      try {
        await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ===== API FUNCTIONS =====

export const loginUser = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data; // ✅ La cookie se guarda automáticamente, no guardás tokens manualmente
};

export const registerUser = async (userData) => {
  const { data } = await api.post('/auth/register', userData);
  return data.user;
};

export const logoutUser = async () => {
  await api.post('/auth/logout');
};

export const getCurrentUser = async () => {
  try {
    const { data } = await api.get('/auth/me', { withCredentials: true });
    return data;
  } catch (error) {
    if (error.response?.status === 401) {
      // Si el error es 401, simplemente no hay sesión
      console.log('No hay sesión activa.');
      return null;
    }
    // Otros errores (por ejemplo 500) sí los tiramos
    throw error;
  }
};



export const forgotPassword = async (email) => {
  await api.post('/auth/forgot-password', { email });
  return true;
};

export default api;