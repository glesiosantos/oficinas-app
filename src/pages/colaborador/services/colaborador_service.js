import { useColaboradorStore } from 'src/stores/colaborador.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()
const colaboradorStore = useColaboradorStore()

const idEstabelecimento = authStore.auth.estabelecimento.idEstabelecimento
const token = authStore.auth.token

export const colaboradorService = () => {

  const addColaborador = () => {}

  const editarColaborador = () => {}

  const removerColaborador = () => {}

  const carregarColaboradores = async () => {
    const response = await api.get(`/v1/usuarios/${idEstabelecimento}`,
       {headers: { Authorization: `Bearer ${token}` }})
    colaboradorStore.setColaboradores(response.data)
  }

  const carregarPerfisDoSistema = async () => {
    const response = await api.get('/v1/utils/perfis', {headers: { Authorization: `Bearer ${token}` }})
    colaboradorStore.setPerfils(response.data)
  }

  return { addColaborador, editarColaborador, removerColaborador, carregarColaboradores, carregarPerfisDoSistema }
}
