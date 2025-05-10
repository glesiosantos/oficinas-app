import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'
import { useFornecedorStore } from 'src/stores/fornecedor.store'

const authStore = useAuthStore()
const fornecedorStore = useFornecedorStore()
const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento

export const fornecedorService = () => {
  const addFornecedor = async (data) => {
    const request = Object.assign({}, data, { idEstabelecimento: idEstabelecimento })
    const response = await api.post('/v1/fornecedores', request, {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    return response.data
  }

  const carregarFornecedores = async () => {
    const response = await api.get(`/v1/fornecedores/${idEstabelecimento}`, {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    fornecedorStore.setFornecedores(response.data)
  }

  const editarFornecedor = async (data) => {
    const request = Object.assign({}, data, { idEstabelecimento: idEstabelecimento, idFornecedor: data.id })
    const response = await api.put(`/v1/fornecedores/editar`, request, {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    return response.data // Retorna o fornecedor atualizado, mas não seta diretamente no store
  }

  const excluirFornecedor = async (data) => {
    await api.post('/v1/fornecedores/remove', { idEstabelecimento: idEstabelecimento, idFornecedor: data }, {
    headers: { Authorization: `Bearer ${authStore.auth.token}` }
  })}

  return { addFornecedor, carregarFornecedores, editarFornecedor, excluirFornecedor }
}
