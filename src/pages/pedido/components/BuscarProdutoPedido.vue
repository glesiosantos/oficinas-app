<template>
  <div class="column full-height relative-position">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary q-py-sm">
      <div class="row items-center no-wrap">
        <div class="text-h6">Buscar Produto</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <!-- Campo de Busca -->
    <div class="q-pa-md">
      <q-input
        v-model="searchTerm"
        label="Buscar por Nome ou Referência"
        outlined
        dense
        clearable
        class="q-mb-md"
        @update:model-value="filterProducts"
        debounce="300"
      />
    </div>

    <!-- Lista rolável -->
    <div class="scroll-area q-px-md" style="flex: 1; overflow-y: auto;">
      <q-table
        :rows="filteredProducts"
        :columns="columns"
        row-key="id"
        dense
        :loading="loading"
        hide-header
        flat
        bordered
        :rows-per-page-options="[20, 50]"
        class="product-table full-width"
        grid
      >
        <template v-slot:item="props">
          <q-item dense class="q-pa-xs q-my-xs bg-grey-1 rounded-borders">
            <q-item-section side>
              <q-checkbox
                v-model="selectedProducts"
                :val="props.row"
                dense
              />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle2 ellipsis">{{ props.row.descricao }}</q-item-label>
              <q-item-label caption>Ref: {{ props.row.referencia }}</q-item-label>
              <q-item-label caption>Preço: R$ {{ calcularPrecoVenda(props.row).toFixed(2) }}</q-item-label>
              <q-item-label caption>Estoque: {{ props.row.quantidadeEstoque ?? '0' }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>

        <template v-slot:no-data>
          <q-item>
            <q-item-section>
              <q-item-label>Nenhum produto encontrado</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-table>
    </div>

    <!-- Rodapé fixo com botões -->
    <div class="fixed-bottom q-pa-sm bg-white" style="border-top: 1px solid #ccc;">
      <div class="row q-gutter-sm">
        <q-btn
          flat
          label="Cancelar"
          color="negative"
          class="col"
          @click="$emit('cancel')"
        />
        <q-btn
          flat
          label="Selecionar"
          color="accent"
          class="col"
          :disable="selectedProducts.length === 0"
          @click="emitSelectedProducts"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useProdutoStore } from 'src/stores/produto.store'

const produtoStore = useProdutoStore()
const $q = useQuasar();
const emit = defineEmits(['select', 'cancel']);

const searchTerm = ref('');
const allProducts = ref([]);
const filteredProducts = ref([]);
const selectedProducts = ref([]);
const loading = ref(false);

const columns = [
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'referencia', label: 'Referência', field: 'referencia', align: 'left' },
  { name: 'valorCusto', label: 'Preço', field: 'valorCusto', align: 'right' },
]

const calcularPrecoVenda = (produto) => {
  const valorCusto = produto.valorCusto || 0;
  const percentualLucro = produto.percentualLucro || 0;
  return valorCusto * (1 + percentualLucro / 100);
}

onMounted(() => {
  loadAllProducts();
});

const loadAllProducts = async () => {
  // console.log('**** Produtos', produtoStore.produtos)
  try {
    loading.value = true;
    allProducts.value = produtoStore.produtos;
    filteredProducts.value = allProducts.value;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar produtos: ' + (error.message || 'Erro desconhecido'),
    });
    allProducts.value = [];
    filteredProducts.value = [];
  } finally {
    loading.value = false;
  }
}

const filterProducts = (term) => {
  if (!term) {
    filteredProducts.value = allProducts.value;
    return;
  }
  const lowerTerm = term.toLowerCase();
  filteredProducts.value = allProducts.value.filter(product => {
    return (
      (product.descricao && product.descricao.toLowerCase().includes(lowerTerm)) ||
      (product.referencia && product.referencia.toLowerCase().includes(lowerTerm))
    );
  });
};

const emitSelectedProducts = () => {
  if (selectedProducts.value.length > 0) {
    emit('select', selectedProducts.value);
    $q.notify({
      type: 'positive',
      message: `${selectedProducts.value.length} produto(s) selecionado(s)`
    });
    selectedProducts.value = [];
  } else {
    $q.notify({
      type: 'warning',
      message: 'Nenhum produto selecionado'
    });
  }
};
</script>

<style scoped>
.scroll-area {
  max-height: calc(100vh - 220px); /* Ajuste conforme a altura do cabeçalho e rodapé */
}
</style>
