import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServicoStore = defineStore('servicoStore', () => {

  const servicos = ref([])

  const setServicos = (data) => servicos.value = data

  return { servicos, setServicos }
})
