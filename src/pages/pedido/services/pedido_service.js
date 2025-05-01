import { usePedidoStore } from 'src/stores/pedido.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()

const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento
const token = authStore.auth?.token

const pedidoStore = usePedidoStore()

export const pedidoService = () => {

  const carregarTodasAsOrdensDoEstabelecimento = async () => {
    const response = await api.get(`v1/ordens/${idEstabelecimento}`, {headers: { Authorization: `Bearer ${token}` }})
    console.log('**** **** ', response.data)
    pedidoStore.setPedidos(response.data)
  }

  const carregarOrdensDoEstabelecimentoComTipoPedido = async () => {
    const response = await api.get(`v1/ordens/${idEstabelecimento}`, {headers: { Authorization: `Bearer ${token}` }})
    pedidoStore.setPedidos(response.data)
  }

  const carregarStatusProposta = async () => {
    const response = await api.get('v1/utils/status/propostas', {headers: { Authorization: `Bearer ${token}` }})
    pedidoStore.setStatus(response.data)
  }

  const registrarOrdemEstabelecimento = async (data) => {
    const response = await api.post('/v1/ordens', data, {headers: { Authorization: `Bearer ${authStore.auth.token}` }})
    return response.data
  }

  return { carregarTodasAsOrdensDoEstabelecimento,carregarOrdensDoEstabelecimentoComTipoPedido, carregarStatusProposta, registrarOrdemEstabelecimento }
}
