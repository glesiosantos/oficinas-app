import { useProdutoStore } from 'src/stores/produto.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()
const produtoStore = useProdutoStore()

const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento
const token = authStore.auth?.token

export const produtoService = () => {

  const addProduto = async (data) => {
    const request = Object.assign({}, data, { idEstabelecimento: idEstabelecimento })
    const response = await api.post('v1/produtos', request, { headers: { Authorization: `Bearer ${token}` }})
    return response.data
  }

  const carregarProdutosDoEstabelecimento = async () => {
    const response = await api.get(`v1/produtos/${idEstabelecimento}`,{ headers: { Authorization: `Bearer ${token}` }})
    produtoStore.setProdutos(response.data)
  }

  const carregarProdutoPorIdMaisEstabelecimento = async (data) => {
    const response = await api.get(`v1/produtos/${data}/${idEstabelecimento}`, {headers: { Authorization: `Bearer ${token}` }})
    return response.data
  }

  const carregarProdutoPeloCodigoMaisEstabelecimento = async (data) => {
    const response = await api.get(`v1/produtos/codigo/${data}/${idEstabelecimento}`, {headers: { Authorization: `Bearer ${token}` }})
    return response
  }

  const editarProduto = async (data) => {
    const request = Object.assign({}, data, { idEstabelecimento })
    const response = await api.post('v1/produtos/editar', request, {headers: { Authorization: `Bearer ${token}` }})
    return response
  }

  const adicionarEstoqueProduto = async (data) => {
    const request = Object.assign({}, data, { idEstabelecimento })
    const response = await api.post('v1/estoques', request, {headers: { Authorization: `Bearer ${token}` }})
    return response
  }

  return { addProduto,
    editarProduto,
    carregarProdutoPorIdMaisEstabelecimento,
    carregarProdutoPeloCodigoMaisEstabelecimento,
    carregarProdutosDoEstabelecimento,
    adicionarEstoqueProduto
  }
}
