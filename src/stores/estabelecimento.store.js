import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEstabelecimentoStore = defineStore('estabelecimentoStore', () => {

  const estabelecimento = ref('')

  const setEstabelecimento = (data) => estabelecimento.value = data

  return { estabelecimento, setEstabelecimento }
})
