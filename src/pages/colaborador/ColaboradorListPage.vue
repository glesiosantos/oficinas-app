<template>
  <q-page padding>
    <div class="row">
      <q-card class="col-12 col-sm-12 col-lg-8">
        <q-card-section>
          <q-table
            flat
            bordered
            :columns="columns"
            :rows="colaboradores"
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
                <q-btn round dense color="primary" size="sm" icon="edit" v-if="!props.row.principal" />
                <q-btn round dense color="red" size="sm" icon="delete" v-if="!props.row.principal" />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        add colaborador
      </q-scroll-area>
    </q-drawer>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'
import { date } from 'quasar'
import { useDrawer } from 'src/composables/useDrawer'

const { drawer, openDrawer } = useDrawer()

const filter = ref('')

const colaboradores = ref([
  {
    id: 1,
    nomeCompleto: "Glêsio Santos da Silva",
    principal: true,
    perfil: "Proprietário",
    dtCadastro: "2025-03-12"
  },
  {
    id: 2,
    nomeCompleto: "Henrico Brito",
    principal: false,
    perfil: "Atendente",
    dtCadastro: "2025-03-12"
  }
])

const columns = [
  { label: 'Nome do Colaborador', field: row => row.nomeCompleto, format: val => `${val}`, align: 'left' },
  { label: 'Perfil', name: 'perfil', field: row => row.perfil, format: val => `${val}`, sortable: true, align: 'left' },
  { label: 'Data de Cadastro', name: 'dtCadastro', field: row => row.dtCadastro, format: (val) => date.formatDate(val, 'DD/MM/YYYY')},
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]
</script>
