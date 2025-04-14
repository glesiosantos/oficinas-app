<template>
  <q-form @submit="$emit('submit', form)" class="column">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary">
      <div class="row items-center no-wrap">
        <div class="text-h6">
          {{ isEdit ? 'Editar Peça/Acessório' : 'Nova Peça/Acessório' }}
        </div>
        <q-space />
        <q-btn flat round dense icon="close" color="black" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <q-card-section class="flex-1">
      <!-- Código da Peça -->
      <q-input
        v-model="form.codigo"
        label="Código da Peça/Acessório"
        outlined
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Código é obrigatório']"
      />

      <!-- Referência -->
      <q-input
        v-model="form.referencia"
        label="Referência da Peça/Acessório"
        outlined
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Referência é obrigatória']"
      />

      <!-- Descrição -->
      <q-input
        v-model="form.descricao"
        label="Descrição"
        :style="{ textTransform: 'uppercase' }"
        outlined
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Descrição é obrigatória']"
      />

      <!-- Categoria -->
      <q-select
        v-model="form.categoria"
        :options="categorias"
        label="Categoria"
        outlined
        emit-value
        map-options
        lazy-rules
        :rules="[(val) => !!val || 'Categoria é obrigatória']"
      />

      <!-- Preço de Custo -->
      <q-input
        v-model.number="form.precoCusto"
        label="Preço de Custo (R$)"
        type="number"
        outlined
        step="0.01"
        lazy-rules
        :rules="[
          (val) => (val !== null && val >= 0) || 'Preço de custo é obrigatório e deve ser maior ou igual a zero',
        ]"
      />

      <!-- Percentual de Lucro -->
      <q-input
        v-model.number="form.percentualLucro"
        label="Percentual de Lucro (%)"
        type="number"
        outlined
        step="0.1"
        lazy-rules
        :rules="[
          (val) => (val !== null && val >= 0) || 'Percentual de lucro deve ser maior ou igual a zero',
        ]"
      />

      <!-- Preço de Venda (Calculado e Desabilitado) -->
      <q-input
        v-model="form.precoVenda"
        disable
        label="Preço de Venda (R$)"
        type="number"
        outlined
        step="0.01"
        disabled
        lazy-rules
        :rules="[(val) => (val !== null && val >= 0) || 'Preço de venda é inválido']"
      />

      <!-- Quantidade em Estoque -->
      <q-input
        v-model.number="form.quantidadeEstoque"
        label="Quantidade em Estoque"
        type="number"
        outlined
        lazy-rules
        :rules="[
          (val) => (val !== null && val >= 0) || 'Quantidade é obrigatória e deve ser maior ou igual a zero',
        ]"
      />

      <!-- Fornecedor -->
      <q-select
        v-model="form.fornecedor"
        :options="fornecedorStore.fornecedores"
        label="Fornecedor"
        outlined
        option-label="nome"
        option-value="id"
        emit-value
        map-options
        lazy-rules
        :rules="[(val) => !!val || 'Fornecedor é obrigatório']"
      />

      <!-- Compatibilidade com Modelos -->
      <div class="q-mt-md">
        <div class="text-subtitle1 q-mb-sm">Compatibilidade com Modelos</div>
        <div v-for="(compatibilidade, index) in form.compatibilidades" :key="index" class="row q-mb-sm">
          <div class="col">
            <q-select
              v-model="form.compatibilidades[index].modelo"
              :options="marcaStore.modelos"
              label="Modelo"
              outlined
              option-label="modelo"
              option-value="idModelo"
              emit-value
              map-options
              lazy-rules
              :rules="[(val) => !!val || 'Modelo é obrigatório']"
            />
          </div>
          <q-btn
            v-if="index > 0"
            round
            dense
            flat
            icon="delete"
            color="negative"
            @click="removeCompatibilidade(index)"
            class="q-ml-sm"
          />
        </div>
        <q-btn
          flat
          label="Adicionar Compatibilidade"
          color="black"
          icon="add"
          @click="addCompatibilidade"
          class="q-my-sm"
        />
      </div>
    </q-card-section>

    <!-- Rodapé (botões) -->
    <q-card-section class="footer-fixed q-pa-md text-right">
      <q-btn flat label="Cancelar" color="negative" @click="$emit('cancel')" />
      <q-btn type="submit" color="primary" class="text-black" label="Salvar" :disable="loading" />
    </q-card-section>
  </q-form>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { debounce } from 'quasar';
