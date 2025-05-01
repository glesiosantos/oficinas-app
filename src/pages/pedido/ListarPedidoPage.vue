<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gerenciamento de Pedidos/Orçamentos</div>

    <q-card class="q-pa-md q-mb-md">
      <q-form >
        <div class="row q-col-gutter-md">
          <q-select
            v-model="filtros.status"
            :options="statusOptions"
            label="Status"
            class="col-12 col-md-4"
            outlined
            emit-value
            map-options
            clearable
          />

          <q-input
            v-model="filtros.dataInicio"
            label="Data Início"
            type="date"
            class="col-12 col-md-3"
            filled
          />

          <q-input
            v-model="filtros.dataFim"
            label="Data Fim"
            type="date"
            class="col-12 col-md-3"
            filled
          />

          <div class="col-12 col-md-2 flex items-end">
            <q-btn label="Filtrar" type="submit" color="accent" size="md" class="full-width" />
          </div>
        </div>
      </q-form>
    </q-card>
    <!-- <q-input filled v-model="busca" label="Buscar" class="q-mb-md" debounce="300" /> -->

    <q-table
      :rows="rowsFiltrados"
      :columns="columns"
      row-key="idOrdem"
      :pagination="pagination"
      :hide-header="isMobile"
      flat
      bordered
    >
      <!-- MOBILE: VISUAL RESUMIDO -->
      <template v-if="isMobile" v-slot:body="props">
        <q-tr :props="props">
          <q-td colspan="100%">
            <q-card flat bordered class="q-mb-sm">
              <q-card-section>
                <div class="text-subtitle2 text-weight-bold">
                  Pedido #{{ props.row.idOrdem }}
                </div>
                <div class="text-caption">Cliente: {{ props.row.nomeCliente }}</div>
                <div class="text-caption">Placa: {{ props.row.placa }}</div>
                <div class="text-caption">Status: {{ props.row.statusOrdem }}</div>
              </q-card-section>

              <q-expansion-item icon="expand_more" label="Ver mais detalhes" dense expand-separator>
                <q-card-section class="q-pt-none">
                  <div class="text-caption">Modelo: {{ props.row.modelo }}</div>
                  <div class="text-caption">Tipo: {{ props.row.tipoProposta }}</div>
                  <div class="text-caption">Pagamento: {{ props.row.formaPagamento }}</div>
                  <div class="text-caption">Cadastro: {{ props.row.dataCadastro }}</div>
                  <div class="text-caption">Vencimento: {{ props.row.dataVencimentoProposta }}</div>
                </q-card-section>
              </q-expansion-item>

              <q-separator />

              <q-card-actions align="right" class="q-gutter-sm">
                <q-btn
                  v-if="props.row.statusOrdem === 'Aguardando Autorização'"
                  round dense icon="check" color="green"
                  @click="autorizarPedido(props.row)"
                  title="Autorizar Pedido"
                />
                <q-btn round dense icon="construction" color="blue" title="Executar" />
                <q-btn round dense icon="delete" color="red" title="Excluir" />
              </q-card-actions>
            </q-card>
          </q-td>
        </q-tr>
      </template>

      <!-- DESKTOP: AÇÕES NA COLUNA -->
      <template v-else v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-x-xs text-center">
          <q-btn
            v-if="props.row.statusOrdem === 'Aguardando Autorização'"
            round dense icon="check" color="green"
            @click="autorizarPedido(props.row)"
            title="Autorizar Pedido"
          />
          <q-btn round dense icon="construction" v-if="props.row.tipoProposta === 'Pedido'" color="blue" title="Executar" />
          <q-btn round dense icon="delete" color="red" title="Excluir" />
        </q-td>
      </template>
    </q-table>

    <!-- BOTÃO FLOTANTE -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_shopping_cart" color="accent" :to="{ name: 'criar-pedido' }" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePedidoStore } from 'src/stores/pedido.store'
import { useQuasar, date } from 'quasar'
import { useFormatarDocumento } from 'src/composables/useFormatarDocumento'

const $q = useQuasar()
const isMobile = computed(() => $q.screen.lt.md)

// const busca = ref('')
const filtros = ref({
  status: '',
  dataInicio: '',
  dataFim: ''
})

const pedidoStore = usePedidoStore()
const { formatarDocumento } = useFormatarDocumento()

// Colunas da Tabela
const columns = [
  { name: 'idOrdem', label: 'Pedido', field: 'idOrdem', sortable: true, align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'nomeCliente', sortable: true, align: 'left' },
  { name: 'cpfCnpj', label: 'CPF/CNPJ', field: row => formatarDocumento(row.cpfCnpj), sortable: true, align: 'left' },
  { name: 'placa', label: 'Placa', field: 'placa', sortable: true, align: 'left' },
  { name: 'modelo', label: 'Modelo', field: 'modelo', sortable: true, align: 'left' },
  { name: 'tipoProposta', label: 'Tipo Proposta', field: 'tipoProposta', sortable: true, align: 'center' },
  { name: 'vencimentoProposta', label: 'Vencimento', field: row => row.dataVencimentoProposta, format: (val) => date.formatDate(val, 'DD/MM/YYYY'), sortable: true, align: 'center' },
  { name: 'status', label: 'Status', field: 'statusOrdem', sortable: true, align: 'center' },
  { name: 'formaPagamento', label: 'Pagamento', field: 'formaPagamento', sortable: true, align: 'center' },
  { name: 'dataCadastro', label: 'Cadastro', field: row => row.dataCadastro, format: (val) => date.formatDate(val, 'DD/MM/YYYY'), sortable: true, align: 'left' },
  { field: 'actions', name: 'actions', align: 'center' },
]

// Paginação
const pagination = { rowsPerPage: 20 }

// Opções de status
const statusOptions = [
  'Aguardando Autorização',
  'Autorizado',
  'Em Execução',
  'Finalizado',
]

const rowsFiltrados = computed(() => {
  return pedidoStore.pedidos.filter(pedido => {
    const statusOk = !filtros.value.status || pedido.statusOrdem === filtros.value.status
    const dataOk =
      (!filtros.value.dataInicio || pedido.dataCadastro >= filtros.value.dataInicio) &&
      (!filtros.value.dataFim || pedido.dataCadastro <= filtros.value.dataFim)
    return statusOk && dataOk
  })
})

// Ação
function autorizarPedido(pedido) {
  console.log('Autorizando pedido:', pedido)
}
</script>
