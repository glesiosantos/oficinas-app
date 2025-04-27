<template>
  <q-form @submit="$emit('submit', form)" class="column">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary">
      <div class="row items-center no-wrap">
        <div class="text-h6">
          {{ isEdit ? 'Editar Cliente' : 'Novo Cliente' }}
        </div>
        <q-space />
        <q-btn flat round dense icon="close" color="black" @click="$emit('cancel')" />
      </div>
    </q-card-section>

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
        :loading="loading"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || (form.tipoCliente === 'PF' ? 'CPF é obrigatório' : 'CNPJ é obrigatório'),
          (val) => (form.tipoCliente === 'PF' ? val.replace(/\D/g, '').length === 11 : val.replace(/\D/g, '').length === 14) || 'Número de dígitos inválido'
        ]"
      />

      <q-input v-if="form.tipoCliente == 'PJ'"
        v-model="form.razao"
        label="Razão Social"
        :style="{ textTransform: 'uppercase' }"
        outlined
        lazy-rules
        :rules="[(val) => (val && val.length > 0) || 'Razão social é obrigatório']"
      />

      <q-input
        v-model="form.nome"
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
      <q-btn flat label="Adicionar Contato" color="black" icon="add" @click="addContact" class="q-my-sm"/>
    </q-card-section>

    <!-- Rodapé (botões) -->
    <q-card-section class="footer-fixed q-pa-md text-right">
      <q-btn flat label="Cancelar" color="negative" @click="$emit('cancel')" />
      <q-btn type="submit" color="primary" class="text-black" label="Salvar" :disable="loading" />
    </q-card-section>
  </q-form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { debounce } from 'quasar';
import { clienteService } from '../services/cliente_service';
import useNotify from 'src/composables/useNotify';

const { notifyError, notifyWarning, notifySuccess } = useNotify();
const { carregarClientePeloCpfOuCnpj } = clienteService();

const props = defineProps({
  isEdit: Boolean,
  initialData: Object
});

defineEmits(['submit', 'cancel']);

const tipoCliente = ref([
  { tipo: 'PF', descricao: 'Pessoa Física' },
  { tipo: 'PJ', descricao: 'Pessoa Jurídica' },
]);

const form = ref({
  tipoCliente: 'PF',
  idCliente: null,
  nome: '',
  cpfOuCnpj: '',
  razao: '',
  contatos: ['']
});

const loading = ref(false);
const lastFetchedCpfOuCnpj = ref(''); // Para rastrear o último valor buscado sem máscara

// Função para buscar dados na API com debounce
const fetchClientData = debounce(async (cpfOuCnpj) => {
  const cleanCpfOuCnpj = cpfOuCnpj.replace(/\D/g, '');
  if (!cleanCpfOuCnpj || loading.value || props.isEdit || lastFetchedCpfOuCnpj.value === cleanCpfOuCnpj) return;

  if ((form.value.tipoCliente === 'PF' && cleanCpfOuCnpj.length !== 11) ||
      (form.value.tipoCliente === 'PJ' && cleanCpfOuCnpj.length !== 14)) {
    return;
  }

  try {
    loading.value = true;
    const response = await carregarClientePeloCpfOuCnpj(cleanCpfOuCnpj);

    if (response.status === 200) {
      populateForm(response.data);
      lastFetchedCpfOuCnpj.value = cleanCpfOuCnpj; // Armazena o valor sem máscara
      notifySuccess('Cliente encontrado e dados preenchidos!');
    }
  } catch (error) {
    if (error.response?.data?.status === 400) {
      notifyWarning('Cliente não encontrado, preencha os dados para cadastrar.');
    } else {
      notifyError('Erro ao buscar cliente: ' + (error.message || 'Erro desconhecido'));
    }
  } finally {
    loading.value = false;
  }
}, 500);

function populateForm(data) {
  const newFormData = {
    tipoCliente: data.tipo === 'Pessoa Física' ? 'PF' : 'PJ',
    idCliente: data.idCliente || null,
    nome: data.nome || '',
    cpfOuCnpj: data.cpfOuCnpj || '', // Mantém o valor bruto da API
    razao: data.razao || (data.tipo === 'Pessoa Física' ? data.nome : ''),
    contatos: data.contatos && Array.isArray(data.contatos) ? [...data.contatos] : ['']
  };

  Object.assign(form.value, newFormData);
}

// Funções auxiliares
function addContact() {
  form.value.contatos.push('');
}

function removeContact(index) {
  if (form.value.contatos.length > 1) {
    form.value.contatos.splice(index, 1);
  }
}
// Watchers
watch(() => form.value.cpfOuCnpj, (newVal, oldVal) => {
  const cleanNewVal = newVal ? newVal.replace(/\D/g, '') : '';
  const cleanOldVal = oldVal ? oldVal.replace(/\D/g, '') : '';
  if (cleanNewVal && cleanNewVal !== cleanOldVal) { // Compara valores sem máscara
    fetchClientData(newVal);
  }
});

watch(() => form.value.tipoCliente, (newVal) => {
  if (newVal === 'PF') {
    form.value.razao = form.value.nome;
  }
});

watch(() => form.value.nome, (newVal) => {
  if (form.value.tipoCliente === 'PF') {
    form.value.razao = newVal;
  }
});

watch(() => props.initialData, (newData) => {
  if (newData) {
    populateForm(newData);
  }
}, { immediate: true });

watch(() => form.value.tipoCliente, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    form.value.cpfOuCnpj = '';
    if (newVal === 'PF') {
      form.value.razao = form.value.nome;
    }
  }
});
</script>

<style scoped>
.q-mb-md > * {
  margin-bottom: 16px;
}
.q-mb-md:last-child {
  margin-bottom: 0;
}
</style>
