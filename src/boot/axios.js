import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth.store';

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: process.env.URL_API })

function setupInterceptors(store) {
  // Interceptor de requisição: adiciona o token de acesso ao cabeçalho
  api.interceptors.request.use(
    (config) => {
      const accessToken = store.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor de resposta: lida com refresh token em caso de 401
  api.interceptors.response.use(
    (response) => response, // Retorna a resposta diretamente se for bem-sucedida
    async (error) => {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !originalRequest._retry && // Evita loop infinito
        store.refreshToken // Só tenta refresh se houver refreshToken
      ) {
        originalRequest._retry = true;
        try {
          await store.refreshAccessToken(); // Renova o token
          originalRequest.headers.Authorization = `Bearer ${store.accessToken}`;
          return api(originalRequest); // Repete a requisição original com o novo token
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          store.logout(); // Faz logout se o refresh falhar
          window.location.href = '/login'; // Redireciona para login
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
}

export default defineBoot(({ app }) => {

  const authStore = useAuthStore()

  // Configura os interceptors com o store
  setupInterceptors(authStore)

  // Inicializa a autenticação (verifica refresh token armazenado)
  authStore.initializeAuth()

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
