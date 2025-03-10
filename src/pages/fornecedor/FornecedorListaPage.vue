<template>
  <q-page padding>
    <div class="row">
      <q-card class="col-12 col-md-6">
        <q-card-section>
          <q-table
              flat
              bordered
              :columns="columns"
              :rows="fornecedores"
              :filter="filter"
            >
              <template v-slot:top>
                <q-input outlined color="primary" v-model="filter" class="col-4" :class="{'full-width': $q.screen.xs}">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
                <q-space />
                <q-btn color="primary" label="Adicionar Fornecedor" @click="openDrawer('add')" :class="{'full-width q-mt-sm': $q.screen.xs}"/>
              </template>

              <template v-slot:body-cell-contatos="props">
                <q-td :props="props">
                  <!-- Exibe apenas o primeiro contato -->
                  {{ props.row.contatos[0] }}
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-xs text-center">
                  <!-- Botões de Editar e Excluir -->
                  <q-btn
                    round
                    dense
                    color="primary"
                    size="sm"
                    @click="drawer.openDrawer('edit', props.row)"
                    icon="edit"
                  />

                  <q-btn
                    round
                    dense
                    color="red"
                    size="sm"
                    icon="delete"
                  />
                </q-td>
              </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-drawer
      v-model="drawer"
      side="right"
      overlay
      elevated
      :width="400"
    >
    <q-scroll-area class="fit">
      <fornecedor-form
        :is-edit="isEdit"
        :initial-data="currentData"
        @submit="handleSubmit"
        @cancel="closeDrawer"/>
    </q-scroll-area>
  </q-drawer>

  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useDrawer } from '../../composables/useDrawer'
import FornecedorForm from './components/FornecedorForm.vue'
import useNotify from 'src/composables/useNotify'
import { fornecedorService } from './services/fornecedor_service'
import { useFornecedorStore } from 'src/stores/fornecedor.store'

const filter = ref('')
const rows = ref([])
const { notifySuccess, notifyError } = useNotify()
const {fornecedores } = useFornecedorStore()



const { drawer, isEdit, currentData, openDrawer, closeDrawer } = useDrawer()
const {addFornecedor, carregarFornecedores} = fornecedorService()

const columns = [
  {
    label: 'Nome do Fornecedor',
    field: row => row.nomeFornecedor,
    format: val => `${val}`,
    align: 'rigth'
  },
  {
    label: 'Contatos',
    name: 'contatos',
    field: row => row.contatos,
    format: val => `${val}`,
    sortable: true,
    align: 'rigth'
   },
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center'}
]

const handleSubmit = async (formData) => {
  if (isEdit.value) {
    // Editar fornecedor existente
    const index = rows.value.findIndex(row => row === currentData.value)
    if (index !== -1) {
      rows.value[index] = { ...formData }
    }
  } else {
    await addFornecedor(formData).then( response => {
      console.log('*** **** **** **** ', response.status)
      notifySuccess('Fornecedor adicionado com sucesso!')
    }).catch(error => notifyError(error.message))
  }
  closeDrawer()
}

onMounted(() => carregarFornecedores())

</script>
