import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth.store'
import { authService } from 'src/pages/auth/services/auth_service'


export default defineRouter(function (/* { store, ssrContext } */) {

  const {checkToken} = authService()

  const authStore = useAuthStore()
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    // Verifica o token se o usuário está autenticado
    if (authStore.isAuth) {
      const isValid = await checkToken()
      if (!isValid) authStore.removeAuth()
    }

    if (to.meta?.auth) {
      authStore.isAuth ? next() : next({ name: 'login' })
    } else if (to.name === 'login' && authStore.isAuth) {
      next({ name: 'dashboard' })
    } else {
      next()
    }
  })


  return Router
})
