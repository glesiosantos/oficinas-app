import { api } from '../../../boot/axios'
import { useAuthStore } from 'src/stores/auth.store'
import { useDashboardStore } from 'src/stores/dashboard.store'

export const  dashboardService = () => {

  const authStore = useAuthStore()
  const dashboardStore = useDashboardStore()

  const obterDados = async (data) => {
    const response = await api.get(`/v1/dashboard/${data}`, { headers: { Authorization: `Bearer ${authStore.auth.token}` } })
    dashboardStore.setDados(response.data)
  }

  return { obterDados }
}
