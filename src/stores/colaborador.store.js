import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useColaboradorStore = defineStore('colaboradorStore', () => {

  const colaboradores = ref([])

  const perfils = ref([])

  const setColaboradores = (data) => {
    colaboradores.value = data
  }

  const setPerfils = (data) => perfils.value = data

  return { colaboradores, perfils, setColaboradores, setPerfils }
})
