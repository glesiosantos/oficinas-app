<template>
  <q-page padding style="min-height: 100vh;">
    <q-card flat bordered class="list-card flex-grow">
      <!-- Cabeçalho -->
      <q-card-section class="bg-accent text-white q-py-sm">
        <div class="text-h6">Serviços do estabelecimento</div>
      </q-card-section>

      <div class="row">
        <q-card class="col-12">
          <q-card-section>
            <q-table
              flat
              bordered
              :columns="columns"
              :rows="servicoStore.servicos"
              :filter="filter"
              :pagination="{rowsPerPage: 10}"
            >
              <template v-slot:top>
                <q-input outlined color="primary" v-model="filter" class="col-12" :class="{'full-width': $q.screen.xs}">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-xs text-center">
                  <q-btn round dense color="accent" size="sm" icon="edit" @click="openDrawer('edit', props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
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

    <q-page-sticky :position="stickyPosition" :offset="[18, 18]">
        <div :class="layoutClass">
          <q-btn fab icon="add" color="accent" @click="openDrawer('add')" />
        </div>
    </q-page-sticky>
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
import { useQuasar } from 'quasar'

const { drawer, openDrawer,closeDrawer, isEdit, currentData } = useDrawer()
const { notifyError, notifyWarning, notifySuccess } = useNotify()
const { carregarCategoriasDosServicos,
   carregarEspecialidades, carregarServicoDoEstabelecimento, addServicoParaEstabelecimento,
   editarServicoDoEstabelecimento
  } = servicoService()

const filter = ref('')
const $q = useQuasar()

const servicoStore = useServicoStore()
const { formatToBRL } = useCurrency()

const columns = [
  { label: 'Código',
    field: row => row.idServico,
    align: 'left'
  },
    { label: 'Nome',
    field: row => row.descricao,
    align: 'left'
  },
  { label: 'Valor', field: row => formatToBRL(row.valor), format: val => `${val}`, align: 'left' },
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      const response = await editarServicoDoEstabelecimento(formData)
      if(response.status === 204) {
        notifySuccess('Serviço cadastrado com sucesso!')
      }
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
