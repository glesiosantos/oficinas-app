import { useClienteStore } from 'src/stores/cliente.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()
const clienteStore = useClienteStore()

const idEstabelecimento = authStore.auth.estabelecimento.idEstabelecimento
const token = authStore.auth.token

export const clienteService = () => {

  const addCliente = async (data) => {
    const request = Object.assign({}, data, { idEstabelecimento: idEstabelecimento })
    const response = await api.post('v1/clientes', request, { headers: { Authorization: `Bearer ${token}` }})
    return response
  }

  const carregarClienteESeusVeiculos = async (data) => {
    const response = await api.get(`v1/estabelecimento/clientes/${idEstabelecimento}/${data}`,{ headers: { Authorization: `Bearer ${token}` }})
    console.log(response.data)
    response.data
  }

  const adicionarVeiculo = async (data) => {
    const request = Object.assign({}, data, { idUsuario: data.idColaborador, idEstabelecimento })
    const response = await api.post('v1/clientes/addVeiculo', request,{headers: { Authorization: `Bearer ${token}` }})
    return response
  }

  const carregarClientes = async () => {
    const response = await api.get(`/v1/estabelecimento/clientes/${idEstabelecimento}`,{headers: { Authorization: `Bearer ${token}` }})
    console.log(response.data)
    clienteStore.setClientes(response.data)
  }

  return { addCliente, adicionarVeiculo, carregarClienteESeusVeiculos, carregarClientes }
}
