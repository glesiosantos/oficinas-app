<template>
  <q-form @submit="$emit('submit', form)" class="column">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary text-white">
      <div class="row items-center no-wrap">
        <div class="text-h6">
          {{ isEdit ? 'Adicionar Veículo' : 'Novo Cliente' }}
        </div>
        <q-space />
        <q-btn flat round dense icon="close" color="white" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <q-card-section class="flex-1">
      <!-- Tipo de Cliente -->
      <div class="q-gutter-sm q-mb-sm">
        <q-radio
          :disable="isEdit"
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
        :disable="isEdit"
        label="CPF ou CNPJ"
        outlined
        :mask="form.tipoCliente === 'PF' ? '###.###.###-##' : '##.###.###/####-##'"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || (form.tipoCliente === 'PF' ? 'CPF é obrigatório' : 'CNPJ é obrigatório'),
          (val) => (form.tipoCliente === 'PF' ? val.replace(/\D/g, '').length === 11 : val.replace(/\D/g, '').length === 14) || 'Número de dígitos inválido'
        ]"
      />

      <q-input v-if="form.tipoCliente == 'PJ'"
        v-model="form.razao"
        :disable="isEdit"
        label="Razão Social"
        :style="{ textTransform: 'uppercase' }"
        outlined
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Razão social é obrigatório']"
      />

      <q-input
        v-model="form.nome"
        :disable="isEdit"
        label="Nome Completo ou Nome Fantasia"
        :style="{ textTransform: 'uppercase' }"
        outlined
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Nome Completo é obrigatório']"
      />

      <!-- Contatos -->
      <div v-for="(contato, index) in form.contatos" :key="index">
        <q-input
          v-model="form.contatos[index]"
          :disable="isEdit"
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
      <q-btn flat label="Adicionar Contato" color="primary" icon="add" @click="addContact" class="q-my-sm" v-if="!isEdit"/>

      <!-- Veículo Único -->
      <div class="q-gutter-sm q-mb-sm">
        <q-radio
          v-for="v in tiposVeiculo"
           v-model="form.veiculo.tipoVeiculo"
          :val="v"
          :label="v"
          :key="v"
        />
      </div>
      <div class="q-mt-md">

        <q-input
          v-model="form.veiculo.cor"
          label="Cor do Veículo"
          :style="{ textTransform: 'uppercase' }"
          outlined
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Cor é obrigatória']"
        />

        <q-input
          v-model="form.veiculo.placa"
          label="Placa"
          :style="{ textTransform: 'uppercase' }"
          outlined
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Placa é obrigatória']"
        />

        <q-input
          v-model.number="form.veiculo.ano"
          label="Ano"
          outlined
          type="number"
          lazy-rules
          :rules="[
            (val) => (val && val >= 1900 && val <= new Date().getFullYear() + 1) || 'Ano inválido'
          ]"
        />
        <q-select
          v-model="form.veiculo.marca"
          :options="marcas"
          label="Selecione uma marca"
          option-label="nome"
          option-value="id"
          outlined
          emit-value
          map-options
          lazy-rules
          :rules="[(val) => !!val || 'Marca é obrigatória']"
          @update:model-value="resetModelo"
        />
        <q-select
          v-model="form.veiculo.modelo"
          :options="getModelosPorMarca(form.veiculo.marca)"
          label="Modelo"
          outlined
          option-label="modelo"
          option-value="idModelo"
          lazy-rules
          emit-value
          map-options
          :rules="[(val) => !!val || 'Modelo é obrigatório']"
          :disable="!form.veiculo.marca"
        />
      </div>
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
  marcas: {
    type: Array,
    default: () => [],
  },
  modelos: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['submit', 'cancel']);

// Tipos de cliente
const tipoCliente = ref([
  { tipo: 'PF', descricao: 'Pessoa Física' },
  { tipo: 'PJ', descricao: 'Pessoa Jurídica' },
])

// Tipos de veículo
const tiposVeiculo = ref(['Carro', 'Moto']);

// Formulário inicial
const form = ref({
  tipoCliente: '',
  idCliente: null,
  nome: '',
  cpfOuCnpj: '',
  razao: '',
  contatos: [''],
  veiculo: { tipoVeiculo: '', cor: '', placa: '', ano: null, marca: null, modelo: null },
});

function addContact() {
  form.value.contatos.push('');
}

function removeContact(index) {
  if (form.value.contatos.length > 1) {
    form.value.contatos.splice(index, 1);
  }
}

function resetModelo() {
  form.value.veiculo.modelo = null;
}

function getModelosPorMarca(marcaId) {
  if (!marcaId || !Array.isArray(props.modelos)) {
    return [];
  }
  return props.modelos.filter((modelo) => modelo.idMarca === marcaId);
}

// Watch para sincronizar nome com razão social quando for PF
watch(
  () => form.value.tipoCliente,
  (newVal) => {
    if (newVal === 'PF') {
      form.value.razao = form.value.nome; // Copia o nome para razão social
    }
  }
);

// Watch para atualizar razão social quando o nome mudar (somente para PF)
watch(
  () => form.value.nome,
  (newVal) => {
    if (form.value.tipoCliente === 'PF') {
      form.value.razao = newVal; // Sincroniza com o nome
    }
  }
);

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        tipoCliente: newData.tipoCliente || 'PF',
        idCliente: newData.idCliente || null,
        nome: newData.nome || '',
        cpfOuCnpj: newData.cpfOuCnpj || newData.cpf || '',
        razao: newData.razao || (newData.tipoCliente === 'PF' ? newData.nome : ''), // Preenche razão com nome para PF
        contatos: newData.contatos && Array.isArray(newData.contatos) ? [...newData.contatos] : [''],
        veiculo: {
          tipoVeiculo: newData.veiculo?.tipoVeiculo || '',
          placa: newData.veiculo?.placa || '',
          ano: newData.veiculo?.ano || null,
          marca: props.marcas.find((m) => m.id === newData.veiculo?.marca?.id) || null,
          modelo: props.modelos.find((m) => m.idModelo === newData.veiculo?.modelo?.idModelo) || null,
        },
      };
    } else {
      form.value = {
        tipoCliente: 'PF',
        idCliente: null,
        nome: '',
        cpfOuCnpj: '',
        razao: '',
        contatos: [''],
        veiculo: { tipoVeiculo: '', placa: '', ano: null, marca: null, modelo: null },
      };
    }
  },
  { immediate: true }
);

watch(
  () => form.value.tipoCliente,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      form.value.cpfOuCnpj = '';
      if (newVal === 'PF') {
        form.value.razao = form.value.nome; // Garante que razão social seja preenchida
      }
    }
  }
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
