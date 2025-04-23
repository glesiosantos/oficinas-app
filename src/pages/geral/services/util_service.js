import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'
import { useClienteStore } from 'src/stores/cliente.store'
import { useProdutoStore } from "src/stores/produto.store"

const authStore = useAuthStore()
const produtoStore = useProdutoStore()
const clienteStore = useClienteStore()

const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento

const token = authStore.auth?.token

export const utilService = () => {

  const carregarCategoriasDosProdutos = async () => {
    const response = await api.get('v1/utils/categorias-produtos', {headers: { Authorization: `Bearer ${token}` }})
    produtoStore.setCategoria(response.data)
  }

  const carregarClientes = async () => {
      const response = await api.get(`/v1/estabelecimento/clientes/${idEstabelecimento}`,{headers: { Authorization: `Bearer ${token}` }})
      console.log('*** ', response.data)
      clienteStore.setClientes(response.data)
    }

  return { carregarCategoriasDosProdutos, carregarClientes }
}
