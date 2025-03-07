// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

const OFICINA_TOKEN = 'api-token'

export const useAuthStore = defineStore('authStore', () => {

  const auth = ref(JSON.parse(localStorage.getItem(OFICINA_TOKEN)))
  const isAuth = ref(auth.value ? true : false)

  console.log("**** "+ isAuth.value)

  const setAuth = (data) => {
    console.log(data)
    auth.value = data
    window.localStorage.setItem(OFICINA_TOKEN, JSON.stringify(data))
  }

  const removeAuth = () => {
    isAuth.value = false;
    window.localStorage.removeItem(OFICINA_TOKEN)
  }

  return { auth, isAuth, setAuth, removeAuth }

})
