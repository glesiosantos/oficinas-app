import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePlanoStore = defineStore('planoStore', () => {

  const planos = ref([])

  const setPlanos = (data) => planos.value = data

  return { planos,setPlanos }
})
