import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'
import { useClienteStore } from 'src/stores/cliente.store'
import { useMarcaStore } from 'src/stores/marca.store'
import { useProdutoStore } from "src/stores/produto.store"
import { useVeiculoStore } from 'src/stores/veiculo.store'

const authStore = useAuthStore()
const produtoStore = useProdutoStore()
const clienteStore = useClienteStore()
const veiculoStore = useVeiculoStore()
const marcaStore = useMarcaStore()

const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento

const token = authStore.auth?.token

export const utilService = () => {

  const carregarCategoriasDosProdutos = async () => {
    const response = await api.get('v1/utils/categorias-produtos', {headers: { Authorization: `Bearer ${token}` }})
    produtoStore.setCategoria(response.data)
  }

  const carregarClientes = async () => {
      const response = await api.get(`/v1/estabelecimento/clientes/${idEstabelecimento}`,{headers: { Authorization: `Bearer ${token}` }})
      clienteStore.setClientes(response.data)
  }

  const carregarVeiculosRegistrado = async () => {
    const response = await api.get('/v1/veiculos',{headers: { Authorization: `Bearer ${token}` }})
    console.log('*** **** veiculos: ', response.data)
    veiculoStore.setVeiculos(response.data)
  }

  const carregarMarcas = async () => {
    const response = await api.get('/v1/marcas', {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    console.log('*** **** marcas: ', response.data)
    marcaStore.setMarcas(response.data)
  }

  return { carregarCategoriasDosProdutos, carregarClientes, carregarVeiculosRegistrado, carregarMarcas }
}
