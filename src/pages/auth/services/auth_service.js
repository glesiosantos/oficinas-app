import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()

export const authService = () => {

  const logar = async (data) => {
    const response = await api.post('/v1/auth/autenticar', data)
    authStore.setAuth(response.data)
  }

  const requestToken = () => {}

  const logout = () => {
    authStore.removeAuth()
  }

  return { logar, requestToken, logout }
}
