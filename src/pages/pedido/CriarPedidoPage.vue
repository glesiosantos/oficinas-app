<template>
  <q-page padding style="min-height: 100vh;">
    <q-card flat bordered class="order-card flex-grow">
      <!-- Cabeçalho -->
      <q-card-section class="bg-accent text-white q-py-sm">
        <div class="text-h6">Gerar Pedido/Orçamento</div>
      </q-card-section>

      <!-- 1. Identificação do Cliente -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Cliente</div>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-6">
            <q-input v-model="form.nomeCliente" label="Nome do Cliente" outlined dense readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="form.cpfCnpjCliente" label="CPF ou CNPJ" outlined dense readonly/>
          </div>
        </div>
        <div class="col-12 q-mt-md">
          <q-btn color="accent" label="Buscar Cliente" class="full-width" dense @click="openClientDrawer" />
        </div>
      </q-card-section>

      <!-- 2. Identificação do Veículo -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Veículo</div>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-4">
            <q-input v-model="form.veiculo.placa" label="Placa" outlined dense readonly />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.veiculo.marca" label="Marca" outlined dense readonly />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.veiculo.modelo" label="Modelo" outlined dense readonly />
          </div>
        </div>
        <div class="col-12 q-mt-md">
          <q-btn color="accent" label="Buscar Veículo" class="full-width" dense @click="openVeiculoDrawer" />
        </div>
      </q-card-section>

      <!-- 3. Observações Gerais -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Observações Gerais</div>
        <q-input
          v-model="form.observacoes"
          type="textarea"
          outlined
          dense
          placeholder="Digite observações sobre o pedido/orçamento"
        />
      </q-card-section>

      <!-- 4. Produtos Selecionados -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Produtos Selecionados</div>
        <q-table
          :rows="form.produtos"
          :columns="productColumns"
          flat
          bordered
          dense
          row-key="idProduto"
        >
          <template v-slot:body-cell-quantity="props">
            <div class="flex items-center justify-center gap-2">
              <q-btn
                dense
                flat
                round
                icon="remove"
                color="primary"
                @click="decreaseQuantity(props.row)"
              />
              <div>{{ props.row.quantidade }}</div>
              <q-btn
                dense
                flat
                round
                icon="add"
                color="primary"
                @click="increaseQuantity(props.row)"
              />
            </div>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn icon="delete" color="negative" dense flat @click="removeProduct(props.row.idProduto)" />
            </q-td>
          </template>
        </q-table>
        <div class="col-12 q-mt-md">
          <q-btn color="accent" label="Buscar Produto" class="full-width" dense @click="openProductDrawer" />
        </div>
      </q-card-section>

      <!-- 5. Serviços Selecionados -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Serviços Selecionados</div>
        <q-table
          :rows="form.servicos"
          :columns="serviceColumns"
          flat
          bordered
          dense
          row-key="idServico"
        >
          <template v-slot:body-cell-actions="props">
            <q-td align="center">
              <q-btn icon="delete" color="negative" dense flat @click="removeService(props.row.idServico)" />
            </q-td>
          </template>
        </q-table>
        <div class="col-12 q-mt-md">
          <q-btn color="accent" label="Buscar Serviço" class="full-width" dense @click="openServiceDrawer" />
        </div>
      </q-card-section>

      <!-- 6. Dados do Pedido -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Dados do Pedido</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="form.desconto"
              label="Desconto (%)"
              type="number"
              outlined
              dense
              suffix="%"
              :rules="[val => val >= 0 && val <= 100 || 'Desconto inválido']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.formaPagamento"
              :options="metodoPagamento"
              label="Forma de Pagamento"
              option-label="descricao"
              option-value="sigla"
              map-options
              emit-value
              outlined
              dense
              @update:model-value="handlePaymentMethodChange"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.responsavel" label="Responsável" outlined dense disable />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="form.tipoProposta"
              :options="tipoProposta"
              label="Tipo de Proposta"
              option-label="descricao"
              option-value="sigla"
              map-options
              emit-value
              outlined
              dense
              @update:model-value="handleTipoPropostaChange"
            />
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="form.statusPedido"
              :options="filteredStatusProposta"
              label="Situação do pedido"
              option-value="sigla"
              option-label="descricao"
              outlined
              map-options
              emit-value
              dense
            />
          </div>
        </div>

        <!-- Campos condicionalmente exibidos -->
        <div v-if="form.formaPagamento === 'CC'" class="q-mt-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.valorEntrada"
                label="Valor de Entrada"
                type="number"
                outlined
                dense
                :rules="[val => val >= 0 && val <= total || 'Valor de entrada deve ser menor ou igual ao total']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.parcelas"
                label="Quantidade de Parcelas"
                type="number"
                outlined
                dense
                :rules="[val => val >= 1 || 'Quantidade de parcelas inválida']"
              />
            </div>
          </div>
        </div>

        <div v-if="form.tipoProposta === 'O'" class="q-mt-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model.number="form.diasValidade"
                label="Dias de Validade"
                type="number"
                outlined
                dense
                :rules="[val => val >= 1 || 'Número de dias inválido']"
              />
            </div>
          </div>
        </div>

        <!-- Resumo da negociação -->
        <div class="q-mt-md text-h6">
          <div><strong>Subtotal: </strong>{{ formatToBRL(subtotal) }}</div>
          <div><strong>Desconto: </strong>{{ formatToBRL(discountAmount) }}</div>
          <div><strong>Total: </strong>{{ formatToBRL(total) }}</div>
          <div v-if="form.formaPagamento === 'CC' && form.parcelas > 0">
            <strong>Valor de Entrada: </strong>{{ formatToBRL(form.valorEntrada) }}<br />
            <strong>Parcelas ({{ form.parcelas }}x): </strong>
            <div v-for="i in form.parcelas" :key="i">
              {{ i }}ª parcela: {{ formatToBRL(installmentAmount) }}
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Botões -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn label="Cancelar" color="negative" flat @click="resetForm" />
        <q-btn label="Gerar Pedido" color="accent" @click="submitOrder" />
        <!-- <q-btn
          label="Compartilhar no WhatsApp"
          color="green"
          icon="share"
          :to="whatsappLink"
          target="_blank"
        /> -->
      </q-card-actions>
    </q-card>

    <!-- Drawers -->
    <q-drawer v-model="clientDrawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <buscar-cliente-pedido v-if="clientDrawer" @submit="handleClientSubmit" @cancel="closeClientDrawer" />
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="productDrawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <buscar-produto v-if="productDrawer" @select="addProduct" @cancel="closeProductDrawer" />
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="serviceDrawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <buscar-servico v-if="serviceDrawer" @select="addService" @cancel="closeServiceDrawer" />
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="veiculoDrawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <buscar-veiculo v-if="veiculoDrawer" @submit="handleVeiculoSubmit" @cancel="closeVeiculoDrawer" />
      </q-scroll-area>
    </q-drawer>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import BuscarClientePedido from './components/BuscarClientePedido.vue'
