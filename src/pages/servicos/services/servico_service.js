import { useServicoStore } from 'src/stores/servico.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()
const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento
const servicoStore = new useServicoStore()

export const servicoService = () => {

  const carregarCategoriasDosServicos = async() => {
    const response = await api.get('v1/especialidades/categorias', {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    servicoStore.setCategorias(response.data)
  }

  const carregarEspecialidades = async () => {
    const response = await api.get('v1/especialidades', {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    servicoStore.setEspecialidades(response.data)
  }

  const deletarServicoDoEstabelecimento = async (data) => {
    const response = await api.delete(`v1/servicos/${idEstabelecimento}/${data.idServico}`, {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    return response
  }

  const editarServicoDoEstabelecimento = async (data) => {
    const response = await api.post(`v1/servicos/editar`, Object.assign({}, data, { idEstabelecimento }), {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    return response
  }

  const carregarServicoDoEstabelecimento = async () => {
    const response = await api.get(`v1/servicos/${idEstabelecimento}`, {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    servicoStore.setServicos(response.data)
  }

  const addServicoParaEstabelecimento = async (data) => {
    const response = await api.post('v1/servicos', Object.assign({}, data, {idEstabelecimento}), {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    return response
  }

  return { carregarCategoriasDosServicos, carregarEspecialidades, carregarServicoDoEstabelecimento, addServicoParaEstabelecimento, deletarServicoDoEstabelecimento, editarServicoDoEstabelecimento }
}
