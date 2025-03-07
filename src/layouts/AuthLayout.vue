<template>
  <q-layout view="lhh lpr lFf">
    <q-page-container class="row auth-background">
        <div class="col-xs-12 col-md-4 q-px-2">
          <router-view />
        </div>
        <div class="col-xs-12 col-md-8 q-xs-hidden"></div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth.store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if(authStore.isAuth) {
    router.push({ name: 'dashboard'})
  } else {
    router.replace({ name: 'login'})
  }
})
</script>
