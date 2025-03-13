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
        class="q-mb-md"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'CPF é obrigatório']"
      />

      <q-input
        v-model="form.nomeColaborador"
        label="Nome do Colaborador"
        outlined
        class="q-mb-md"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Nome do Colaborador é obrigatório']"
      />

      <q-select
        outlined
        v-model="form.perfil"
        :options="perfils"
        label="Perfil do Colaborador"
      />
    </q-card-section>

    <!-- Rodapé (botões) -->
    <q-card-section class="footer-fixed q-pa-md text-right ">
      <q-btn
        flat
        label="Cancelar"
        color="negative"
        class="q-mr-md"
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
  perfils: Array
})

defineEmits(['submit', 'cancel'])

// Criar uma cópia independente dos dados
const form = ref({
  id: null,
  nomeColaborador: '',
  cpf: '',
  perfil: ''
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    // Criar uma cópia profunda para evitar alterações no objeto original
    form.value = {
      id: newData.id,
      nomeColaborador: newData.nomeColaborador || '',
      cpf: newData.cpf || '',
      perfil: newData.perfil || '',
    }
  } else {
    form.value = { id: null, nomeColaborador: '', cpf: '', perfil: '' }
  }
}, { immediate: true })
</script>


