<template>
  <q-page padding style="min-height: 100vh;">
    <q-card flat bordered class="list-card flex-grow">
      <!-- Cabeçalho -->
      <q-card-section class="bg-accent text-white q-py-sm">
        <div class="text-h6">Clientes do estabelecimento</div>
      </q-card-section>
      <div class="row">
        <q-card class="col-12 col-sm-12">
          <q-card-section>
            <q-table
              flat
              bordered
              :columns="columns"
              :rows="clienteStore.clientes"
              :filter="filter"
              :loading="loading"
            >
              <template v-slot:loading>
                <q-inner-loading showing>
                  <q-spinner size="50px" color="primary" />
                </q-inner-loading>
              </template>
              <template v-slot:top>
                <q-input outlined color="primary" v-model="filter" class="col-12" :class="{'full-width': $q.screen.xs}">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-xs text-center">
                  <q-btn v-if="props.row.cpfOuCnpj !== '00000000000'" round dense color="primary text-black" size="md" @click="openDrawer('edit', props.row)" title="Editar" icon="edit" />

                  <q-btn
                    round
                    dense
                    color="green"
                    size="md"
                    icon="visibility"
                    @click="visualizarCliente(props.row)"
                    title="Visualizar Cliente"
                  />
                </q-td>
              </template>

            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-card>

    <q-page-sticky :position="stickyPosition" :offset="[18, 18]">
        <div :class="layoutClass">
          <q-btn fab icon="person_add" title="Adicionar Clientes" color="accent" @click="openDrawer('add')" />
        </div>
    </q-page-sticky>

    <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <cliente-form
          v-if="drawer"
          :is-edit="isEdit"
          :initial-data="currentData"
          @submit="handleSubmit"
          @cancel="closeDrawer"
        />
      </q-scroll-area>
    </q-drawer>

  </q-page>
</template>

<script setup>
import { onMounted, ref} from 'vue'
import { useDrawer } from 'src/composables/useDrawer'
import ClienteForm from './components/ClienteForm.vue'
import { clienteService } from './services/cliente_service'
import useNotify from 'src/composables/useNotify'
import { useClienteStore } from 'src/stores/cliente.store'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const loading = ref(false)
const { drawer, openDrawer, closeDrawer, isEdit, currentData } = useDrawer()
const { carregarClientes, addCliente } = clienteService()
const { notifyError, notifyWarning, notifySuccess } = useNotify()
const clienteStore = useClienteStore()
const filter = ref('')
const router = useRouter()
const $q = useQuasar()

const columns = [
  {
    label: 'CPF ou CNPJ',
    field: row => row.cpfOuCnpj,
    format: val => formatarCPFouCNPJ(val),
    align: 'left'
  },
  { label: 'Nome Completo', field: row => row.nome, format: val => `${val}`, align: 'left' },
  { label: 'Tipo de Pessoa', name: 'tipo', field: row => row.tipo, format: val => `${val}`, sortable: true, align: 'left' },
  {
    label: 'Contatos',
    name: 'contatos',
    field: row => row.contatos,
    format: val => Array.isArray(val) ? val.join(', ') : val || 'Nenhum contato',
    sortable: true,
    align: 'left'
  },
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]

const formatarCPFouCNPJ = (value) => {
  if (!value) return '';
  const apenasNumeros = value.replace(/\D/g, '');
  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (apenasNumeros.length === 14) {
    return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  return value;
};

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      console.log('**** editar')
    } else {
      const response = await addCliente(formData);
      if (response.status === 201) {
        notifySuccess('Cliente cadastrado com sucesso!');
      }
    }
    await carregarClientes();
    closeDrawer();
  } catch (error) {
    const message = error.response?.data?.mensagem || error.message || 'Erro desconhecido';
    if (error.response?.status === 400) {
      notifyWarning(message);
    } else {
      notifyError('Erro ao salvar cliente: ' + message);
    }
    closeDrawer();
  }
};

const visualizarCliente = (cliente) => {
  router.push({ name: 'clienteDetails', params: { id: cliente.idCliente } });
};

onMounted(async () => {
  loading.value = true;
  try {
    await Promise.all([
      carregarClientes(),
    ]);
  } catch (error) {
    notifyError('Erro ao carregar dados: ' + (error.message || 'Erro desconhecido'));
  } finally {
    loading.value = false;
  }
});
</script>
