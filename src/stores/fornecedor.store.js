import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFornecedorStore = defineStore('fornecedorStore', () => {
  const fornecedores = ref([])

  const setFornecedores = (data) => {
    fornecedores.value = data
  }

  return { fornecedores, setFornecedores }
})
