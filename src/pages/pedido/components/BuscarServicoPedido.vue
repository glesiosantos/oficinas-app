<template>
  <q-form class="column full-height">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary q-py-sm">
      <div class="row items-center no-wrap">
        <div class="text-h6">Buscar Serviço</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <!-- Corpo -->
    <q-card-section class="flex-1 q-pa-md">
      <!-- Campo de Busca -->
      <q-input
        v-model="searchTerm"
        label="Buscar por Nome ou Categoria"
        outlined
        dense
        clearable
        class="q-mb-md"
        @update:model-value="filterServices"
        debounce="300"
      />

      <!-- Tabela de Serviços -->
      <q-table
        :rows="filteredServices"
        :columns="columns"
        row-key="idServico"
        dense
        :loading="loading"
        :rows-per-page-options="[10, 20, 50]"
        class="service-table full-width"
        hide-header
        flat
        bordered
        grid
      >
        <template v-slot:item="props">
          <div class="q-pa-sm col-xs-12 col-sm-12 col-md-12">
            <q-card flat bordered class="service-card">
              <q-card-section>
                <div class="text-subtitle2">{{ props.row.descricao }}</div>
                <div class="text-caption">Categoria: {{ props.row.categoria }}</div>
                <div class="text-caption">Para: {{ props.row.servicoPara }}</div>
                <div class="text-caption">Preço: R$ {{ props.row.valor.toFixed(2) }}</div>
              </q-card-section>
              <q-card-actions>
                <q-btn
                  color="accent"
                  label="Selecionar"
                  dense
                  flat
                  class="full-width"
                  @click="selectService(props.row)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </template>
        <template v-slot:no-data>
          <q-item>
            <q-item-section>
              <q-item-label>Nenhum serviço encontrado</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-table>
    </q-card-section>

    <div class="fixed-bottom q-pa-sm bg-white" style="border-top: 1px solid #ccc;">
      <q-btn flat label="Cancelar" color="negative" class="full-width" @click="$emit('cancel')" />
    </div>
  </q-form>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useServicoStore } from 'src/stores/servico.store'

const servicoStore = useServicoStore()

const $q = useQuasar();
const emit = defineEmits(['select', 'cancel']);

const searchTerm = ref('');
const allServices = ref([]);
const filteredServices = ref([]);
const loading = ref(false);

// Colunas (não aparecem no grid, mas são necessárias para o QTable)
const columns = [
  { name: 'descricao', label: 'Descrição do Serviço', field: 'descricao', align: 'left' },
  { name: 'categoria', label: 'Categoria', field: 'categoria', align: 'left' },
  { name: 'servicoPara', label: 'Para', field: 'servicoPara', align: 'left' },
  { name: 'valor', label: 'Preço', field: 'valor', align: 'right' },
]

onMounted(() => {
  loadAllServices();
});

// Carregar todos os serviços
const loadAllServices = async () => {
  try {
    loading.value = true;
    // Simulação de chamada a API:
    // const response = await api.get('/servicos');
    // allServices.value = response.data;

    // Exemplo fictício:
    allServices.value = servicoStore.servicos

    filteredServices.value = allServices.value;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar serviços: ' + (error.message || 'Erro desconhecido'),
    });
    allServices.value = [];
    filteredServices.value = [];
  } finally {
    loading.value = false;
  }
}

// Filtrar serviços conforme o termo
const filterServices = (term) => {
  if (!term) {
    filteredServices.value = allServices.value;
    return;
  }
  const lowerTerm = term.toLowerCase();
  filteredServices.value = allServices.value.filter(service => {
    return (
      (service.descricao && service.descricao.toLowerCase().includes(lowerTerm)) ||
      (service.categoria && service.categoria.toLowerCase().includes(lowerTerm)) ||
      (service.servicoPara && service.servicoPara.toLowerCase().includes(lowerTerm))
    );
  });
};

// Emitir serviço selecionado
const selectService = (service) => {
  try {
    if (!service || !service.idServico) {
      throw new Error('Serviço inválido');
    }
    emit('select', service);
    $q.notify({
      type: 'positive',
      message: 'Serviço selecionado com sucesso!',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao selecionar serviço: ' + (error.message || 'Erro desconhecido'),
    });
  }
};
</script>

