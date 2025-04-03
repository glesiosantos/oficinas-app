<template>
  <q-form @submit="$emit('submit', form)" class="column">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary">
      <div class="row items-center no-wrap">
        <div class="text-h6">
          {{ isEdit ? 'Editar Serviço' : 'Novo Serviço' }}
        </div>
        <q-space />
        <q-btn
          flat
          round
          dense
          icon="close"
          @click="$emit('cancel')"
        />
      </div>
    </q-card-section>

    <q-card-section class="flex-1">
      <q-radio
          v-for="v in tiposVeiculo"
          :val="v"
          :label="v"
          :key="v"
        />

      <q-select
        outlined
        :options="perfils"
        option-label="descricao"
        option-value="nome"
        label="Selecione a categoria"
        emit-value
        map-options
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Perfil é campo obrigatório']"
      />

      <q-select
        outlined
        :options="perfils"
        option-label="descricao"
        option-value="nome"
        label="Selecione a especialidade"
        v-model="form.perfil"
        emit-value
        map-options
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Perfil é campo obrigatório']"
      />

      <q-input
        v-model="form.cpf"
        label="Valor do serviço"
        outlined
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Valor é obrigatório']"
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
        class="text-black"
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
  idColaborador: null,
  nomeCompleto: '',
  cpf: '',
  perfil: ''
})

const tiposVeiculo = ref(['Carro', 'Moto'])

// Atualizar o formulário quando initialData mudar
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = {
      idColaborador: newData.idColaborador || null,
      nomeCompleto: newData.nomeCompleto || newData.nomeCompleto || '', // Ajuste para compatibilidade com a tabela
      cpf: newData.cpf || '',
      perfil: newData.perfil || ''
    }
  } else {
    form.value = { idColaborador: null, nomeCompleto: '', cpf: '', perfil: '' }
  }
}, { immediate: true })
</script>
