<template>
  <q-form class="column full-height">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary text-white q-py-sm">
      <div class="row items-center no-wrap">
        <div class="text-h6">Buscar Cliente</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <!-- Corpo -->
    <q-card-section class="flex-1 q-pa-md">
      <!-- Campo de Busca -->
      <q-input
        v-model="searchTerm"
        label="Buscar por Nome, CPF/CNPJ ou Placa"
        outlined
        dense
        clearable
        class="q-mb-md"
        @update:model-value="filterClients"
      />

      <!-- Tabela de Clientes -->
      <q-table
        :rows="filteredClients"
        :columns="columns"
        row-key="idCliente"
        dense
        :loading="loading"
        :rows-per-page-options="[10, 20, 50]"
        class="client-table full-width"
        hide-header
        flat
        bordered
        grid
      >
        <template v-slot:item="props">
          <div class="q-pa-sm col-xs-12 col-sm-12 col-md-12">
            <q-card flat bordered class="client-card">
              <q-card-section>
                <div class="text-subtitle2">{{ props.row.nome }}</div>
                <div class="text-caption">{{ props.row.cpfOuCnpj }}</div>
              </q-card-section>
              <q-card-actions>
                <q-btn
                  color="primary"
                  label="Selecionar"
                  dense
                  flat
                  class="full-width"
                  @click="selectClient(props.row)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </template>
        <template v-slot:no-data>
          <q-item>
            <q-item-section>
              <q-item-label>Nenhum cliente encontrado</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-table>
    </q-card-section>

    <!-- Rodapé (botões) -->
    <q-card-section class="q-pa-md text-right">
      <q-btn flat label="Cancelar" color="negative" @click="$emit('cancel')" />
    </q-card-section>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useNotify from 'src/composables/useNotify';
import { useClienteStore } from 'src/stores/cliente.store';

const { notifyError, notifySuccess } = useNotify();
const clienteStore = useClienteStore();

// Definir os eventos emitidos
const emit = defineEmits(['submit', 'cancel']);

const searchTerm = ref('');
const allClients = ref([]);
const filteredClients = ref([]);
const loading = ref(false);

// Colunas da tabela (apenas para compatibilidade, mas não exibidas diretamente no modo grid)
const columns = [
  { name: 'cpfOuCnpj', label: 'CPF/CNPJ', field: 'cpfOuCnpj', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
];

// Carregar todos os clientes do Pinia ao montar o componente
onMounted(() => {
  loadAllClients();
});

// Função para carregar todos os clientes do Pinia
const loadAllClients = () => {
  try {
    loading.value = true;
    allClients.value = clienteStore.clientes || [];
    filteredClients.value = allClients.value;
    if (!allClients.value.length) {
      notifyError('Nenhum cliente encontrado no store.');
    }
  } catch (error) {
    notifyError('Erro ao carregar clientes: ' + (error.message || 'Erro desconhecido'));
    allClients.value = [];
    filteredClients.value = [];
  } finally {
    loading.value = false;
  }
};

// Função para filtrar clientes com base no termo de busca
const filterClients = (term) => {
  if (!term) {
    filteredClients.value = allClients.value;
    return;
  }

  const lowerTerm = term.toLowerCase();
  filteredClients.value = allClients.value.filter(client => {
    return (
      (client.nome && client.nome.toLowerCase().includes(lowerTerm)) ||
      (client.cpfOuCnpj && client.cpfOuCnpj.toLowerCase().includes(lowerTerm)) ||
      (client.veiculo?.placa && client.veiculo.placa.toLowerCase().includes(lowerTerm))
    );
  });
};

// Função para selecionar um cliente
const selectClient = (client) => {
  try {
    if (!client || !client.idCliente || !client.nome || !client.cpfOuCnpj) {
      throw new Error('Dados do cliente inválidos ou incompletos');
    }

    const clientData = {
      idCliente: client.idCliente,
      nome: client.nome,
      cpfOuCnpj: client.cpfOuCnpj,
      razao: client.razao || client.nome,
      tipoCliente: client.tipo === 'Pessoa Física' ? 'PF' : 'PJ',
      contatos: client.contatos && Array.isArray(client.contatos) ? [...client.contatos] : [''],
      veiculo: {
        tipoVeiculo: client.veiculo?.tipoVeiculo || '',
        cor: client.veiculo?.cor || '',
        placa: client.veiculo?.placa || '',
        ano: client.veiculo?.ano || null,
        marca: client.veiculo?.marca || null,
        modelo: client.veiculo?.modelo || null,
      },
    };

    console.log('Emitting clientData:', clientData);
    emit('submit', clientData);
    notifySuccess('Cliente selecionado com sucesso!');
  } catch (error) {
    console.error('Erro ao emitir submit:', error);
    notifyError('Erro ao selecionar cliente: ' + error.message);
  }
};
</script>

<style scoped>
.full-height {
  height: 100%;
}

.client-table {
  width: 100%;
  max-height: 60vh;
}

.client-card {
  width: 100%;
  margin-bottom: 8px;
}

.full-width {
  width: 100% !important;
}

.q-card-section {
  padding: 16px;
}

.q-mb-md {
  margin-bottom: 16px;
}

@media (max-width: 600px) {
  .q-card-section {
    padding: 12px;
  }

  .client-card {
    font-size: 12px;
  }

  .full-width {
    width: 100% !important;
  }
}
</style>
