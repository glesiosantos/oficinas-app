<template>
  <q-page padding>
    <q-card>
      <q-card-section class="bg-accent text-white">
        <div class="text-h6">Detalhes do Produto</div>
      </q-card-section>

      <q-card-section v-if="isLoading">
        <div class="text-center text-grey">
          <q-spinner color="primary" size="3em" />
          <div>Carregando dados do produto...</div>
        </div>
      </q-card-section>

      <q-card-section v-else-if="produto">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>ID do Produto</q-item-label>
                  <q-item-label>{{ produto.idProduto }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Código</q-item-label>
                  <q-item-label>{{ produto.codigoProduto || 'N/A' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-4">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Descrição</q-item-label>
                  <q-item-label>{{ produto.descricao || 'Sem descrição' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Estoque Atual</q-item-label>
                  <q-item-label>{{ produto.quantidadeEstoque ?? 'N/A' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-4">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Referência</q-item-label>
                  <q-item-label>{{ produto.referencia || 'N/A' }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Valor de Custo</q-item-label>
                  <q-item-label>{{ produto.valorCusto ? `R$ ${produto.valorCusto.toFixed(2)}` : 'N/A' }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <q-btn
          color="primary"
          class="text-black q-mt-md"
          label="Nova Entrada"
          icon="add"
          @click="openDrawer('add')"
          :class="{'full-width q-mt-sm': $q.screen.xs}"
        />

        <!-- Drawer para o formulário de nova entrada -->
        <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
          <q-scroll-area class="fit">
            <produto-estoque-form
              v-if="drawer"
              :is-edit="isEdit"
              :initial-data="currentData"
              @submit="handleSubmit"
              @cancel="closeDrawer"
            />
          </q-scroll-area>
        </q-drawer>

        <q-separator class="q-my-md" />

        <div class="text-subtitle1 q-mb-md">Histórico de Entradas</div>
        <q-table
          flat
          bordered
          :columns="entradaColumns"
          :rows="produto.registros || []"
          row-key="id"
          :pagination="pagination"
        >
          <template v-slot:no-data>
            <div class="full-width row flex-center text-negative q-gutter-sm">
              <q-icon name="warning" />
              <span>Nenhuma entrada registrada</span>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section v-else>
        <div class="text-center text-negative">
          {{ errorMessage || 'Erro desconhecido ao carregar o produto.' }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          label="Voltar"
          @click="$router.push('/produtos')"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { produtoService } from './services/produto_service';
import ProdutoEstoqueForm from './components/ProdutoEstoqueForm.vue';
import { useDrawer } from 'src/composables/useDrawer';
import { fornecedorService } from '../fornecedor/services/fornecedor_service';

const $q = useQuasar();
const route = useRoute();
const { drawer, closeDrawer, currentData, openDrawer, isEdit } = useDrawer();
const produto = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);

const { carregarProdutoPorIdMaisEstabelecimento, adicionarEstoqueProduto } = produtoService();
const { carregarFornecedores } = fornecedorService();

const entradaColumns = [
  { name: 'data', label: 'Data', field: 'dataRegistro', align: 'left', sortable: true, format: val => new Date(val).toLocaleDateString() },
  { name: 'fornecedor', label: 'Fornecedor', field: row => row.fornecedor || 'N/A', align: 'left', sortable: true },
  { name: 'precoCusto', label: 'Preço de Custo (R$)', field: 'precoCustoAdquirido', align: 'left', sortable: true, format: val => val.toFixed(2) },
  { name: 'quantidade', label: 'Quant. Adquirida', field: 'qtdAdquirida', align: 'center', sortable: true },
  { name: 'estoqueAtual', label: 'Quant. Anterior', field: 'qtdAntes', align: 'center' },
];

const pagination = {
  rowsPerPage: 10,
  sortBy: 'data',
  descending: true,
};

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      console.log('**** ', formData)
    } else {
      await adicionarEstoqueProduto(Object.assign({}, formData, {idProduto: route.params.id}))
      produto.value = await carregarProdutoPorIdMaisEstabelecimento(route.params.id)
    }

    closeDrawer()
  } catch (error) {
    console.log(error)
    closeDrawer()
  }
}

onMounted(async () => {
  isLoading.value = true;
  try {
    produto.value = await carregarProdutoPorIdMaisEstabelecimento(route.params.id)
    await carregarFornecedores();
    if (!produto.value) {
      errorMessage.value = 'Produto não encontrado.';
    }
  } catch (error) {
    errorMessage.value = 'Erro ao carregar o produto: ' + error.message;
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar o produto: ' + error.message,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.q-list {
  margin-bottom: 16px;
}

@media (max-width: 767px) {
  .q-list {
    margin-bottom: 8px;
  }
}
</style>
