<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card class="full-width q-pa-md">
      <q-img src="./../../assets/quasar-logo-vertical.svg" style="width: 150px;"/>
      <q-separator class="full-width q-ma-lg"/>
      <q-form @submit.prevent="handleForm" class="q-gutter-y-sm">
        <q-input
          outlined
          v-model="form.cpf"
          label="CPF"
          mask="###.###.###-##"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'CPF é campo obrigatório']"
        />
        <q-input
          outlined
          v-model="form.senha"
          type="password"
          label="Senha"
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Senha é campo obrigatório']"/>
        <q-btn color="primary" type="submit" label="Acessar plataforma" class="full-width"/>
      </q-form>
      <!-- <q-btn
        color="red"
        label="Esqueci da senha"
        :to="{ name: 'forgout'}"
        flat
        class="full-width q-mt-sm"
      /> -->
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
const { notifyError, notifySuccess } = useNotify()

const form = reactive({
  cpf: '',
  senha: ''
})

const handleForm = () => {
   logar(form).then(response => {
    console.log(response)
    router.replace({ name: 'dashboard'})
    notifySuccess("Logado com sucesso!")
   }).catch((error) => {
    notifyError(error.message)
    console.log(error)
  })

}
</script>
