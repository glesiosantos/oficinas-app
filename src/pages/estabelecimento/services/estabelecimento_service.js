import { api } from 'src/boot/axios'
import { useAuthStore } from 'src/stores/auth.store'
import { useEstabelecimentoStore } from 'src/stores/estabelecimento.store'

const authStore = useAuthStore()
const estabelecimentoStore = useEstabelecimentoStore()
const idEstabelecimento = authStore.auth.estabelecimento.idEstabelecimento
const token = authStore.auth.token

export const estabelecimentoService = () => {

  const carregarEstabelecimento = async () => {
    const response = await api.get(`v1/estabelecimento/${idEstabelecimento}`, { headers: { Authorization: `Bearer ${token}` }})
    estabelecimentoStore.setEstabelecimento(response.data)
  }

  return { carregarEstabelecimento }
}
