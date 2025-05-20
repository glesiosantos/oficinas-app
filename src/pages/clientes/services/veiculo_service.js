import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()

const token = authStore.auth?.token

export const veiculoService = () => {

  const buscarVeiculo = async (data) => {
    const response = await api.get(`v1/veiculos/${data}`, { headers: { Authorization: `Bearer ${token}` }})
    console.log('*** **** ',response.data)
    return response.data
  }

  const registrarVeiculo = async (data) => {
    const response = await api.post('v1/veiculos', data, { headers: { Authorization: `Bearer ${token}` }})
    return response.data
  }

  return { buscarVeiculo, registrarVeiculo }
}
