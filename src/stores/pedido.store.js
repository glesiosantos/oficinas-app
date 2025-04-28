import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePedidoStore = defineStore('pedidoStore', () => {

  const statusProposta = ref([])
  const pedidos = ref([])

  const setStatus = (data) => statusProposta.value = data

  const setPedidos = (data) => pedidos.value = data

  return { statusProposta, pedidos, setStatus, setPedidos }

})