import BuscarProduto from './components/BuscarProdutoPedido.vue'
import BuscarServico from './components/BuscarServicoPedido.vue'
import BuscarVeiculo from './components/BuscaVeiculoPedido.vue'
import { useAuthStore } from 'src/stores/auth.store'
import useCurrency from 'src/composables/useCurrency'
import { usePedidoStore } from 'src/stores/pedido.store'
import { pedidoService } from './services/pedido_service'

const $q = useQuasar();
const { carregarStatusProposta } = pedidoService();
const { formatToBRL } = useCurrency();

const { registrarOrdemEstabelecimento } = pedidoService()
const authStore = useAuthStore();
const pedidoStore = usePedidoStore();

// Estado do formulário
const form = ref({
  idEstabelecimento: '',
  valorEntrada: 0,
  parcelas: 0,
  diasValidade: 0,
  desconto: 0,
  formaPagamento: '',
  tipoProposta: '',
  statusPedido: '',
  idCliente: '',
  nomeCliente: '',
  cpfCnpjCliente: '',
  veiculo: {
    idVeiculo: null,
    placa: '',
    marca: '',
    modelo: '',
    ano: 0
  },
  observacoes: '',
  produtos: [],
  servicos: [],
  cpfResponsavel: '',
  responsavel: ''
});

