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
        :rows-per-page-options="[10, 20, 50]"
        class="product-table full-width"
        hide-header
        flat
        bordered
        grid
      >
        <template v-slot:item="props">
          <div class="q-pa-sm col-xs-12 col-sm-12 col-md-12">
            <q-card flat bordered class="product-card">
              <q-card-section>
                <div class="text-subtitle2">{{ props.row.descricao }}</div>
                <div class="text-caption">Ref: {{ props.row.referencia }}</div>
                <div class="text-caption">Preço: R$ {{ calcularPrecoVenda(props.row).toFixed(2) }}</div>
              </q-card-section>
              <q-card-actions>
                <q-btn
                  color="accent"
                  label="Selecionar"
                  dense
                  flat
                  class="full-width"
                  @click="selectProduct(props.row)"
                />
              </q-card-actions>
            </q-card>
          </div>
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

    <!-- Rodapé fixo com botão -->
    <div class="fixed-bottom q-pa-sm bg-white" style="border-top: 1px solid #ccc;">
      <q-btn flat label="Cancelar" color="negative" class="full-width" @click="$emit('cancel')" />
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
const loading = ref(false);

// Colunas (não aparecem no grid, mas são necessárias para o QTable)
const columns = [
  { name: 'descricao', label: 'Descrição do prdouto', field: 'descricao', align: 'left' },
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

// Carregar todos os produtos
const loadAllProducts = async () => {
  try {
    loading.value = true;
    // Simulação de chamada a API:
    // const response = await api.get('/produtos');
    // allProducts.value = response.data;

    // Exemplo fictício:
    allProducts.value = produtoStore.produtos

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

// Filtrar produtos conforme o termo
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

// Emitir produto selecionado
const selectProduct = (product) => {
  try {
    if (!product || !product.idProduto) {
      throw new Error('Produto inválido');
    }
    emit('select', product);
    $q.notify({
      type: 'positive',
      message: 'Produto selecionado com sucesso!',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao selecionar produto: ' + (error.message || 'Erro desconhecido'),
    });
  }
};
</script>

<style scoped>

</style>
