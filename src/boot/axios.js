import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

console.log('VITE_URL_API - axios:', import.meta.env.VITE_URL_API);
const api = axios.create({ baseURL: import.meta.env.VITE_URL_API })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
