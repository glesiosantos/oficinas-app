<template>
  <q-card style="height: 100%;">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">{{ isEdit ? 'Editar Entrada' : 'Nova Entrada de Estoque' }}</div>
    </q-card-section>
    <q-card-section>
      <q-form @submit="onSubmit">
        <q-select
          v-model="formData.fornecedor"
          :options="fornecedoresOptions"
          label="Fornecedor"
          option-label="nomeFornecedor"
          option-value="id"
          filled
          use-input
          input-debounce="300"
          @filter="buscarFornecedores"
          :rules="[val => !!val || 'Selecione um fornecedor']"
          class="q-mb-md"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                Nenhum fornecedor encontrado
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-input
          v-model="formData.precoCusto"
          type="text"
          inputmode="numeric"
          label="Preço de Custo (R$)"
          filled
          lazy-rules
          :rules="[val => (val && parseFloat(val) > 0) || 'Preço deve ser maior que zero']"
          class="q-mb-md"
        />
        <q-input
          v-model="formData.quantidade"
          type="text"
          inputmode="numeric"
          label="Quantidade"
          filled
          lazy-rules
          :rules="[val => (val && parseInt(val) > 0) || 'Quantidade deve ser maior que zero']"
          class="q-mb-md"
        />
        <div class="q-mt-md">
          <q-btn
            color="primary"
            type="submit"
            label="Adicionar Entrada"
            class="q-mr-sm"
          />
          <q-btn
            color="negative"
            label="Cancelar"
            @click="$emit('cancel')"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { useFornecedorStore } from 'src/stores/fornecedor.store'

const fornecedorStore = useFornecedorStore()
const $q = useQuasar()
const props = defineProps({
  isEdit: Boolean,
  initialData: Object,
});
const emit = defineEmits(['submit', 'cancel'])

const formData = ref({
  fornecedor: null,
  precoCusto: null,
  quantidade: null,
});
const fornecedoresOptions = fornecedorStore.fornecedores

// Inicializar formData com initialData, se fornecido
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      formData.value = { ...newData };
    }
  },
  { immediate: true }
);

// Função para buscar fornecedores dinamicamente
const buscarFornecedores = async (val, update) => {
  try {
    update(() => {
      fornecedoresOptions.value = fornecedorStore.fornecedores.map(f => ({
        id: f.id,
        nomeFornecedor: f.nomeFornecedor,
      }));
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao buscar fornecedores: ' + error.message,
    });
  }
};

const onSubmit = async () => {
  emit('submit', { ...formData.value });
}
</script>

<style scoped>
.q-card {
  min-height: 100%;
}
</style>
