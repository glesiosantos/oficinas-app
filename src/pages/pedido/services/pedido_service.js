import { usePedidoStore } from 'src/stores/pedido.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()

const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento
const token = authStore.auth?.token

const pedidoStore = usePedidoStore()

export const pedidoService = () => {

  const carregarPedidosDoEstabelecimento = async () => {
    const response = await api.get(`v1/ordens/${idEstabelecimento}`, {headers: { Authorization: `Bearer ${token}` }})
    pedidoStore.setPedidos(response.data)
  }

  const carregarStatusProposta = async () => {
    const response = await api.get('v1/utils/status/propostas', {headers: { Authorization: `Bearer ${token}` }})
    pedidoStore.setStatus(response.data)
  }

  return { carregarPedidosDoEstabelecimento, carregarStatusProposta }
}
