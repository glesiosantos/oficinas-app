<template>
  <q-page padding>
    <div class="row">
      <q-card class="col-12 col-sm-12 col-lg-8">
        <q-card-section>
          <q-table
            flat
            bordered
            :columns="columns"
            :rows="fornecedorStore.fornecedores"
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
                {{ props.row.contatos && props.row.contatos.length ? props.row.contatos.join(', ') : 'Sem contatos' }}
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-xs text-center">
                <q-btn round dense color="primary" size="sm" @click="openDrawer('edit', props.row)" icon="edit" />
                <q-btn round dense color="red" size="sm" icon="delete" @click="removerFornecedor(props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <fornecedor-form
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
import { onMounted, ref, nextTick } from 'vue'
import { useDrawer } from '../../composables/useDrawer'
import FornecedorForm from './components/FornecedorForm.vue'
import useNotify from 'src/composables/useNotify'
import { fornecedorService } from './services/fornecedor_service'
import { useFornecedorStore } from 'src/stores/fornecedor.store'

const filter = ref('')
const { notifySuccess, notifyError } = useNotify()
const fornecedorStore = useFornecedorStore()
const { drawer, isEdit, currentData, openDrawer, closeDrawer } = useDrawer()
const { addFornecedor, carregarFornecedores, editarFornecedor, excluirFornecedor } = fornecedorService()

const columns = [
  { label: 'Nome do Fornecedor', field: row => row.nomeFornecedor, format: val => `${val}`, align: 'left' },
  { label: 'Contatos', name: 'contatos', field: row => row.contatos, format: val => `${val}`, sortable: true, align: 'left' },
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      await editarFornecedor(formData)
      await carregarFornecedores()
      notifySuccess('Fornecedor atualizado com sucesso!')
    } else {
      await addFornecedor(formData)
      await carregarFornecedores()
      notifySuccess('Fornecedor adicionado com sucesso!')
    }
    await nextTick() // Aguarda o próximo ciclo de renderização
    closeDrawer()
  } catch (error) {
    console.error('Erro ao processar fornecedor:', error)
    notifyError('Erro ao salvar fornecedor: ' + (error.message || 'Erro desconhecido'))
    await nextTick()
    closeDrawer()
  }
}

const removerFornecedor = async (id) => {
  try {
    await excluirFornecedor(id)
    await carregarFornecedores()
    notifySuccess('Fornecedor removido com sucesso!')
  } catch (error) {
    console.error('Erro ao remover fornecedor:', error)
    notifyError('Erro ao remover fornecedor: ' + (error.message || 'Erro desconhecido'))
  }
}

onMounted(async () => {
  try {
    await carregarFornecedores()
  } catch (error) {
    notifyError('Erro ao carregar fornecedores: ' + (error.message || 'Erro desconhecido'))
  }
})
</script>