// Estado dos drawers
const clientDrawer = ref(false);
const productDrawer = ref(false);
const serviceDrawer = ref(false);
const veiculoDrawer = ref(false);

// Colunas para tabelas
const productColumns = [
  { name: 'description', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'quantity', label: 'Quantidade', field: 'quantidade', align: 'center' },
  { name: 'unitPrice', label: 'Preço Unitário', field: row => formatToBRL(row.precoUnitario), align: 'center' },
  { name: 'total', label: 'Total', field: row => formatToBRL(row.quantidade * row.precoUnitario), align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
];

const serviceColumns = [
  { name: 'description', label: 'Descrição', field: 'descricao', align: 'left' },
  { name: 'price', label: 'Preço', field: row => formatToBRL(row.valorServico), align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'right' },
];

// Opções de formas de pagamento
const metodoPagamento = [
  { sigla: 'DI', descricao: 'Dinheiro' },
  { sigla: 'CC', descricao: 'Cartão de Crédito' },
  { sigla: 'CD', descricao: 'Cartão de Débito' },
  { sigla: 'PX', descricao: 'Pix' },
];

const tipoProposta = [
  { sigla: 'O', descricao: 'Orçamento' },
  { sigla: 'P', descricao: 'Pedido' },
];

// Filtro dinâmico para statusProposta baseado no tipoProposta
const filteredStatusProposta = computed(() => {
  const tipo = form.value.tipoProposta;
  if (!tipo) return [];
  return pedidoStore.statusProposta.filter(status => status.para === tipo);
});

// Cálculo do subtotal
const subtotal = computed(() => {
  const produtosTotal = form.value.produtos.reduce(
    (sum, product) => sum + product.quantidade * product.precoUnitario,
    0
  );
  const servicosTotal = form.value.servicos.reduce(
    (sum, service) => sum + service.valorServico,
    0
  );
  return produtosTotal + servicosTotal;
});

// Cálculo do desconto
const discountAmount = computed(() => {
  const desconto = form.value.desconto || 0;
  return (desconto / 100) * subtotal.value;
});

// Cálculo do total
const total = computed(() => {
  return subtotal.value - discountAmount.value;
});

// Cálculo do valor das parcelas
const installmentAmount = computed(() => {
  if (form.value.formaPagamento !== 'CC' || !form.value.parcelas) return 0;
  const valorEntrada = form.value.valorEntrada || 0;
  const remainingAmount = total.value - valorEntrada;
  return remainingAmount > 0 ? remainingAmount / form.value.parcelas : 0;
});

// Funções para manipulação de quantidade
const increaseQuantity = (product) => {
  product.quantidade += 1;
};

const decreaseQuantity = (product) => {
  if (product.quantidade > 1) {
    product.quantidade -= 1
  }
};

// Manipulador para mudança no tipo de proposta
const handleTipoPropostaChange = () => {
  // Reseta o status do pedido ao mudar o tipo de proposta
  form.value.statusPedido = ''
};

// Manipulador para mudança na forma de pagamento
const handlePaymentMethodChange = () => {
  if (form.value.formaPagamento !== 'CC') {
    form.value.valorEntrada = 0
    form.value.parcelas = 0
  }
};

// Carregar dados do estabelecimento
onMounted(async () => {
  try {
    form.value.idEstabelecimento = authStore.auth.estabelecimento.idEstabelecimento
    form.value.responsavel = authStore.auth.nome
    form.value.cpfResponsavel = authStore.auth.cpf
    await carregarStatusProposta();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados do estabelecimento: ' + error.message,
    })
  }
})

