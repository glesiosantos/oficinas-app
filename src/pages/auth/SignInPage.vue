<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="full-width q-pa-md">
      <div class="text-center">
        <q-img src="./../../assets/logo.jpeg" style="width: 150px;"/>
      </div>
      <q-separator class="full-width q-ma-lg"/>
      <q-form @submit.prevent="handleForm" class="q-gutter-y-sm">
        <q-input
          outlined
          v-model="form.cpf"
          label="CPF"
          autocomplete="username"
          mask="###.###.###-##"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'CPF é campo obrigatório']"
        />
        <q-input
          outlined
          v-model="form.senha"
          type="password"
          autocomplete="current-password"
          label="Senha"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Senha é campo obrigatório']"/>
        <q-btn color="primary" type="submit" label="Acessar plataforma" class="full-width text-black"/>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'

import { useRouter } from 'vue-router'
import { authService } from './services/auth_service'
import useNotify from 'src/composables/useNotify'

const router = useRouter()
const { logar } = authService()
const { notifyError } = useNotify()

const form = reactive({
  cpf: '',
  senha: ''
})

const handleForm = async () => {
  try {
    await logar(form)
    router.push({ name: 'dashboard' })
    window.location.reload()
  } catch (error) {
    notifyError(`Acesso negado! Mensagem: ${error.message}`)
  }
}
</script>
