<template>
  <router-view />
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from './pages/auth/services/auth_service'

const authStore = useAuthStore()
const { checkToken } = authService()
const router = useRouter()

onMounted(async () => {
  console.log('VITE_URL_API:', import.meta.env.VITE_URL_API);
  const refresh = await checkToken()

  if(authStore.isAuth && refresh.data) {
    router.push({ name: 'dashboard'})
  } else {
    router.replace({ name: 'login'})
  }
})


</script>
