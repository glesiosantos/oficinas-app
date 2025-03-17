<template>
  <q-form @submit="$emit('submit', form)" class="column">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary text-white">
      <div class="row items-center no-wrap">
        <div class="text-h6">
          {{ isEdit ? 'Editar Colaborador' : 'Novo Colaborador' }}
        </div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="close"
          color="white"
          @click="$emit('cancel')"
        />
      </div>
    </q-card-section>

    <!-- Corpo (campos) -->
    <q-card-section class="flex-1">
      <q-input
        v-model="form.cpf"
        label="CPF"
        outlined
        mask="###.###.###-##"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'CPF é obrigatório']"
      />

      <q-input
        v-model="form.nomeCompleto"
        label="Nome do Colaborador"
        outlined
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Nome do Colaborador é obrigatório']"
      />

      <q-select
        outlined
        :options="perfils"
        option-label="descricao"
        option-value="nome"
        label="Selecione o perfil"
        v-model="form.perfil"
        emit-value
        map-options
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Perfil é campo obrigatório']"
      />
    </q-card-section>

    <!-- Rodapé (botões) -->
    <q-card-section class="footer-fixed q-pa-md text-right">
      <q-btn
        flat
        label="Cancelar"
        color="negative"
        @click="$emit('cancel')"
      />
      <q-btn
        type="submit"
        color="primary"
        label="Salvar"
      />
    </q-card-section>
  </q-form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isEdit: Boolean,
  initialData: Object,
  perfils: Array // Lista de perfis recebida do colaboradorStore
})

defineEmits(['submit', 'cancel'])

// Criar uma cópia independente dos dados
const form = ref({
  id: null,
  nomeCompleto: '',
  cpf: '',
  perfil: ''
})

// Atualizar o formulário quando initialData mudar
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = {
      id: newData.id || null,
      nomeCompleto: newData.nomeCompleto || newData.nomeCompleto || '', // Ajuste para compatibilidade com a tabela
      cpf: newData.cpf || '',
      perfil: newData.perfil || ''
    }
  } else {
    form.value = { id: null, nomeCompleto: '', cpf: '', perfil: '' }
  }
}, { immediate: true })
</script>
