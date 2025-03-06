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
import { useAuthStore } from 'src/stores/auth.store'
import { reactive } from 'vue'

import useNotify from 'src/composables/UseNotify'

const authStore = useAuthStore()
const { notfifySucess, notfifyError } = useNotify()

const form = reactive({
  cpf: '',
  senha: ''
})

const handleForm = () => {
  authStore.login(form).then(response => {
    console.log(response)
    notfifySucess('Login realizando com sucesso!')
  }).catch(error => notfifyError(error.message))
}

</script>
