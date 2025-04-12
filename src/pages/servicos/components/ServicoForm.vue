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
        :disable="isEdit"
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
        :disable="isEdit"
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
      <q-btn flat label="Cancelar" color="negative" @click="emit('cancel')" />
      <q-btn type="submit" color="primary" label="Salvar" class="text-black" />
    </q-card-section>
  </q-form>
</template>

<script setup>
import { useServicoStore } from 'src/stores/servico.store'
import { ref, watch, computed, onMounted } from 'vue'

const store = useServicoStore()

const props = defineProps({
  isEdit: Boolean,
  initialData: Object
})

const emit = defineEmits(['submit', 'cancel'])

const form = ref({
  idServico: null,
  categoria: '',
  idEspecialidade: null,
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

// Filtrar especialidades
const filteredEspecialidades = computed(() => {
  if (!form.value.categoria) return []
  return store.especialidades.filter(esp => esp.categoria === form.value.categoria)
})

// Carregar dados iniciais
const loadInitialData = () => {
  if (props.initialData) {
    form.value.idServico = props.initialData.idServico || ''
    form.value.categoria = props.initialData.categoria || ''
    form.value.idEspecialidade = String(props.initialData.idEspecialidade || '')
    form.value.valor = props.initialData.valor || 0
    rawValue.value = props.initialData.valor || 0
    inputValue.value = props.initialData.valor
      ? props.initialData.valor.toFixed(2).replace('.', ',')
      : '0,00'
  }
}

// Carregar ao montar (somente se a store já estiver pronta)
onMounted(() => {
  if (store.categoriasEspecialidades.length && store.especialidades.length) {
    loadInitialData()
  }
})

// Garante que dados da store estejam disponíveis para carregar corretamente no modo de edição
watch(
  () => store.especialidades,
  (especialidades) => {
    if (especialidades.length > 0 && props.isEdit && props.initialData) {
      loadInitialData()
    }
  },
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