import useNotify from 'src/composables/useNotify';
import { useMarcaStore } from 'src/stores/marca.store';
import { useFornecedorStore } from 'src/stores/fornecedor.store';
import { useProdutoStore } from 'src/stores/produto.store';

const { notifyError, notifySuccess, notifyWarning } = useNotify()
const marcaStore = useMarcaStore();
const fornecedorStore = useFornecedorStore();
const produtoStore = useProdutoStore();

const props = defineProps({
  isEdit: Boolean,
  initialData: Object,
  modelos: Array, // Lista de modelos disponíveis
});

defineEmits(['submit', 'cancel']);

const categorias = ref([
  'Motor',
  'Suspensão',
  'Freios',
  'Elétrica',
  'Acessórios',
  'Refrigeração',
  'Outros',
]);

const form = ref({
  codigo: '',
  referencia: '',
  descricao: '',
  categoria: null,
  precoCusto: null,
  percentualLucro: null,
  precoVenda: null,
  quantidadeEstoque: 0,
  fornecedor: null,
  compatibilidades: [{ modelo: null }],
});

const loading = ref(false);
const lastFetchedCodigo = ref('');

// Carregar dados iniciais
onMounted(async () => {
  await fornecedorStore.fetchFornecedores(); // Carrega fornecedores do store
  // Note: marcas não são mais necessárias, pois compatibilidade é apenas com modelos
});

// Cálculo do preço de venda
const calcularPrecoVenda = () => {
  const custo = form.value.precoCusto || 0;
  const percentual = form.value.percentualLucro || 0;
  const precoVenda = custo * (1 + percentual / 100);
  form.value.precoVenda = Number(precoVenda.toFixed(2));
};

// Watchers para atualizar o preço de venda automaticamente
watch(
  () => form.value.precoCusto,
  () => {
    calcularPrecoVenda();
  }
);

watch(
  () => form.value.percentualLucro,
  () => {
    calcularPrecoVenda();
  }
);

// Função para buscar dados na API com debounce
const fetchPecaData = debounce(async (codigo) => {
  if (!codigo || loading.value || props.isEdit || lastFetchedCodigo.value === codigo) return;

  try {
    loading.value = true;
    const response = await produtoStore.fetchProdutoByCodigo(codigo); // Ajustado para usar um método do store

    if (response.status === 200) {
      populateForm(response.data);
      lastFetchedCodigo.value = codigo;
      notifySuccess('Peça encontrada e dados preenchidos!');
    }
  } catch (error) {
    if (error.response?.data?.status === 400) {
      notifyWarning('Peça não encontrada, preencha os dados para cadastrar.');
    } else {
      notifyError('Erro ao buscar peça: ' + (error.message || 'Erro desconhecido'));
    }
  } finally {
    loading.value = false;
  }
}, 500);

// Preenche o formulário com dados
function populateForm(data) {
  const newFormData = {
    codigo: data.codigo || '',
    referencia: data.referencia || '',
    descricao: data.descricao || '',
    categoria: data.categoria || null,
    precoCusto: data.precoCusto || null,
    percentualLucro: data.percentualLucro || null,
    precoVenda: data.precoVenda || null,
    quantidadeEstoque: data.quantidadeEstoque || 0,
    fornecedor: data.fornecedor?.id || data.fornecedor || null,
    compatibilidades:
      data.compatibilidades && Array.isArray(data.compatibilidades) && data.compatibilidades.length > 0
        ? data.compatibilidades.map((c) => ({ modelo: c.modelo }))
        : [{ modelo: null }],
  };
  Object.assign(form.value, newFormData);
  calcularPrecoVenda();
}

// Funções auxiliares para compatibilidade
function addCompatibilidade() {
  form.value.compatibilidades.push({ modelo: null });
}

function removeCompatibilidade(index) {
  if (form.value.compatibilidades.length > 1) {
    form.value.compatibilidades.splice(index, 1);
  }
}

// Watchers
watch(
  () => form.value.codigo,
  (newVal, oldVal) => {
    if (newVal && newVal !== oldVal) {
      fetchPecaData(newVal);
    }
  }
);

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      populateForm(newData);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.q-mb-md > * {
  margin-bottom: 16px;
}
.q-mb-md:last-child {
  margin-bottom: 0;
}
</style>
