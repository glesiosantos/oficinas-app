<template>
  <q-form @submit="$emit('submit', form)" class="column">
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

    <q-card-section class="col-grow">
      <q-input
        v-model="form.nomeFornecedor"
        label="Nome do Fornecedor"
        outlined
        class="q-mb-md"
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Nome do Fornecedor é obrigatório']"
      />

      <div v-for="(contato, index) in form.contatos" :key="index" class="q-mb-md">
        <q-input
          v-model="form.contatos[index]"
          mask="(##) #.####-####"
          :label="index === 0 ? 'Contato Principal' : `Contato ${index + 1}`"
          outlined
          lazy-rules
          :rules="[val => (val && val.length > 0) || 'Contato é obrigatório']"
        >
          <template v-slot:append>
            <q-btn
              v-if="index > 0"
              round
              dense
              flat
              icon="delete"
              color="negative"
              @click="removeContact(index)"
            />
          </template>
        </q-input>
      </div>

      <q-btn
        flat
        label="Adicionar Contato"
        color="primary"
        icon="add"
        @click="addContact"
        class="q-mt-md"
      />
    </q-card-section>

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

const props = defineProps({
  isEdit: Boolean,
  initialData: Object
})

defineEmits(['submit', 'cancel'])

// Criar uma cópia independente dos dados
const form = ref({
  id: null,
  nomeFornecedor: '',
  contatos: ['']
})

function addContact() {
  form.value.contatos.push('')
}

function removeContact(index) {
  if (form.value.contatos.length > 1) {
    form.value.contatos.splice(index, 1)
  }
}

watch(() => props.initialData, (newData) => {
  if (newData) {
    // Criar uma cópia profunda para evitar alterações no objeto original
    form.value = {
      id: newData.id,
      nomeFornecedor: newData.nomeFornecedor || '',
      contatos: Array.isArray(newData.contatos) && newData.contatos.length > 0 ? [...newData.contatos] : ['']
    }
  } else {
    form.value = { id: null, nomeFornecedor: '', contatos: [''] }
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
