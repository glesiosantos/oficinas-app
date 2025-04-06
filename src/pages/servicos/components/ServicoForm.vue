<template>
  <q-form @submit="onSubmit" class="column">
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
          @click="emit('cancel')"
        />
      </div>
    </q-card-section>

    <q-card-section class="flex-1">
      <q-select
        outlined
        :options="store.categoriasEspecialidades"
        option-label="categoria"
        option-value="categoria"
        label="Selecione a categoria"
        v-model="form.categoria"
        emit-value
        map-options
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Categoria é campo obrigatório']"
      />

      <q-select
        outlined
        :options="filteredEspecialidades"
        option-label="nomeEspecialidade"
        option-value="idEspecialidade"
        label="Selecione a especialidade"
        v-model="form.idEspecialidade"
        emit-value
        map-options
        lazy-rules
        :rules="[val => (val && val.length > 0) || 'Especialidade é campo obrigatório']"
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

    <!-- Rodapé (botões) -->
    <q-card-section class="footer-fixed q-pa-md text-right">
      <q-btn
        flat
        label="Cancelar"
        color="negative"
        @click="emit('cancel')"
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
import { useServicoStore } from 'src/stores/servico.store'
import { ref, watch, computed } from 'vue'

const store = useServicoStore()

const props = defineProps({
  isEdit: Boolean,
  initialData: Object
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  categoria: '',
  idEspecialidade: null,
  valor: 0
})

const rawValue = ref(0) // Valor numérico bruto
const inputValue = ref(0) // Valor exibido no input

// Função para atualizar o rawValue a partir do input
const updateRawValue = (val) => {
  const cleanValue = val.replace(/[^\d,]/g, '').replace(',', '.')
  rawValue.value = parseFloat(cleanValue) || 0
}

// Sincroniza rawValue com form.valor
watch(rawValue, (newValue) => {
  if (newValue !== form.value.valor) {
    form.value.valor = newValue
  }
})

// Filtrar especialidades
const filteredEspecialidades = computed(() => {
  if (!form.value.categoria) return []
  return store.especialidades.filter(esp => esp.categoria === form.value.categoria)
})

// Resetar idEspecialidade
watch(() => form.value.categoria, () => {
  form.value.idEspecialidade = null
})

// Carregar initialData
watch(() => props.initialData, (newData) => {
  if (newData) {
    form.value = {
      categoria: newData.categoria || '',
      idEspecialidade: newData.idEspecialidade || null,
      valor: newData.valor || 0
    }
    rawValue.value = newData.valor || 0
    inputValue.value = newData.valor ? newData.valor.toFixed(2).replace('.', ',') : '0,00'
  } else {
    form.value = {
      categoria: '',
      idEspecialidade: null,
      valor: 0
    }
    rawValue.value = 0
    inputValue.value = '0,00'
  }
}, { immediate: true })

const onSubmit = () => {
  emit('submit', form.value)
}
</script>
