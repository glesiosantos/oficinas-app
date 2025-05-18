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
      const response = await api.post('/v1/auth/autenticar', data)
      authStore.setAuth(response.data)
  }

  const checkToken = async () => {
    if (!authStore.auth?.token) {
      authStore.removeAuth()
      return false
    }
    try {
      const bearerToken = getBearerToken()
      const { data } = await api.get('/v1/auth/validar-token', {
        headers: { Authorization: bearerToken }
      })

      return data.valid || true
    } catch (error) {
      console.error('Erro ao validar token:', error.response?.data || error.message)
      authStore.removeAuth()
      return false
    }
  }

  const logout = () => {
    authStore.removeAuth()
  }

  return { logar, logout, checkToken, getBearerToken }
}
