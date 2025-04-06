import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServicoStore = defineStore('servicoStore', () => {

  const categoriasEspecialidades = ref([])
  const especialidades = ref([])
  const servicos = ref([])

  const setCategorias = (data) => categoriasEspecialidades.value = data

  const setEspecialidades = (data) => especialidades.value = data

  const setServicos = (data) => {
    console.log('serviços ', data)
    servicos.value = data
  }

  return { categoriasEspecialidades, especialidades, servicos, setServicos, setCategorias, setEspecialidades }
})
