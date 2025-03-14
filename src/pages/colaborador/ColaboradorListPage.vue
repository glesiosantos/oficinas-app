<template>
  <q-page padding>
    <div class="row">
      <q-card class="col-12 col-sm-12 col-lg-8">
        <q-card-section>
          <q-table
            flat
            bordered
            :columns="columns"
            :rows="colaboradoreStore.colaboradores"
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

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-xs text-center">
                <q-btn round dense color="primary" size="sm" icon="edit" v-if="!props.row.principal" @click="openDrawer('edit', props.row)" />
                <q-btn round dense color="red" size="sm" icon="delete" v-if="!props.row.principal" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <colaborador-form
          v-if="drawer"
          :is-edit="isEdit"
          :initial-data="currentData"
          :perfils="colaboradoreStore.perfils"
          @submit="handleSubmit"
          @cancel="closeDrawer"
        />
      </q-scroll-area>
    </q-drawer>
  </q-page>
</template>
<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { date } from 'quasar'
import { useDrawer } from 'src/composables/useDrawer'

import ColaboradorForm from './components/ColaboradorForm.vue'
import { colaboradorService } from './services/colaborador_service'
import { useColaboradorStore } from 'src/stores/colaborador.store'
import useNotify from 'src/composables/useNotify'

const { drawer, openDrawer,closeDrawer, isEdit, currentData } = useDrawer()
const { carregarColaboradores, carregarPerfisDoSistema } = colaboradorService()
const colaboradoreStore = useColaboradorStore()
const { notifyError, notifySuccess } = useNotify()

const filter = ref('')

const columns = [
  { label: 'CPF',
    field: row => row.cpf,
    format: val => formatarCPF(val)
    , align: 'left'
  },
  { label: 'Nome do Colaborador', field: row => row.nomeCompleto, format: val => `${val}`, align: 'left' },
  { label: 'Perfil', name: 'perfil', field: row => row.perfil, format: val => `${val}`, sortable: true, align: 'left' },
  { label: 'Data de Cadastro', name: 'criadoEm', field: row => row.criadoEm, format: (val) => date.formatDate(val, 'DD/MM/YYYY')},
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]

const handleSubmit = async (formData) => {
  try {
    console.log('Dados enviados:', formData)
    if (isEdit.value) {
      await carregarPerfisDoSistema()
      notifySuccess('Colaborador atualizado com sucesso!')
    } else {
      await carregarPerfisDoSistema()
      notifySuccess('Colaborador adicionado com sucesso!')
    }
    await nextTick()
    closeDrawer()
  } catch (error) {
    console.error('Erro ao processar colaborador:', error)
    notifyError('Erro ao salvar colaborador: ' + (error.message || 'Erro desconhecido'))
    await nextTick()
    closeDrawer()
  }
}

const formatarCPF = (cpf) => {
  if (!cpf) return ''; // Retorna vazio se o CPF for null ou undefined
  const apenasNumeros = cpf.replace(/\D/g, ''); // Remove tudo que não for número
  if (apenasNumeros.length !== 11) return cpf; // Retorna sem formatação se não tiver 11 dígitos

  return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

onMounted(async () => {
  await carregarColaboradores()
  await carregarPerfisDoSistema()
})
</script>
