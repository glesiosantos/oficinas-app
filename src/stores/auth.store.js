import { defineStore } from 'pinia'
import { ref } from 'vue'

const OFICINA_TOKEN = 'oficina-api-token'

export const useAuthStore = defineStore('authStore', () => {

  const auth = ref(JSON.parse(localStorage.getItem(OFICINA_TOKEN)) || null)
  const isAuth = ref(!!auth.value)

  const setAuth = (data) => {
    if (!data || !data.token || !data.estabelecimento?.idEstabelecimento) {
      throw new Error('Dados de autenticação inválidos')
    }
    auth.value = data
    isAuth.value = true
    window.localStorage.setItem(OFICINA_TOKEN, JSON.stringify(data))
  }

  const removeAuth = () => {
    isAuth.value = false;
    window.localStorage.removeItem(OFICINA_TOKEN)
    auth.value = null
  }

  return { auth, isAuth, setAuth, removeAuth }
})
