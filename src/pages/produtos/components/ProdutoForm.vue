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
        color="accent"
        outlined
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Código é obrigatório']"
      />

      <!-- Referência -->
      <q-input
        v-model="form.referencia"
        label="Referência da Peça/Acessório"
        :style="{ textTransform: 'uppercase' }"
        outlined
        color="accent"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Referência é obrigatória']"
      />

      <!-- Descrição -->
      <q-input
        v-model="form.descricao"
        label="Descrição"
        :style="{ textTransform: 'uppercase' }"
        outlined
        color="accent"
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Descrição é obrigatória']"
      />

      <!-- Categoria -->
      <q-select
        v-model="form.categoria"
        :options="produtoStore.categoriaProdutos"
        label="Categoria"
        option-label="descricao"
        option-value="codigo"
        outlined
        emit-value
        color="accent"
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
        color="accent"
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
        color="accent"
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
        color="accent"
        disabled
        lazy-rules
        :rules="[(val) => (val !== null && val >= 0) || 'Preço de venda é inválido']"
      />

      <!-- Quantidade em Estoque -->
      <q-input
        v-model.number="form.quantidadeMinimaEstoque"
        :disable="isEdit"
        label="Quantidade Minima Estoque"
        type="number"
        outlined
        color="accent"
        lazy-rules
        :rules="[
          (val) => (val !== null && val >= 0) || 'Quantidade é obrigatória e deve ser maior ou igual a zero',
        ]"
      />

      <q-input
        v-model.number="form.quantidadeEstoque"
        label="Quantidade em Estoque Inicial"
        type="number"
        color="accent"
        outlined
        lazy-rules
        :rules="[
          (val) => (val !== null && val >= 0) || 'Quantidade é obrigatória e deve ser maior ou igual a zero',
        ]"
      />
    </q-card-section>

    <div class="fixed-bottom q-pa-sm bg-white" style="border-top: 1px solid #ccc;">
      <div class="row q-gutter-sm">
        <q-btn flat label="Cancelar" class="col" color="negative" @click="$emit('cancel')" />
        <q-btn type="submit" color="accent" class="col" label="Salvar" :disable="loading" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { debounce } from 'quasar';
import useNotify from 'src/composables/useNotify';
import { produtoService } from '../services/produto_service';
import { useProdutoStore } from 'src/stores/produto.store';

const { notifyError, notifySuccess, notifyWarning } = useNotify()
const produtoStore = useProdutoStore();
const { carregarProdutoPeloCodigoMaisEstabelecimento } = produtoService();

const props = defineProps({
  isEdit: Boolean,
  initialData: Object,
  modelos: Array,
});

defineEmits(['submit', 'cancel']);

const form = ref({
  idProduto: '',
  codigo: '',
  referencia: '',
  descricao: '',
  categoria: null,
  precoCusto: null,
  percentualLucro: null,
  precoVenda: null,
  quantidadeMinimaEstoque: 0,
  quantidadeEstoque: 0,
  modelos: [],
});

const loading = ref(false);
const lastFetchedCodigo = ref('');

const calcularPrecoVenda = () => {
  const custo = form.value.precoCusto || 0;
  const percentual = form.value.percentualLucro || 0;
  const precoVenda = custo * (1 + percentual / 100);
  form.value.precoVenda = Number(precoVenda.toFixed(2));
}

watch(() => form.value.precoCusto, calcularPrecoVenda);
watch(() => form.value.percentualLucro, calcularPrecoVenda);

const fetchPecaData = debounce(async (codigo) => {
  if (!codigo || loading.value || props.isEdit || lastFetchedCodigo.value === codigo) return;
  try {
    loading.value = true;
    const response = await carregarProdutoPeloCodigoMaisEstabelecimento(codigo);
    if (response.status === 200) {
      populateForm(response.data);
      lastFetchedCodigo.value = codigo;
      notifySuccess('Peça encontrada e dados preenchidos!');
    }
  } catch (error) {
    if (error.response?.status === 400) {
      lastFetchedCodigo.value = codigo;
      notifyWarning('Peça não encontrada, preencha os dados para cadastrar.');
    } else {
      notifyError('Erro ao buscar peça: ' + (error.message || 'Erro desconhecido'));
    }
  } finally {
    loading.value = false;
  }
}, 500);

function populateForm(data) {
  // Mapear a descrição da categoria para o código correspondente
  const categoriaSelecionada = produtoStore.categoriaProdutos.find(
    (cat) => cat.descricao === data.categoria || cat.codigo === data.categoria
  );

  if (!categoriaSelecionada && data.categoria) {
    notifyWarning(`Categoria "${data.categoria}" não encontrada nas opções disponíveis.`);
  }

  const newFormData = {
    idProduto: data.idProduto || null,
    codigo: data.codigoProduto || lastFetchedCodigo.value,
    referencia: data.referencia || '',
    descricao: data.descricao || '',
    categoria: categoriaSelecionada ? categoriaSelecionada.codigo : null, // Armazena o código (ex.: "SU")
    precoCusto: data.valorCusto || null,
    percentualLucro: data.percentualLucro || null,
    precoVenda: data.precoVenda || null,
    quantidadeMinimaEstoque: data.quantidadeMinimaEstoque || 0,
    quantidadeEstoque: data.quantidadeEstoque || 0,
    modelos:
      data.modelos && Array.isArray(data.modelos) && data.modelos.length > 0
        ? data.modelos
            .map((c) => c.modelo)
            .filter((modelo) => modelo != null) // Filtra valores nulos ou indefinidos
        : [], // Usa array vazio como valor padrão
  };
  Object.assign(form.value, newFormData);
  calcularPrecoVenda();
}

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
