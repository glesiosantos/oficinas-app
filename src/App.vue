<template>
  <router-view />
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from './pages/auth/services/auth_service'

const authStore = useAuthStore()
const { refreshToken } = authService()
const router = useRouter()

onMounted(async () => {

  const refresh = await refreshToken()

  if(authStore.isAuth && refresh.data) {
    router.push({ name: 'dashboard'})
  } else {
    router.replace({ name: 'login'})
  }
})
</script>
