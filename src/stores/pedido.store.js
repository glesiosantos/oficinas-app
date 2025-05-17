import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePedidoStore = defineStore('pedidoStore', () => {
  const statusProposta = ref([])
  const statusOficina = ref([])
  const pedidos = ref([])

  const setStatus = (data) => statusProposta.value = data

  const setStatusOficina = (data) => statusOficina.value = data

  const setPedidos = (data) => {
    console.log('*** *** pedidos ',data)
    pedidos.value = data
  }

  const getPedidoById = (id) => {
    return pedidos.value.find(pedido => pedido.idOrdem === id) || null
  }

  return { statusProposta, pedidos, statusOficina, setStatus, setPedidos, setStatusOficina, getPedidoById }
})
