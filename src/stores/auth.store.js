// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../boot/axios'

export const useAuthStore = defineStore('authStore', () => {
  const accessToken = ref(null);
  const refreshToken = ref(null);
  const user = ref(null);

  // Função de login
  async function login(credentials) {
    try {
      const response = await api.post('/v1/auth/autenticar', credentials)
      console.log(response.data)
      accessToken.value = response.data.accessToken;
      refreshToken.value = response.data.refreshToken;
      user.value = response.data.usuario;
      localStorage.setItem('refreshToken', refreshToken.value); // Armazena o refresh token
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  // Função de refresh token
  async function refreshAccessToken() {
    try {
      const response = await api.post('/v1/auth/refresh', {
        refreshToken: refreshToken.value,
      });
      accessToken.value = response.data.accessToken;
      refreshToken.value = response.data.refreshToken;
      localStorage.setItem('refreshToken', refreshToken.value);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      throw error;
    }
  }

  // Função de logout
  function logout() {
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;
    localStorage.removeItem('refreshToken');
  }

  // Verificar se já existe um refresh token ao iniciar
  function initializeAuth() {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (storedRefreshToken) {
      refreshToken.value = storedRefreshToken;
      refreshAccessToken();
    }
  }

  return {
    accessToken,
    refreshToken,
    user,
    login,
    logout,
    refreshAccessToken,
    initializeAuth,
    api, // Exporta a instância do axios para uso em outros lugares, se necessário
  };
});
