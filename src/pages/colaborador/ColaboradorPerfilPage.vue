<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <q-card-section>
        <div class="text-h6">Meu Perfil</div>
      </q-card-section>

      <q-card-section>
        <q-list bordered separator>
          <q-item>
            <q-item-section>
              <q-item-label overline>Nome</q-item-label>
              <q-item-label>{{formatarDocumento(authStore.auth.cpf)}} - {{authStore.auth.nome}}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label overline>Perfil</q-item-label>
              <q-item-label>{{authStore.auth.perfil}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-section>
        <span>Alterar a senha de acesso</span>
        <q-form @submit="changePassword">
          <div class="row q-col-gutter-sm q-mt-xs">
            <q-input
            v-model="form.nova"
            label="Nova Senha"
            type="password"
            class="col-12 col-md-6"
            outlined
            lazy-rules
            :rules="[val => val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres']"
          />

          <q-input
            v-model="form.confirmar"
            label="Confirma senha"
            type="password"
            class="col-12 col-md-6"
            outlined
            lazy-rules
            :rules="[val => val.length >= 6 || 'A senha deve ter no mínimo 6 caracteres']"
          />
          </div>

          <div class="row q-gutter-sm">
            <q-btn label="Alterar Senha" type="submit" color="accent" :class="{'full-width': $q.screen.xs}" @click="changePassword"/>
            <q-btn label="Cancelar" @click="handleCancelar" size="md" color="red" :class="{'full-width': $q.screen.xs}"/>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>

import { useFormatarDocumento } from 'src/composables/useFormatarDocumento'
import { useAuthStore } from 'src/stores/auth.store'
import { reactive } from 'vue'
import { colaboradorService } from './services/colaborador_service'
import useNotify from 'src/composables/useNotify'

const authStore = useAuthStore()
const { formatarDocumento } = useFormatarDocumento()
const { alterarSenhaColaborador } = colaboradorService()

const { notifyWarning, notifySuccess } = useNotify()

let form = reactive({
  nova: '',
  confirmar: '',
  cpf: authStore.auth?.cpf || ''
})

const changePassword = async () => {

  if (form.nova !== form.confirmar) {
    notifyWarning('Senha diferentes! A nova senha deverá ser igual a confirmação de senha')
    return
  }

  const response = await alterarSenhaColaborador(form)

  if (response.status === 204) {
    form = {}
    notifySuccess('Senha alterada com sucesso! Deverá realizar logar novamente com a nova senha')
  }

}

const handleCancelar = () => {
  form = {}
  notifyWarning("Operação cancelada pelo usuário")
}

</script>
