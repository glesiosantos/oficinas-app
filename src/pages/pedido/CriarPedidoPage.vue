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
            <q-input v-model="form.client.name" label="Nome do Cliente" outlined dense readonly />
          </div>
          <div class="col-12 col-md-6">
            <q-input v-model="form.client.cpf" label="CPF" outlined dense mask="###.###.###-##" readonly />
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
          v-model="form.observations"
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
          :rows="form.products"
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
          :rows="form.services"
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
              v-model.number="form.ordem.desconto"
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
              v-model="form.ordem.formaPagamento"
              :options="paymentMethods"
              label="Forma de Pagamento"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input v-model="form.ordem.responsavel" label="Responsável" outlined dense />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-md">
          <div class="col-12 col-md-6">
            <q-select
              v-model="form.ordem.tipoProposta"
              :options="['Orçamento', 'Pedido']"
              label="Tipo de Proposta"
              outlined
              dense
            />
          </div>
          <div class="col-12 col-md-6">
            <q-select
              v-model="form.ordem.statusPedido"
              :options="['Em Andamento', 'Concluído', 'Cancelado']"
              label="Status"
              outlined
              dense
            />
          </div>
        </div>

        <div class="q-mt-md text-right text-h4 text-weight-bold">
          Total: {{ formatToBRL(total)  }}
        </div>
      </q-card-section>

      <!-- Botões -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn label="Cancelar" color="negative" flat @click="resetForm" />
        <q-btn label="Gerar Pedido" color="accent" @click="submitOrder" />
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
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import BuscarClientePedido from './components/BuscarClientePedido.vue'
import BuscarProduto from './components/BuscarProdutoPedido.vue'
import BuscarServico from './components/BuscarServicoPedido.vue'
import BuscarVeiculo from './components/BuscaVeiculoPedido.vue'
import { useAuthStore } from 'src/stores/auth.store'
import useCurrency from 'src/composables/useCurrency';

const $q = useQuasar();
const {formatToBRL } = useCurrency()
const authStore = useAuthStore();

// Estado do formulário
const form = ref({
  idEstabelecimento: "",
  ordem: {
    numero: '',
    desconto: 0,
    formaPagamento: '',
    responsavel: '',
  },
  client: {
    name: '',
    cpf: '',
  },
  veiculo: {
    idVeiculo: null,
    placa: '',
    marca: '',
    modelo: '',
  },
  observations: '',
  products: [],
  services: [],
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
  { name: 'actions', label: 'Ações', field: 'actions', align: 'rigth' },
];

// Opções de formas de pagamento
const paymentMethods = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix'];

// Cálculo do total
const total = computed(() => {
  const productsTotal = form.value.products.reduce(
    (sum, product) => sum + product.quantidade * product.precoUnitario,
    0
  );
  const servicesTotal = form.value.services.reduce(
    (sum, service) => sum + service.valorServico,
    0
  );

  const subtotal = productsTotal + servicesTotal;

  // Calculando o desconto
  const discountAmount = (form.value.ordem.desconto / 100) * subtotal;

  return subtotal - discountAmount;
})

const increaseQuantity = (product) => {
  product.quantidade += 1;
}

const decreaseQuantity = (product) => {
  if (product.quantidade > 1) {
    product.quantidade -= 1;
  }
}
// Carregar dados do estabelecimento
onMounted(async () => {
  try {
    form.value.idEstabelecimento = authStore.auth.estabelecimento.id
    // form.value.estabelecimento.fantasia = authStore.auth.estabelecimento.nome;
    // form.value.estabelecimento.documento = authStore.auth.estabelecimento.documento;
    form.value.ordem.responsavel = authStore.auth.nome
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados do estabelecimento: ' + error.message,
    });
  }
})

// Funções para manipulação de drawers
const openClientDrawer = () => {
  clientDrawer.value = true;
};

const closeClientDrawer = () => {
  clientDrawer.value = false;
};

const openProductDrawer = () => {
  productDrawer.value = true;
};

const closeProductDrawer = () => {
  productDrawer.value = false;
};

const openServiceDrawer = () => {
  serviceDrawer.value = true;
};

const closeServiceDrawer = () => {
  serviceDrawer.value = false;
};

const openVeiculoDrawer = () => {
  veiculoDrawer.value = true;
};

const closeVeiculoDrawer = () => {
  veiculoDrawer.value = false;
};

// Funções para manipulação de cliente
const handleClientSubmit = (clientData) => {
  form.value.client.name = clientData.nome
  form.value.client.cpf = clientData.cpfOuCnpj
  closeClientDrawer()
};

// Funções para manipulação de veículo
const handleVeiculoSubmit = (vehicleData) => {
  form.value.veiculo = {
    idVeiculo: vehicleData.idVeiculo,
    placa: vehicleData.placa,
    marca: vehicleData.marca,
    modelo: vehicleData.modelo,
  }
  closeVeiculoDrawer()
};

// Funções para manipulação de produtos
const addProduct = (product) => {
  form.value.products.push({
    idProduto: product.idProduto || null,
    descricao: product.descricao,
    quantidade: 1,
    precoUnitario: product.precoVenda,
  });
  closeProductDrawer()

};

const removeProduct = (id) => {
  form.value.products = form.value.products.filter(product => product.id !== id);
  $q.notify({
    type: 'positive',
    message: 'Produto removido com sucesso!',
  });
};

// Funções para manipulação de serviços
const addService = (service) => {
  form.value.services.push({
    idServico: service.idServico || null,
    descricao: service.descricao,
    valorServico: service.valor,
  });
  closeServiceDrawer()
};

const removeService = (id) => {
  form.value.services = form.value.services.filter(service => service.id !== id);
  $q.notify({
    type: 'positive',
    message: 'Serviço removido com sucesso!',
  });
};

// Funções de ação do formulário
const resetForm = () => {
  form.value = {
    estabelecimento: {
      id: form.value.estabelecimento.id,
      fantasia: form.value.estabelecimento.fantasia,
      documento: form.value.estabelecimento.documento,
    },
    ordem: {
      numero: '',
      desconto: 0,
      formaPagamento: '',
      responsavel: form.value.ordem.responsavel,
    },
    client: { name: '', cpf: '' },
    veiculo: { idVeiculo: null, placa: '', marca: '', modelo: '' },
    observations: '',
    products: [],
    services: [],
  };
};

const submitOrder = () => {
  // Validação básica
  if (
    !form.value.estabelecimento.fantasia ||
    !form.value.client.name ||
    !form.value.veiculo.idVeiculo ||
    !form.value.ordem.formaPagamento ||
    !form.value.ordem.responsavel
  ) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, preencha todos os campos obrigatórios, incluindo cliente e veículo.',
    });
    return;
  }

  // Aqui você pode adicionar a lógica para enviar o pedido para uma API
  $q.notify({
    type: 'positive',
    message: 'Pedido/Orçamento gerado com sucesso!',
  });

  console.log('Form Data:', form.value);
  resetForm();
};
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
:deep(.q-table thead tr th:nth-child(1)) {
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
