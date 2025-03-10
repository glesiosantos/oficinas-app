<!-- src/components/FornecedorForm.vue -->
<template>
  <q-form @submit="$emit('submit', form)" class="column">
    <!-- Cabeçalho com título e botão de fechar -->
    <q-card-section class="bg-primary text-white">
      <div class="row items-center no-wrap">
        <div class="text-h6">
          {{ isEdit ? 'Editar Fornecedor' : 'Novo Fornecedor' }}
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

    <!-- Conteúdo do formulário -->
    <q-card-section class="col-grow">
      <q-input
        v-model="form.nomeFornecedor"
        label="Nome do Fornecedor"
        outlined
        class="q-mb-md"
      />

      <!-- Lista de contatos -->
      <div v-for="(contato, index) in form.contatos" :key="index" class="q-mb-md">
        <q-input
          v-model="form.contatos[index]"
          mask="(##) #.####.####"
          :label="index === 0 ? 'Contato Principal' : `Contato ${index + 1}`"
          outlined
        >
          <template v-slot:append>
            <q-btn
              v-if="index > 0"
              round
              dense
              mask="(##) #.####.####"
              flat
              icon="delete"
              color="negative"
              @click="removeContact(index)"
            />
          </template>
        </q-input>
      </div>

      <!-- Botão para adicionar novo contato -->
      <q-btn
        flat
        label="Adicionar Contato"
        color="primary"
        icon="add"
        @click="addContact"
        class="q-mt-md"
      />
    </q-card-section>

    <!-- Botões no final do modal -->
    <q-card-actions class="q-pa-md">
      <q-btn
        flat
        label="Cancelar"
        color="negative"
        class="col"
        @click="$emit('cancel')"
      />
      <q-space class="q-mx-sm" />
      <q-btn
        type="submit"
        color="primary"
        label="Salvar"
        class="col"
      />
    </q-card-actions>
  </q-form>
</template>

<script setup>
import { ref, watch } from 'vue'

// Definir as props explicitamente
const props = defineProps({
  isEdit: Boolean,
  initialData: Object
})

defineEmits(['submit', 'cancel'])

const form = ref({
  nomeFornecedor: '',
  contatos: ['']
})

// Adicionar um novo contato
function addContact() {
  form.value.contatos.push('')
}

// Remover um contato pelo índice
function removeContact(index) {
  if (form.value.contatos.length > 1) {
    form.value.contatos.splice(index, 1)
  }
}

// Observar initialData para preencher o formulário
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = { ...newData }
    if (!Array.isArray(form.value.contatos) || form.value.contatos.length === 0) {
      form.value.contatos = ['']
    }
  } else {
    form.value = { nomeFornecedor: '', contatos: [''] }
  }
}, { immediate: true })
</script>

<style scoped>
.column {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.col-grow {
  flex-grow: 1;
}

.q-card-actions {
  width: 100%;
}
</style>
