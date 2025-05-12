<template>
  <q-form @submit="onSubmit" class="column">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary">
      <div class="row items-center no-wrap">
        <div class="text-h6">
          {{ isEdit ? 'Editar Serviço' : 'Novo Serviço' }}
        </div>
        <q-space />
        <q-btn flat round dense icon="close" @click="emit('cancel')" />
      </div>
    </q-card-section>

    <q-card-section class="flex-1">

      <q-input
        v-model="form.descricao"
        label="Descricao do Serviço"
        outlined
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Descrição é obrigatório']"
      />

      <q-input
        v-model="inputValue"
        label="Valor do serviço"
        outlined
        lazy-rules
        prefix="R$ "
        aria-placeholder="0,00"
        :rules="[val => (val && val.length > 0) || 'Valor é obrigatório']"
        @update:model-value="updateRawValue"
      />
    </q-card-section>

    <div class="fixed-bottom q-pa-sm bg-white" style="border-top: 1px solid #ccc;">
      <div class="row q-gutter-sm">
        <q-btn flat label="Cancelar" class="col" color="negative" @click="emit('cancel')" />
      <q-btn type="submit" color="accent" class="col" label="Salvar"/>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isEdit: Boolean,
  initialData: Object
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  idServico: null,
  descricao: null,
  valor: 0
})

const rawValue = ref(0)
const inputValue = ref('0,00')

// Função para formatar o valor
const updateRawValue = (val) => {
  if (typeof val === 'string') {
    const cleanValue = val.replace(/[^\d,]/g, '').replace(',', '.')
    rawValue.value = parseFloat(cleanValue) || 0
  } else {
    rawValue.value = val || 0
  }
  form.value.valor = rawValue.value
}


// Carregar dados iniciais
const loadInitialData = () => {
  if (props.initialData) {
    form.value.idServico = props.initialData.idServico || ''
    form.value.descricao = props.initialData.descricao || ''
    form.value.valor = props.initialData.valor || 0
    rawValue.value = props.initialData.valor || 0
    inputValue.value = props.initialData.valor
      ? props.initialData.valor.toFixed(2).replace('.', ',')
      : '0,00'
  }
}

// Garante que dados da store estejam disponíveis para carregar corretamente no modo de edição
watch(
  loadInitialData() ,
  { immediate: true }
)

// Resetar idEspecialidade quando categoria mudar (apenas no modo novo)
watch(() => form.value.categoria, () => {
  if (!props.isEdit) {
    form.value.idEspecialidade = null
  }
})

const onSubmit = () => {
  emit('submit', form.value)
}
</script>
