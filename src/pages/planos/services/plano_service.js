import { usePlanoStore } from 'src/stores/plano.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()
const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento
const planoStore = usePlanoStore()

export const planoService = () => {

  const carregarPlanos = async () => {
    const response = await api.get('v1/planos', {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    planoStore.setPlanos(response.data)
  }

  const atualizarPlano = async (data) => {
    const response = await api.post('v1/planos/atualizar', Object.assign({}, data, { idEstabelecimento }), {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    return response
  }

  return { carregarPlanos, atualizarPlano }
}
