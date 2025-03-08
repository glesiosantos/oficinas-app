import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'


export const authService = () => {

  const authStore = useAuthStore()

  const logar = async (data) => {
    const response = await api.post('/v1/auth/autenticar', data)
    authStore.setAuth(response.data)
  }

  const refreshToken = async () => {

    let response

    if (authStore.isAuth) {
      const bearerToken = `Bearer ${authStore.auth.token}`
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
