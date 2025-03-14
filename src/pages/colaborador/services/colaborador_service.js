import { useColaboradorStore } from 'src/stores/colaborador.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()
const colaboradorStore = useColaboradorStore()

export const colaboradorService = () => {

  const addColaborador = () => {}

  const editarColaborador = () => {}

  const removerColaborador = () => {}

  const carregarPerfisDoSistema = async () => {
    const response = await api.get('/v1/utils/perfis', {headers: { Authorization: `Bearer ${authStore.auth.token}` }})
    colaboradorStore.setPerfils(response.data)
  }

  return { addColaborador, editarColaborador, removerColaborador, carregarPerfisDoSistema }
}
