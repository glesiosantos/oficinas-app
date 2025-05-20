import { defineStore } from 'pinia'
import { ref } from 'vue'

const OFICINA_TOKEN = 'oficina-api-token'

export const useAuthStore = defineStore('authStore', () => {
  const auth = ref(JSON.parse(localStorage.getItem(OFICINA_TOKEN)) || null)
  const isAuth = ref(!!auth.value)

  const setAuth = (data) => {
    console.log('setAuth chamado com:', data)
    if (!data?.token) {
      return
    }
    auth.value = data
    isAuth.value = true
    try {
      localStorage.setItem(OFICINA_TOKEN, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
    }
  }

  const removeAuth = () => {
    auth.value = null
    isAuth.value = false
    localStorage.removeItem(OFICINA_TOKEN)
  }

  return { auth, setAuth, isAuth, removeAuth }
})
