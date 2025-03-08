import { defineRouter } from '#q-app/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth.store'


export default defineRouter(function (/* { store, ssrContext } */) {
  const authStore = useAuthStore()
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async(to, from, next) => {
    if(to.meta?.auth){
      authStore.isAuth ? next() : next({name: 'login'})
    } else {
      next()
    }
  })

  return Router
})
