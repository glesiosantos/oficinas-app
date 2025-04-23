<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="order-card">
      <!-- Cabeçalho -->
      <q-card-section class="bg-primary text-white q-py-sm">
        <div class="text-h6">Gerar Pedido/Orçamento</div>
      </q-card-section>

      <!-- 1. Identificação do Estabelecimento -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Estabelecimento</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.estabelecimento.fantasia"
              label="Nome do Estabelecimento"
              outlined
              dense
              readonly
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.estabelecimento.documento"
              label="CNPJ"
              outlined
              dense
              mask="##.###.###/####-##"
              readonly
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.ordem.numero"
              label="Nº Pedido/Orçamento"
              outlined
              dense
            />
          </div>
        </div>
      </q-card-section>

      <!-- 2. Identificação do Cliente -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Cliente</div>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-5">
            <q-input
              v-model="form.client.name"
              label="Nome do Cliente"
              outlined
              dense
              readonly
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.client.cpf"
              label="CPF"
              outlined
              dense
              mask="###.###.###-##"
              readonly
            />
          </div>
          <div class="col-12 col-md-3">
            <q-btn
              color="primary"
              label="Buscar Cliente"
              class="full-width"
              dense
              @click="openClientDrawer"
            />
          </div>
        </div>
      </q-card-section>

      <!-- 3. Identificação do Veículo -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Veículo</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.vehicle.brand"
              label="Marca"
              outlined
              dense
              readonly
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.vehicle.model"
              label="Modelo"
              outlined
              dense
              readonly
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.vehicle.plate"
              label="Placa"
              outlined
              dense
              mask="AAA-####"
              readonly
            />
          </div>
        </div>
      </q-card-section>

      <!-- 4. Observações Gerais -->
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

      <!-- 5. Produtos Selecionados -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Produtos Selecionados</div>
        <q-table
          :rows="form.products"
          :columns="productColumns"
          row-key="id"
          dense
          class="q-mb-md"
        >
          <template v-slot:top>
            <q-btn
              color="primary"
              label="Buscar Produto"
              dense
              @click="openProductDrawer"
            />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>
              <q-td key="quantity" :props="props">
                <q-input
                  v-model.number="props.row.quantity"
                  type="number"
                  dense
                  borderless
                  :rules="[(val) => val > 0 || 'Quantidade deve ser maior que 0']"
                />
              </q-td>
              <q-td key="unitPrice" :props="props">
                R$ {{ props.row.unitPrice.toFixed(2) }}
              </q-td>
              <q-td key="total" :props="props">
                R$ {{ (props.row.quantity * props.row.unitPrice).toFixed(2) }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn
                  color="negative"
                  icon="delete"
                  dense
                  flat
                  @click="removeProduct(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>

      <!-- 6. Serviços Selecionados -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Serviços Selecionados</div>
        <q-table
          :rows="form.services"
          :columns="serviceColumns"
          row-key="id"
          dense
          class="q-mb-md"
        >
          <template v-slot:top>
            <q-btn
              color="primary"
              label="Buscar Serviço"
              dense
              @click="openServiceDrawer"
            />
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="description" :props="props">
                {{ props.row.description }}
              </q-td>
              <q-td key="price" :props="props">
                R$ {{ props.row.price.toFixed(2) }}
              </q-td>
              <q-td key="actions" :props="props">
                <q-btn
                  color="negative"
                  icon="delete"
                  dense
                  flat
                  @click="removeService(props.row.id)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>

      <!-- 7. Dados do Pedido -->
      <q-card-section>
        <div class="text-subtitle1 q-mb-sm">Dados do Pedido</div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model.number="form.ordem.desconto"
              label="Desconto"
              outlined
              dense
              type="number"
              prefix="R$"
              :rules="[(val) => val >= 0 || 'Desconto não pode ser negativo']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="form.ordem.formaPagamento"
              :options="paymentMethods"
              label="Forma de Pagamento"
              outlined
              dense
              :rules="[(val) => !!val || 'Forma de pagamento é obrigatória']"
            />
          </div>
          <div class="col-12 col-md-4">
            <q-input
              v-model="form.ordem.responsavel"
              label="Responsável pelo Orçamento"
              outlined
              dense
              :rules="[(val) => !!val || 'Responsável é obrigatório']"
            />
          </div>
        </div>
        <div class="q-mt-md text-weight-bold">
          Total: R$ {{ total.toFixed(2) }}
        </div>
      </q-card-section>

      <!-- Botões de Ação -->
      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          label="Cancelar"
          color="negative"
          flat
          @click="resetForm"
        />
        <q-btn
          label="Gerar Pedido"
          color="primary"
          @click="submitOrder"
        />
      </q-card-actions>
    </q-card>

    <!-- Drawer para Busca de Cliente -->
    <q-drawer v-model="clientDrawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <buscar-cliente-pedido
          v-if="clientDrawer"
          @submit="handleClientSubmit"
          @cancel="closeClientDrawer"
        />
      </q-scroll-area>
    </q-drawer>

    <!-- Drawer para Busca de Produtos -->
    <q-drawer v-model="productDrawer" side="right" overlay elevated :width="600">
      <q-scroll-area class="fit">
        <buscar-produto
          v-if="productDrawer"
          @select="addProduct"
          @cancel="closeProductDrawer"
        />
      </q-scroll-area>
    </q-drawer>

    <!-- Drawer para Busca de Serviços -->
    <q-drawer v-model="serviceDrawer" side="right" overlay elevated :width="600">
      <q-scroll-area class="fit">
        <buscar-servico
          v-if="serviceDrawer"
          @select="addService"
          @cancel="closeServiceDrawer"
        />
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
import { useAuthStore } from 'src/stores/auth.store'

const authStore = useAuthStore()

// Inicialização do Quasar
const $q = useQuasar();

// Estado do formulário
const form = ref({
  estabelecimento: {
    id: '',
    fantasia: '',
    documento: '',
  },
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
  vehicle: {
    brand: '',
    model: '',
    plate: '',
  },
  observations: '',
  products: [],
  services: [],
});

// Estado dos drawers
const clientDrawer = ref(false);
const productDrawer = ref(false);
const serviceDrawer = ref(false);

// Colunas para tabelas
const productColumns = [
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'quantity', label: 'Quantidade', field: 'quantity', align: 'center' },
  { name: 'unitPrice', label: 'Preço Unitário', field: 'unitPrice', align: 'center' },
  { name: 'total', label: 'Total', field: row => row.quantity * row.unitPrice, align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
];

const serviceColumns = [
  { name: 'description', label: 'Descrição', field: 'description', align: 'left' },
  { name: 'price', label: 'Preço', field: 'price', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
];

// Opções de formas de pagamento
const paymentMethods = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix'];

// Cálculo do total
const total = computed(() => {
  const productsTotal = form.value.products.reduce(
    (sum, product) => sum + product.quantity * product.unitPrice,
    0
  );
  const servicesTotal = form.value.services.reduce(
    (sum, service) => sum + service.price,
    0
  );
  return productsTotal + servicesTotal - (form.value.ordem.desconto || 0);
});

// Carregar dados do estabelecimento
onMounted(async () => {
  try {
    console.log('**** ',authStore.auth)
    form.value.estabelecimento.id = authStore.auth.estabelecimento.id
    form.value.estabelecimento.fantasia = authStore.auth.estabelecimento.nome;
    form.value.estabelecimento.documento = authStore.auth.estabelecimento.documento;
    form.value.ordem.responsavel = authStore.auth.nome;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados do estabelecimento.'+error,
    });
  }
});

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

