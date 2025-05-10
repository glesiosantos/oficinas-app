import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMarcaStore = defineStore('marcaStore', () => {

  const marcas = ref([])
  const modelos = ref([])

  const setMarcas = (data) => marcas.value = data

  const setModelos = (data) => modelos.value = data

  return { marcas, modelos, setMarcas, setModelos }
})
