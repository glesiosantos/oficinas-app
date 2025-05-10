import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

export const authService = () => {
  const authStore = useAuthStore()

  const getBearerToken = () => {
    if (!authStore.isAuth || !authStore.auth?.token) {
      throw new Error('Usuário não autenticado ou token não disponível')
    }
    return `Bearer ${authStore.auth.token}`
  }

  const logar = async (data) => {
    try {
      const response = await api.post('/v1/auth/autenticar', data)
      authStore.setAuth(response.data)
      return response.data
    } catch (error) {
      console.error('Erro ao realizar login:', error)
      throw error
    }
  }

  const refreshToken = async () => {

    let response

    if (authStore.isAuth) {
      const bearerToken = `Bearer ${getBearerToken()}`
      response = await api.post('/v1/auth/refresh', {token: authStore.auth.token }, {headers: {
        Authorization: bearerToken
      }})
    }
    return response;
  }

  const logout = () => {
    authStore.removeAuth()
  }

  return { logar, refreshToken, logout }
}