// Funções para manipulação de cliente
const handleClientSubmit = (clientData) => {
  form.value.client.name = clientData.nome;
  form.value.client.cpf = clientData.cpfOuCnpj;
  form.value.vehicle.brand = clientData.veiculo?.marca || '';
  form.value.vehicle.model = clientData.veiculo?.modelo || '';
  form.value.vehicle.plate = clientData.veiculo?.placa || '';
  closeClientDrawer();
  $q.notify({
    type: 'positive',
    message: 'Cliente selecionado com sucesso!',
  });
};

// Funções para manipulação de produtos
const addProduct = (product) => {
  form.value.products.push({
    id: null,
    description: product.name,
    quantity: 1,
    unitPrice: product.price,
  });
  closeProductDrawer();
  $q.notify({
    type: 'positive',
    message: 'Produto adicionado com sucesso!',
  });
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
    id: null,
    description: service.name,
    price: service.price,
  });
  closeServiceDrawer();
  $q.notify({
    type: 'positive',
    message: 'Serviço adicionado com sucesso!',
  });
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
      name: form.value.estabelecimento.name,
      document: form.value.estabelecimento.document,
    },
    order: {
      numero: '',
      desconto: 0,
      formaPagamento: '',
      responsavel: form.value.ordem.responsavel,
    },
    client: { name: '', cpf: '' },
    vehicle: { brand: '', model: '', plate: '' },
    observations: '',
    products: [],
    services: [],
  };
};

const submitOrder = () => {
  // Validação básica
  if (
    !form.value.estabelecimento.name ||
    !form.value.client.name ||
    !form.value.ordem.formaPagamento ||
    !form.value.ordem.responsavel
  ) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, preencha todos os campos obrigatórios.',
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