// Funções para manipulação de drawers
const openClientDrawer = () => {
  clientDrawer.value = true
};

const closeClientDrawer = () => {
  clientDrawer.value = false
};

const openProductDrawer = () => {
  productDrawer.value = true
};

const closeProductDrawer = () => {
  productDrawer.value = false
};

const openServiceDrawer = () => {
  serviceDrawer.value = true
};

const closeServiceDrawer = () => {
  serviceDrawer.value = false
};

const openVeiculoDrawer = () => {
  veiculoDrawer.value = true
};

const closeVeiculoDrawer = () => {
  veiculoDrawer.value = false
};

// Funções para manipulação de cliente
const handleClientSubmit = (clientData) => {
  form.value.nomeCliente = clientData.nome
  form.value.cpfCnpjCliente = clientData.cpfOuCnpj
  form.value.idCliente = clientData.idCliente
  closeClientDrawer()
};

// Funções para manipulação de veículo
const handleVeiculoSubmit = (vehicleData) => {
  form.value.veiculo = {
    idVeiculo: vehicleData.idVeiculo,
    placa: vehicleData.placa,
    marca: vehicleData.marca,
    modelo: vehicleData.modelo,
    ano: vehicleData.ano
  };
  closeVeiculoDrawer()
};

// Funções para manipulação de produtos
const addProduct = (product) => {
  form.value.produtos.push({
    idProduto: product.idProduto || null,
    descricao: product.descricao,
    quantidade: 1,
    precoUnitario: product.precoVenda,
  });
  closeProductDrawer()
};

const removeProduct = (id) => {
  form.value.produtos = form.value.produtos.filter(product => product.idProduto !== id)
  $q.notify({
    type: 'positive',
    message: 'Produto removido com sucesso!',
  })
};

// Funções para manipulação de serviços
const addService = (service) => {
  form.value.servicos.push({
    idServico: service.idServico || null,
    descricao: service.descricao,
    valorServico: service.valor,
  });
  closeServiceDrawer()
};

const removeService = (id) => {
  form.value.servicos = form.value.servicos.filter(service => service.idServico !== id)
  $q.notify({
    type: 'positive',
    message: 'Serviço removido com sucesso!',
  });
};

// Funções de ação do formulário
const resetForm = () => {
  form.value = {
    idEstabelecimento: form.value.idEstabelecimento,
    valorEntrada: 0,
    parcelas: 0,
    diasValidade: 0,
    numero: '',
    desconto: 0,
    formaPagamento: '',
    responsavel: form.value.responsavel,
    cpfResponsavel: form.value.cpfResponsavel,
    tipoProposta: '',
    statusPedido: '',
    idCliente: '',
    nomeCliente: '',
    cpfCnpjCliente: '',
    veiculo: { idVeiculo: null, placa: '', marca: '', modelo: '', ano: 0 },
    observacoes: '',
    produtos: [],
    servicos: [],
  };
};

const submitOrder = async () => {

  if (
    !form.value.idEstabelecimento ||
    !form.value.idCliente ||
    !form.value.veiculo.placa ||
    !form.value.formaPagamento ||
    !form.value.cpfResponsavel ||
    !form.value.tipoProposta ||
    !form.value.statusPedido
  ) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, preencha todos os campos obrigatórios, incluindo cliente, veículo, tipo de proposta e situação do pedido.',
    });
    return;
  }

  if (form.value.formaPagamento === 'CC') {
    if (form.value.valorEntrada > total.value) {
      $q.notify({
        type: 'negative',
        message: 'O valor de entrada não pode ser maior que o total do pedido.',
      });
      return;
    }
    if (form.value.parcelas < 1) {
      $q.notify({
        type: 'negative',
        message: 'A quantidade de parcelas deve ser pelo menos 1.',
      });
      return;
    }
  }

  await registrarOrdemEstabelecimento(form.value)
  resetForm();

  // Aqui você pode adicionar a lógica para enviar o pedido para uma API
  $q.notify({
    type: 'positive',
    message: 'Pedido/Orçamento gerado com sucesso!',
  })
}

