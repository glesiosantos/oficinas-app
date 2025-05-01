<template>
  <q-form class="column full-height" @submit.prevent="handleSubmit">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary q-py-sm">
      <div class="row items-center no-wrap">
        <div class="text-h6">Buscar ou Cadastrar Veículo</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <!-- Corpo -->
    <q-card-section class="flex-1 q-pa-md">
      <!-- Campo de Busca -->
      <q-input
        v-model="searchPlaca"
        label="Digite a Placa"
        outlined
        dense
        clearable
        class="q-mb-md"
        @input="formatPlaca"
      />

      <!-- Resultados -->
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
          <div class="q-pa-sm col-12">
            <q-card flat bordered class="vehicle-card">
              <q-card-section>
                <div class="text-subtitle2">{{ props.row.placa }}</div>
                <div class="text-caption">{{ props.row.marca }} {{ props.row.modelo }}</div>
              </q-card-section>
              <q-card-actions>
                <q-btn
                  color="accent"
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

      <div v-if="showNewVehicleForm" class="q-mt-md">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Cadastrar Novo Veículo</div>
          </q-card-section>
          <q-card-section class="q-gutter-md">
            <q-input
              v-model="newVehicle.placa"
              label="Placa"
              outlined
              dense
              readonly
            />

            <q-select
              v-model="newVehicle.marca"
              :options="marcaStore.marcas"
              label="Marca"
              outlined
              dense
              option-label="nome"
              option-value="id"
              emit-value
              map-options
              :rules="[val => !!val || 'Marca é obrigatória']"
              use-input
              fill-input
              clearable
            />

            <q-input
              v-model="newVehicle.modelo"
              label="Modelo"
              outlined
              dense
              :rules="[val => !!val || 'Modelo é obrigatório']"
              @blur="() => checkModelo(newVehicle.modelo)"
            />
            <q-btn
              v-if="modeloExists === false"
              color="positive"
              label="Cadastrar Novo Modelo"
              dense
              flat
              @click="createModelo"
            />

            <q-input
              v-model="newVehicle.ano"
              label="Ano"
              outlined
              dense
              type="number"
              :rules="[val => !!val || 'Ano é obrigatório']"
            />

            <q-input
              v-model="newVehicle.cor"
              label="Cor"
              outlined
              dense
              :rules="[val => !!val || 'Cor é obrigatória']"
            />
          </q-card-section>
        </q-card>
      </div>

    </q-card-section>

    <!-- Rodapé -->
    <q-card-section class="q-pa-md text-right">
      <q-btn flat label="Cancelar" color="negative" @click="$emit('cancel')" />
      <q-btn
        v-if="showNewVehicleForm"
        type="submit"
        color="primary"
        label="Cadastrar Veículo"
        class="q-ml-md"
      />
    </q-card-section>
  </q-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { debounce } from 'lodash';
import useNotify from 'src/composables/useNotify';
import { useVeiculoStore } from 'src/stores/veiculo.store';
import { useMarcaStore } from 'src/stores/marca.store';

const { notifyError, notifySuccess } = useNotify()
const veiculoStore = useVeiculoStore()
const marcaStore = useMarcaStore()

const emit = defineEmits(['submit', 'cancel'])

const searchPlaca = ref('')
const searchResults = ref([])
const loading = ref(false)
const showNewVehicleForm = ref(false)

const newVehicle = ref({
  placa: '',
  marca: '',
  modelo: '',
  ano: 0
});
const modeloExists = ref(null)

const columns = [
  { name: 'placa', label: 'Placa', field: 'placa', align: 'left', sortable: true },
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left', sortable: true },
  { name: 'modelo', label: 'Modelo', field: 'modelo', align: 'left', sortable: true },
];

// Deixar caixa alta e sem caracteres inválidos
const formatPlaca = () => {
  if (searchPlaca.value) {
    searchPlaca.value = searchPlaca.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
  }
};

// Buscar veículo na lista carregada
const buscarNaLista = async (placa) => {
  if (!placa || placa.length !== 7) {
    searchResults.value = [];
    showNewVehicleForm.value = false;
    newVehicle.value = { placa: '', marca: '', modelo: '' };
    modeloExists.value = null;
    return;
  }

  const placaNormalizada = placa.toUpperCase().replace(/[^A-Z0-9]/g, '');
  const todosVeiculos = veiculoStore.veiculos || [];

  const encontrados = todosVeiculos.filter(v =>
    (v.placa || '').replace(/[^A-Z0-9]/g, '').toUpperCase() === placaNormalizada
  );

  if (encontrados.length) {
    searchResults.value = encontrados;
    showNewVehicleForm.value = false;
    modeloExists.value = true;
  } else {
    searchResults.value = [];
    showNewVehicleForm.value = true;
    newVehicle.value.placa = placaNormalizada;
    modeloExists.value = null;
  }
};

// Debounced search
const debouncedBuscarNaLista = debounce(buscarNaLista, 500);

watch(searchPlaca, (novaPlaca) => {
  debouncedBuscarNaLista(novaPlaca);
});


const selectVehicle = (vehicle) => {
  const vehicleData = {
    idVeiculo: vehicle.idVeiculo,
    placa: vehicle.placa,
    marca: vehicle.marca,
    modelo: vehicle.modelo,
    ano: vehicle.ano
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

  try {
    const vehicleData = {
      placa: newVehicle.value.placa,
      marca: newVehicle.value.marca,
      modelo: newVehicle.value.modelo,
      ano: newVehicle.value.ano
    }
    emit('submit', vehicleData)
    notifySuccess('Veículo cadastrado com sucesso!');

    // Resetar
    searchPlaca.value = '';
    newVehicle.value = { placa: '', marca: '', modelo: '' };
    searchResults.value = [];
    modeloExists.value = null;
    showNewVehicleForm.value = false;
  } catch (error) {
    notifyError('Erro ao cadastrar veículo: ' + error.message);
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
@media (max-width: 600px) {
  .vehicle-card {
    font-size: 12px;
  }
}
</style>
