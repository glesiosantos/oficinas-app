<template>
  <q-form @submit="$emit('submit', form)" class="column">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary text-white">
      <div class="row items-center no-wrap">
        <div class="text-h6">
          {{ isEdit ? 'Editar Cliente' : 'Novo Cliente' }}
        </div>
        <q-space />
        <q-btn flat round dense icon="close" color="white" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <!-- Corpo (campos) -->
    <q-card-section class="flex-1">
      <!-- Tipo de Cliente -->
      <div class="q-gutter-sm q-mb-sm">
        <q-radio
          v-for="t in tipoCliente"
          v-model="form.tipoCliente"
          :val="t.tipo"
          :label="t.descricao"
          :key="t.tipo"
        />
      </div>

      <!-- CPF ou CNPJ -->
      <q-input
        v-model="form.cpfOuCnpj"
        label="CPF ou CNPJ"
        outlined
        :mask="form.tipoCliente === 'PF' ? '###.###.###-##' : '##.###.###/####-##'"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || (form.tipoCliente === 'PF' ? 'CPF é obrigatório' : 'CNPJ é obrigatório'),
          (val) => (form.tipoCliente === 'PF' ? val.replace(/\D/g, '').length === 11 : val.replace(/\D/g, '').length === 14) || 'Número de dígitos inválido'
        ]"
      />

      <!-- Nome do Colaborador -->
      <q-input
        v-model="form.nomeCompleto"
        label="Nome do Colaborador"
        outlined
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Nome do Colaborador é obrigatório']"
      />

      <!-- Contatos -->
      <div v-for="(contato, index) in form.contatos" :key="index">
        <q-input
          v-model="form.contatos[index]"
          mask="(##) #.####-####"
          :label="index === 0 ? 'Contato Principal' : `Contato ${index + 1}`"
          outlined
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Contato é obrigatório']"
        >
          <template v-slot:append>
            <q-btn
              v-if="index > 0"
              round
              dense
              flat
              icon="delete"
              color="negative"
              @click="removeContact(index)"
            />
          </template>
        </q-input>
      </div>
      <q-btn flat label="Adicionar Contato" color="primary" icon="add" @click="addContact" class="q-my-sm" />

      <!-- Veículos -->
      <div v-for="(veiculo, index) in form.veiculos" :key="`veiculo-${index}`" >
        <q-input
          v-model="veiculo.placa"
          label="Placa"
          outlined
          mask="AAA-#X##"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Placa é obrigatória']"
        >
          <template v-slot:append>
            <q-btn
              v-if="index > 0"
              round
              dense
              flat
              icon="delete"
              color="negative"
              @click="removeVehicle(index)"
            />
          </template>
        </q-input>
        <q-input
          v-model.number="veiculo.ano"
          label="Ano"
          outlined
          type="number"
          lazy-rules
          :rules="[
            (val) => (val && val >= 1900 && val <= new Date().getFullYear() + 1) || 'Ano inválido'
          ]"
        />
        <q-select
          v-model="veiculo.marca"
          :options="marcas"
          label="Marca"
          outlined
          lazy-rules
          :rules="[(val) => !!val || 'Marca é obrigatória']"
        />
        <q-select
          v-model="veiculo.modelo"
          :options="modelosPorMarca[veiculo.marca] || []"
          label="Modelo"
          outlined
          lazy-rules
          :rules="[(val) => !!val || 'Modelo é obrigatório']"
          :disable="!veiculo.marca"
        />
      </div>
      <q-btn
        flat
        label="Adicionar Veículo"
        color="primary"
        icon="add"
        @click="addVehicle"
        class="q-my-sm"
      />
    </q-card-section>

    <!-- Rodapé (botões) -->
    <q-card-section class="footer-fixed q-pa-md text-right">
      <q-btn flat label="Cancelar" color="negative" @click="$emit('cancel')" />
      <q-btn type="submit" color="primary" label="Salvar" />
    </q-card-section>
  </q-form>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isEdit: Boolean,
  initialData: Object,
});

defineEmits(['submit', 'cancel']);

// Tipos de cliente
const tipoCliente = ref([
  { tipo: 'PF', descricao: 'Pessoa Física' },
  { tipo: 'PJ', descricao: 'Pessoa Jurídica' },
]);

// Formulário inicial
const form = ref({
  tipoCliente: 'PF',
  idCliente: null,
  nomeCompleto: '',
  cpfOuCnpj: '',
  contatos: [''],
  veiculos: [{ placa: '', ano: null, marca: '', modelo: '' }],
});

// Lista de marcas e modelos (exemplo estático)
const marcas = ref([
  'Volkswagen',
  'Fiat',
  'Chevrolet',
  'Ford',
  'Honda',
  'Toyota',
]);

const modelosPorMarca = ref({
  Volkswagen: ['Gol', 'Polo', 'Golf', 'Tiguan'],
  Fiat: ['Palio', 'Punto', '500', 'Argo'],
  Chevrolet: ['Celta', 'Cruze', 'Onix', 'Tracker'],
  Ford: ['Fiesta', 'Focus', 'Ranger', 'EcoSport'],
  Honda: ['Civic', 'Fit', 'CR-V', 'HR-V'],
  Toyota: ['Corolla', 'Hilux', 'Yaris', 'RAV4'],
});

// Funções para contatos
function addContact() {
  form.value.contatos.push('');
}

function removeContact(index) {
  if (form.value.contatos.length > 1) {
    form.value.contatos.splice(index, 1);
  }
}

// Funções para veículos
function addVehicle() {
  form.value.veiculos.push({ placa: '', ano: null, marca: '', modelo: '' });
}

function removeVehicle(index) {
  if (form.value.veiculos.length > 1) {
    form.value.veiculos.splice(index, 1);
  }
}

// Watcher para initialData
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        tipoCliente: newData.tipoCliente || 'PF',
        idCliente: newData.idCliente || null,
        nomeCompleto: newData.nomeCompleto || '',
        cpfOuCnpj: newData.cpfOuCnpj || newData.cpf || '',
        contatos: newData.contatos && Array.isArray(newData.contatos) ? [...newData.contatos] : [''],
        veiculos:
          newData.veiculos && Array.isArray(newData.veiculos)
            ? [...newData.veiculos]
            : [{ placa: '', ano: null, marca: '', modelo: '' }],
      };
    } else {
      form.value = {
        tipoCliente: 'PF',
        idCliente: null,
        nomeCompleto: '',
        cpfOuCnpj: '',
        contatos: [''],
        veiculos: [{ placa: '', ano: null, marca: '', modelo: '' }],
      };
    }
  },
  { immediate: true }
);

// Watcher para limpar cpfOuCnpj ao mudar tipoCliente
watch(
  () => form.value.tipoCliente,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      form.value.cpfOuCnpj = '';
    }
  }
);
</script>

<style scoped>
/* Opcional: Ajustar margens entre os campos dos veículos */
.q-mb-md > * {
  margin-bottom: 16px; /* Espaçamento consistente entre os campos */
}
.q-mb-md:last-child {
  margin-bottom: 0; /* Remove margem extra no último campo */
}
</style>
