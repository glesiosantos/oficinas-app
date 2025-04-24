<template>
  <q-form class="column full-height" @submit="handleSubmit">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary text-white q-py-sm">
      <div class="row items-center no-wrap">
        <div class="text-h6">Buscar ou Cadastrar Veículo</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <!-- Corpo -->
    <q-card-section class="flex-1 q-pa-md">
      <!-- Campo de Busca por Placa -->
      <q-input
        v-model="searchPlaca"
        label="Digite a Placa"
        outlined
        dense
        clearable
        class="q-mb-md"
        @update:model-value="searchVehicle"
      />

      <!-- Resultados da Busca -->
      <q-table
        v-if="searchResults.length"
        :rows="searchResults"
        :columns="columns"
        row-key="idVeiculo"
        dense
        :loading="loading"
        class="vehicle-table full-width"
        hide-header
        flat
        bordered
        grid
      >
        <template v-slot:item="props">
          <div class="q-pa-sm col-xs-12 col-sm-12 col-md-12">
            <q-card flat bordered class="vehicle-card">
              <q-card-section>
                <div class="text-subtitle2">{{ props.row.placa }}</div>
                <div class="text-caption">{{ props.row.marca }} {{ props.row.modelo }}</div>
              </q-card-section>
              <q-card-actions>
                <q-btn
                  color="primary"
                  label="Selecionar"
                  dense
                  flat
                  class="full-width"
                  @click="selectVehicle(props.row)"
                />
              </q-card-actions>
            </q-card>
          </div>
        </template>
        <template v-slot:no-data>
          <q-item>
            <q-item-section>
              <q-item-label>Nenhum veículo encontrado</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-table>

      <!-- Formulário para Novo Veículo -->
      <div v-if="!searchResults.length && searchPlaca" class="q-mt-md">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Cadastrar Novo Veículo</div>
          </q-card-section>
          <q-card-section>
            <q-input
              v-model="newVehicle.placa"
              label="Placa"
              outlined
              dense
              readonly
              class="q-mb-md"
            />
            <q-input
              v-model="newVehicle.marca"
              label="Marca"
              outlined
              dense
              class="q-mb-md"
              :rules="[val => !!val || 'Marca é obrigatória']"
            />
            <q-input
              v-model="newVehicle.modelo"
              label="Modelo"
              outlined
              dense
              class="q-mb-md"
              :rules="[val => !!val || 'Modelo é obrigatório']"
              @update:model-value="checkModelo"
            />
            <q-btn
              v-if="modeloExists === false"
              color="positive"
              label="Cadastrar Novo Modelo"
              dense
              flat
              class="q-mb-md"
              @click="createModelo"
            />
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>

    <!-- Rodapé -->
    <q-card-section class="q-pa-md text-right">
      <q-btn flat label="Cancelar" color="negative" @click="$emit('cancel')" />
      <q-btn
        v-if="!searchResults.length && searchPlaca"
        type="submit"
        color="primary"
        label="Cadastrar Veículo"
        class="q-ml-md"
      />
    </q-card-section>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import useNotify from 'src/composables/useNotify'

const { notifyError, notifySuccess } = useNotify()
// const modeloStore = useModeloStore();

const emit = defineEmits(['submit', 'cancel']);

const searchPlaca = ref('');
const searchResults = ref([]);
const loading = ref(false);
const newVehicle = ref({
  placa: '',
  marca: '',
  modelo: '',
});
const modeloExists = ref(null);

const columns = [
  { name: 'placa', label: 'Placa', field: 'placa', align: 'left', sortable: true },
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left', sortable: true },
  { name: 'modelo', label: 'Modelo', field: 'modelo', align: 'left', sortable: true },
];

// Buscar veículo por placa
const searchVehicle = async (placa) => {
  if (!placa) {
    searchResults.value = [];
    newVehicle.value = { placa: '', marca: '', modelo: '' };
    modeloExists.value = null;
    return;
  }

  try {
    loading.value = true;
    newVehicle.value.placa = placa;
    const vehicle = null //await veiculoStore.buscarPorPlaca(placa);
    if (vehicle) {
      searchResults.value = [vehicle];
      modeloExists.value = true;
    } else {
      searchResults.value = [];
      modeloExists.value = null;
    }
  } catch (error) {
    notifyError('Erro ao buscar veículo: ' + (error.message || 'Erro desconhecido'));
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

// Verificar se o modelo existe
const checkModelo = async (modelo) => {
  if (!modelo) {
    modeloExists.value = null;
    return;
  }

  try {
    const exists = null //await modeloStore.verificarModelo(modelo);
    modeloExists.value = exists;
  } catch (error) {
    notifyError('Erro ao verificar modelo: ' + (error.message || 'Erro desconhecido'));
    modeloExists.value = null;
  }
};

// Cadastrar novo modelo
const createModelo = async () => {
  try {
    // await modeloStore.cadastrarModelo(newVehicle.value.modelo);
    modeloExists.value = true;
    notifySuccess('Modelo cadastrado com sucesso!');
  } catch (error) {
    notifyError('Erro ao cadastrar modelo: ' + error.message);
  }
};

// Selecionar veículo
const selectVehicle = (vehicle) => {
  const vehicleData = {
    idVeiculo: vehicle.idVeiculo,
    placa: vehicle.placa,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
  };
  emit('submit', vehicleData);
  notifySuccess('Veículo selecionado com sucesso!');
};

// Cadastrar novo veículo
const handleSubmit = async () => {
  if (!newVehicle.value.marca || !newVehicle.value.modelo) {
    notifyError('Preencha todos os campos obrigatórios.');
    return;
  }

  if (modeloExists.value === false) {
    notifyError('O modelo precisa ser cadastrado primeiro.');
    return;
  }

  try {
    const vehicleData = {
      placa: newVehicle.value.placa,
      marca: newVehicle.value.marca,
      modelo: newVehicle.value.modelo,
    };
    const newVehicleId = null //await veiculoStore.cadastrarVeiculo(vehicleData);
    vehicleData.idVeiculo = newVehicleId
    emit('submit', vehicleData)
    notifySuccess('Veículo cadastrado com sucesso!')
  } catch (error) {
    notifyError('Erro ao cadastrar veículo: ' + error.message)
  }
};
</script>

<style scoped>
.full-height {
  height: 100%;
}

.vehicle-table {
  width: 100%;
  max-height: 60vh;
}

.vehicle-card {
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

  .vehicle-card {
    font-size: 12px;
  }

  .full-width {
    width: 100% !important;
  }
}
</style>
