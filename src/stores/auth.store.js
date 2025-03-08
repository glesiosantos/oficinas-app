// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

const OFICINA_TOKEN = 'oficina-api-token'

export const useAuthStore = defineStore('authStore', () => {

  const auth = ref(JSON.parse(localStorage.getItem(OFICINA_TOKEN)))
  const isAuth = ref(auth.value ? true : false)

  const setAuth = (data) => {
    auth.value = data
    window.localStorage.setItem(OFICINA_TOKEN, JSON.stringify(data))
  }

  const removeAuth = () => {
    isAuth.value = false;
    window.localStorage.removeItem(OFICINA_TOKEN)
    auth.value = null
  }

  return { auth, isAuth, setAuth, removeAuth }
})
