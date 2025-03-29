<template>
  <q-page padding>
    <div class="row">
      <q-card class="col-12 col-sm-12">
        <q-card-section>
          <q-table
            flat
            bordered
            :columns="columns"
            :rows="clienteStore.clientes"
            :filter="filter"
          >
            <template v-slot:top>
              <q-input outlined color="primary" v-model="filter" class="col-4" :class="{'full-width': $q.screen.xs}">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-space />
              <q-btn
                color="primary"
                class="text-black"
                label="Adicionar cliente"
                @click="openDrawer('add')"
                :class="{'full-width q-mt-sm': $q.screen.xs}"/>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-xs text-center">
                <q-btn round dense color="primary text-black" size="md" @click="openDrawer('edit', props.row)" title="Adicionar um Carro">
                  <span class="material-symbols-outlined" style="font-size: 20px;">transportation</span>
                </q-btn>
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

    <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <cliente-form
          v-if="drawer"
          :is-edit="isEdit"
          :initial-data="currentData"
          @submit="handleSubmit"
          @cancel="closeDrawer"
          :marcas="marcaStore.marcas"
          :modelos="marcaStore.modelos"
        />
      </q-scroll-area>
    </q-drawer>
  </q-page>
</template>
<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useDrawer } from 'src/composables/useDrawer'

import ClienteForm from './components/ClienteForm.vue'
import { clienteService } from './services/cliente_service'
import useNotify from 'src/composables/useNotify'
import { marcaService } from '../marcas/services/marca_service'
import { useMarcaStore } from 'src/stores/marca.store'
import { useClienteStore } from 'src/stores/cliente.store'
import { useRouter } from 'vue-router'

const { drawer, openDrawer,closeDrawer, isEdit, currentData } = useDrawer()
const { carregarClientes, addCliente, adicionarVeiculo } = clienteService()
const { carregarMarcas, carregarModelosDasMarcas } = marcaService()
const { notifyError, notifyWarning, notifySuccess } = useNotify()
const clienteStore = useClienteStore()
const marcaStore = useMarcaStore()

const filter = ref('')
const router = useRouter()

const columns = [
  { label: 'CPF ou CNPJ',
    field: row => row.cpfOuCnpj,
    format: val => formatarCPF(val)
    , align: 'left'
  },
  { label: 'Nome Completo', field: row => row.nome, format: val => `${val}`, align: 'left' },
  { label: 'Tipo de Pessoa', name: 'tipo', field: row => row.tipo, format: val => `${val}`, sortable: true, align: 'left' },
  { label: 'Contatos', name: 'perfil', field: row => row.contatos, format: val => `${val}`, sortable: true, align: 'left' },
  { label: 'Total de Veículos', name: 'totalVeiculos', field: row => row.veiculos.length, align: 'center'},
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      const response = await adicionarVeiculo(formData)

      if(response.status === 204) {
        notifySuccess('Veiculo adicionado com sucesso!')
      }
    } else {
      const response = await addCliente(formData)

      if(response.status === 201) {
        notifySuccess('Cliente vinculado com os estabelecimento com sucesso!')
      }
    }
    await carregarClientes()
    await nextTick()
    closeDrawer()
  } catch (error) {

    if(error.response.data.status === 400) {
      notifyWarning(error.response.data.mensagem);
    } else {
      notifyError('Erro ao salvar cliente: ' + (error.message || 'Erro desconhecido'))
    }

    await carregarClientes()
    await nextTick()
    closeDrawer()
  }
}

const visualizarCliente = (cliente) => {
  router.push({name: 'clienteDetails', params: { id: cliente.idCliente }})
}

const formatarCPF = (cpf) => {
  if (!cpf) return ''; // Retorna vazio se o CPF for null ou undefined
  const apenasNumeros = cpf.replace(/\D/g, ''); // Remove tudo que não for número
  if (apenasNumeros.length !== 11) return cpf; // Retorna sem formatação se não tiver 11 dígitos

  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

onMounted(async () => {
  await carregarClientes()
  await carregarMarcas()
  await carregarModelosDasMarcas()
})
</script>
