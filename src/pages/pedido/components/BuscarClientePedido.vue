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
    <q-card-section class="flex-1">
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
        class="client-table"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="nome" :props="props">{{ props.row.nome }}</q-td>
            <q-td key="cpfOuCnpj" :props="props">{{ props.row.cpfOuCnpj }}</q-td>
            <q-td key="placa" :props="props">{{ props.row.veiculo?.placa || 'Sem placa' }}</q-td>
            <q-td key="actions" :props="props">
              <q-btn
                color="primary"
                label="Selecionar"
                dense
                @click="selectClient(props.row)"
              />
            </q-td>
          </q-tr>
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

// Colunas da tabela
const columns = [
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'cpfOuCnpj', label: 'CPF/CNPJ', field: 'cpfOuCnpj', align: 'left', sortable: true },
  { name: 'placa', label: 'Placa do Veículo', field: row => row.veiculo?.placa || 'Sem placa', align: 'left', sortable: true },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
];

// Carregar todos os clientes do Pinia ao montar o componente
onMounted(() => {
  loadAllClients();
});

// Função para carregar todos os clientes do Pinia
const loadAllClients = () => {
  try {
    loading.value = true;
    // Acessar diretamente a lista de clientes do store
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
    // Validar os dados do cliente
    if (!client || !client.idCliente || !client.nome || !client.cpfOuCnpj) {
      throw new Error('Dados do cliente inválidos ou incompletos');
    }

    // Formatar os dados do cliente
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

    // Log para depuração
    console.log('Emitting clientData:', clientData);

    // Emitir o evento
    emit('submit', clientData);

    // Notificação de sucesso
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
  max-height: 60vh;
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

  .q-btn {
    width: 100%;
    margin-bottom: 8px;
  }
}
</style>