</script>

<style scoped>
.order-card {
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.q-card-section {
  padding: 16px;
}

.text-subtitle1 {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
}

.q-btn {
  text-transform: none;
}

/* Estilização da tabela de produtos */
:deep(.q-table th) {
  font-weight: 600;
  background-color: #f5f5f5;
  text-align: center !important;
}

:deep(.q-table td) {
  vertical-align: middle;
}

/* Definir larguras específicas para as colunas da tabela de produtos */
:deep(.q-tableEXIT thead tr th:nth-child(1)) {
  width: 50%; /* Descrição */
}
:deep(.q-table tbody tr td:nth-child(1)) {
  width: 50%;
}

:deep(.q-table thead tr th:nth-child(2)) {
  width: 15%; /* Quantidade */
}
:deep(.q-table tbody tr td:nth-child(2)) {
  width: 15%;
}

:deep(.q-table thead tr th:nth-child(3)) {
  width: 15%; /* Preço Unitário */
}
:deep(.q-table tbody tr td:nth-child(3)) {
  width: 15%;
}

:deep(.q-table thead tr th:nth-child(4)) {
  width: 15%; /* Total */
}
:deep(.q-table tbody tr td:nth-child(4)) {
  width: 15%;
}

:deep(.q-table thead tr th:nth-child(5)) {
  width: 5%; /* Ações */
}
:deep(.q-table tbody tr td:nth-child(5)) {
  width: 5%;
}

/* Ajustar o tamanho e centralizar o input de quantidade */
:deep(.q-table td .q-field__control) {
  text-align: center;
  width: 35px; /* Reduzir o tamanho do input */
  padding: 0;
}

:deep(.q-table td .q-field__native) {
  text-align: center;
  font-size: 12px;
  padding: 2px;
}

@media (max-width: 768px) {
  .q-card-section {
    padding: 12px;
  }

  .text-subtitle1 {
    font-size: 1rem;
  }

  .q-btn {
    padding: 8px 12px;
  }

  .order-card {
    margin: 0 8px;
  }

  /* Ajustar larguras para telas menores */
  :deep(.q-table thead tr th:nth-child(1)) {
    width: 40%;
  }
  :deep(.q-table tbody tr td:nth-child(1)) {
    width: 40%;
  }

  :deep(.q-table thead tr th:nth-child(2)) {
    width: 20%;
  }
  :deep(.q-table tbody tr td:nth-child(2)) {
    width: 20%;
  }

  :deep(.q-table thead tr th:nth-child(3)) {
    width: 20%;
  }
  :deep(.q-table tbody tr td:nth-child(3)) {
    width: 20%;
  }

  :deep(.q-table thead tr th:nth-child(4)) {
    width: 15%;
  }
  :deep(.q-table tbody tr td:nth-child(4)) {
    width: 15%;
  }

  :deep(.q-table thead tr th:nth-child(5)) {
    width: 5%;
  }
  :deep(.q-table tbody tr td:nth-child(5)) {
    width: 5%;
  }

  /* Ajustar input de quantidade para telas menores */
  :deep(.q-table td .q-field__control) {
    width: 50px;
  }
}

@media (max-width: 480px) {
  .q-card-section {
    padding: 8px;
  }

  .q-btn {
    width: 100%;
    margin-bottom: 8px;
  }

  .text-subtitle1 {
    font-size: 0.9rem;
  }
}
</style>
