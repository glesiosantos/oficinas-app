<template>
  <q-form @submit="onSubmit" class="column">
      <q-card-section class="bg-primary text-black">
        <div class="text-h6">{{ isEdit ? 'Editar Entrada' : 'Nova Entrada de Estoque' }}</div>
      </q-card-section>
        <q-card-section class="col-grow">
          <q-select
            v-model="formData.idFornecedor"
            :options="fornecedoresOptions"
            label="Fornecedor"
            option-label="nomeFornecedor"
            option-value="id"
            filled

            color="accent"
            emit-value
            map-options
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
            color="accent"
            :rules="[val => (val && parseFloat(val) > 0) || 'Preço deve ser maior que zero']"
            class="q-mb-md"
          />
          <q-input
            v-model="formData.quantidade"
            type="text"
            inputmode="numeric"
            label="Quantidade"
            filled
            color="accent"
            lazy-rules
            :rules="[val => (val && parseInt(val) > 0) || 'Quantidade deve ser maior que zero']"
            class="q-mb-md"
          />
        </q-card-section>
         <div class="fixed-bottom q-pa-sm bg-white" style="border-top: 1px solid #ccc;">
          <div class="row q-gutter-sm">
            <q-btn flat label="Cancelar" class="col" color="negative" @click="$emit('cancel')" />

            <q-btn type="submit" color="accent" class="col" label="Adicionar Estoque"/>
          </div>
        </div>
  </q-form>
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
  idFornecedor: null,
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
