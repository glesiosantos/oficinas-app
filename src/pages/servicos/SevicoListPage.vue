<template>
  <q-page padding>
    <div class="row">
      <q-card class="col-12 col-sm-12 col-lg-8">
        <q-card-section>
          <q-table
            flat
            bordered
            :columns="columns"
            :rows="servicoStore.servicos"
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
                label="Adicionar Serviço"
                @click="openDrawer('add')"
                :class="{'full-width q-mt-sm': $q.screen.xs}"/>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-xs text-center">
                <!-- <q-btn round dense color="primary" size="sm" icon="edit" @click="openDrawer('edit', props.row)" /> -->
                <q-btn round dense color="red" size="sm" icon="delete" @click="handleDelete(props.row)"/>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <servico-form
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
import { useDrawer } from 'src/composables/useDrawer'

import ServicoForm from './components/ServicoForm.vue'
import useNotify from 'src/composables/useNotify'
import useCurrency from 'src/composables/useCurrency'
import { servicoService } from './services/servico_service'
import { useServicoStore } from 'src/stores/servico.store'

const { drawer, openDrawer,closeDrawer, isEdit, currentData } = useDrawer()
const { notifyError, notifyWarning, notifySuccess } = useNotify()
const { carregarCategoriasDosServicos, carregarEspecialidades, carregarServicoDoEstabelecimento, addServicoParaEstabelecimento, deletarServicoDoEstabelecimento } = servicoService()

const filter = ref('')

const servicoStore = useServicoStore()
const { formatToBRL } = useCurrency()

const columns = [
  { label: 'Nome',
    field: row => row.descricao,
    align: 'left'
  },
  { label: 'Categoria', field: row => row.categoria, align: 'left' },
  { label: 'Tipo de Veículo', field: row => row.tipo, align: 'left' },
  { label: 'Valor', field: row => formatToBRL(row.valor), format: val => `${val}`, align: 'left' },
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]

const handleDelete = async (data) => {
  const response = await deletarServicoDoEstabelecimento(data)

  if(response.status === 204) {
    notifySuccess('Serviço removido com sucesso!')
  }

  await carregarServicoDoEstabelecimento()
}

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      console.log(formData)
    } else {
      const response = await addServicoParaEstabelecimento(formData)

      if(response.status === 201) {
        notifySuccess('Serviço cadastrado com sucesso!')
      }
    }
    await carregarServicoDoEstabelecimento()
    await nextTick()
    closeDrawer()
  } catch (error) {

   if(error.status === 400) {
      console.log('response ', error)
      error.response.data.forEach(e => notifyWarning(e.mensagem));
    } else {
      notifyError('Erro ao salvar colaborador: ' + (error.message || 'Erro desconhecido'))
    }

    await nextTick()
    closeDrawer()
  }
}


onMounted(async () => {
  await carregarCategoriasDosServicos()
  await carregarEspecialidades()
  await carregarServicoDoEstabelecimento()
})
</script>
