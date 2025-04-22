import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProdutoStore = defineStore('produtoStore', () => {

  const produtos = ref([])

  const categoriaProdutos = ref([])

  const setProdutos = (data) => produtos.value = data

  const setCategoria = (data) => categoriaProdutos.value = data

  return { produtos, categoriaProdutos, setProdutos, setCategoria }
})
