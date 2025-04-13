import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useClienteStore = defineStore('clienteStore', () => {

  const clientes = ref([])

  const setClientes = (data) => clientes.value = data

  return { clientes, setClientes }
})
