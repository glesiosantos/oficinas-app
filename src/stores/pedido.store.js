import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePedidoStore = defineStore('pedidoStore', () => {
  const statusProposta = ref([])
  const pedidos = ref([])

  const setStatus = (data) => statusProposta.value = data


  const setPedidos = (data) => {
    console.log('*** *** * pedidos: ', data)
    pedidos.value = data
  }

  const getPedidoById = (id) => {
    console.log('*** *** * pedidos: ', pedidos.value)
    return pedidos.value.find(pedido => pedido.idOrdem === id) || null
  }

  return { statusProposta, pedidos, setStatus, setPedidos, getPedidoById }
})
