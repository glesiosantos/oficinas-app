import { useFornecedorStore } from 'src/stores/fornecedor.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()
const fornecedorStore = useFornecedorStore()
const idEstabelecimento = authStore.auth.estabelecimento.idEstabelecimento

export const fornecedorService = () => {

  const addFornecedor = async (data) => {
    const request = Object.assign({}, data, {idEstabelecimento: idEstabelecimento})
    const response = await api.post('/v1/fornecedores', request, { headers: {
      Authorization: `Bearer ${authStore.auth.token}`
    }})
    return response.data
  }

  const carregarFornecedores = async () => {
    const response = await api.get( `/v1/fornecedores/${idEstabelecimento}`,{headers: {
      Authorization: `Bearer ${authStore.auth.token}`
    }})
    fornecedorStore.setFornecedores(response.data)
  }

  return { addFornecedor, carregarFornecedores }
}
