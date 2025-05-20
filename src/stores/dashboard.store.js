import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDashboardStore = defineStore('dashboardStore', () => {

  const dashboard = ref([])

  const setDados = (data) => dashboard.value = data

  return { dashboard, setDados}
})
