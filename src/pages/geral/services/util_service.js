import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'
import { useProdutoStore } from "src/stores/produto.store"

const authStore = useAuthStore()
const produtoStore = useProdutoStore()

const token = authStore.auth?.token

export const utilService = () => {

  const carregarCategoriasDosProdutos = async () => {
    const response = await api.get('v1/utils/categorias-produtos', {headers: { Authorization: `Bearer ${token}` }})
    produtoStore.setCategoria(response.data)
  }

  return { carregarCategoriasDosProdutos }

}
