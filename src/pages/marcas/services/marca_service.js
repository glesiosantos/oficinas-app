import { useMarcaStore } from 'src/stores/marca.store'
import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()
const marcaStore = useMarcaStore()
// const idEstabelecimento = authStore.auth?.estabelecimento.idEstabelecimento

export const marcaService = () => {
  const carregarMarcas = async () => {
    const response = await api.get('/v1/marcas', {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    marcaStore.setMarcas(response.data)
  }

  const carregarModelosDasMarcas = async () => {
    const response = await api.get('/v1/marcas/modelos', {
      headers: { Authorization: `Bearer ${authStore.auth.token}` }
    })
    marcaStore.setModelos(response.data)
  }

  return { carregarMarcas, carregarModelosDasMarcas }
}
