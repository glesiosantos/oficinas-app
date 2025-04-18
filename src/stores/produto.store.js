import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProdutoStore = defineStore('produtoStore', () => {

  const produtos = ref([])

  const setProdutos = (data) => {
    console.log('*** **** ', data)
    produtos.value = data
  }

  return { produtos,setProdutos }
})
