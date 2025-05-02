<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gerenciamento de Pedidos/Orçamentos</div>

    <q-card class="q-pa-md q-mb-md">
      <q-form >
        <div class="row q-col-gutter-md">
          <q-input
            v-model="filtros.termoBusca"
            color="accent"
            label="Buscar por cliente ou placa"
            class="col-12 col-md-4"
            filled
            debounce="300"
          />
          <q-select
            v-model="filtros.status"
            :options="statusOptions"
            color="accent"
            label="Status"
            class="col-12 col-md-2"
            outlined
            emit-value
            map-options
            clearable
          />

          <q-input
            color="accent"
            v-model="filtros.dataInicio"
            label="Data Início"
            type="date"
            class="col-12 col-md-2"
            filled
          />

          <q-input
            color="accent"
            v-model="filtros.dataFim"
            label="Data Fim"
            type="date"
            class="col-12 col-md-2"
            filled
          />

          <div class="col-12 col-md-2 flex items-end">
            <q-btn label="Filtrar" type="submit" color="accent" size="md" class="full-width" />
          </div>
        </div>
      </q-form>
    </q-card>

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
            <q-card flat bordered class="q-mb-sm" :class="{ 'bg-orange-1': props.row.statusOrdem === 'Em Execução' }">
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
                  <div class="text-caption">Cadastro: {{ date.formatDate(props.row.dataCadastro, 'DD/MM/YYYY') }}</div>
                  <div class="text-caption">Vencimento: {{ date.formatDate(props.row.dataVencimentoProposta, 'DD/MM/YYYY')}}</div>
                </q-card-section>
              </q-expansion-item>

              <q-separator />

              <q-card-actions align="right" class="q-gutter-sm">
                <q-btn v-if="props.row.statusOrdem === 'Aguardando Autorização'" round dense icon="check" color="green" @click="converterOrcamentoEmPedido(props.row.idOrdem)" title="Autorizar Pedido"/>
                <q-btn round dense icon="payments" color="blue" title="Cancelar Pedido" v-if="props.row.tipoProposta === 'Pedido' && props.row.statusOrdem === 'Aguardando Pagamento'" @click="atualizarStatusPedido(props.row, 'FI')"/>
                <q-btn round dense icon="construction" v-if="props.row.tipoProposta === 'Pedido' && props.row.statusOrdem !== 'Em Execução'" color="blue" @click="atualizarStatusPedido(props.row, 'EE')" title="" />
                <q-btn round dense icon="stop_circle" color="red" title="Cancelar Pedido" @click="atualizarStatusPedido(props.row, 'CA')" />
              </q-card-actions>
            </q-card>
          </q-td>
        </q-tr>
      </template>

      <!-- DESKTOP: AÇÕES NA COLUNA -->
      <template v-else v-slot:body="props">
  <q-tr
    :props="props"
    :class="{ 'bg-orange-1': props.row.statusOrdem === 'Em Execução' }"
  >
    <q-td
      v-for="col in props.cols"
      :key="col.name"
      :props="props"
    >
      <!-- Se for a célula de ações, renderize os botões -->
      <template v-if="col.name === 'actions'">
        <div class="q-gutter-x-sm row justify-end">
          <q-btn
          v-if="props.row.statusOrdem === 'Aguardando Autorização'"
          round dense icon="check" color="green"
          @click="converterOrcamentoEmPedido(props.row.idOrdem)"
          title="Autorizar Pedido"
        />
        <q-btn
          v-if="props.row.tipoProposta === 'Pedido' && props.row.statusOrdem === 'Em Execução'" round dense icon="construction" color="blue"
          @click="atualizarStatusPedido(props.row, 'EE')"
          title="Executar"
        />
        <q-btn round dense icon="payments" color="blue" title="Cancelar Pedido" v-if="props.row.tipoProposta === 'Pedido' && props.row.statusOrdem === 'Aguardando Pagamento'" @click="atualizarStatusPedido(props.row, 'FI')"/>
        <q-btn round dense icon="stop_circle" color="red" title="Cancelar Pedido" v-if="props.row.tipoProposta === 'Pedido' && props.row.statusOrdem !== 'Aguardando Pagamento'" @click="atualizarStatusPedido(props.row, 'CA')"/>
        </div>
      </template>

      <!-- Caso contrário, exiba o valor da célula -->
      <template v-else>
        {{ col.value }}
      </template>
    </q-td>
  </q-tr>
</template>

    </q-table>

    <!-- BOTÃO FLOTANTE -->
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_shopping_cart" color="accent" :to="{ name: 'criar-pedido' }" />
    </q-page-sticky> -->
    <q-page-sticky :position="stickyPosition" :offset="[18, 18]">
      <div :class="layoutClass">
        <q-btn fab icon="mdi-account-wrench" color="accent" :to="{ name: 'criar-pedido' }" />
        <!-- <q-btn fab icon="bolt" color="blue" :to="{ name: 'listar-pedidos' }" /> -->
      </div>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePedidoStore } from 'src/stores/pedido.store'
import { useQuasar, date } from 'quasar'
import { useFormatarDocumento } from 'src/composables/useFormatarDocumento'
import { pedidoService } from './services/pedido_service'
import useNotify from 'src/composables/useNotify'

const $q = useQuasar()
const { notifySuccess, notifyError } = useNotify()
const isMobile = computed(() => $q.screen.lt.md)

const stickyPosition = computed(() => {
  return $q.screen.lt.md ? 'bottom-left' : 'top-right'
})

const layoutClass = computed(() => {
  return $q.screen.lt.md ? 'column q-gutter-y-sm' : 'row q-gutter-x-sm'
})

const {carregarTodasAsOrdensDoEstabelecimento, atualizarOrcamentoParaPedido, mudarStatusPedido } = pedidoService()

// const busca = ref('')
const filtros = ref({
  status: '',
  dataInicio: '',
  dataFim: '',
  termoBusca: ''
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
  { name: 'vencimentoProposta', label: 'Vencimento', field: row => row.dataVencimentoProposta,  format: val => {
    const parsed = new Date(val + 'T00:00:00') // Força UTC neutro
    return date.formatDate(parsed, 'DD/MM/YYYY')
  }, sortable: true, align: 'center' },
  { name: 'status', label: 'Status', field: 'statusOrdem', sortable: true, align: 'center' },
  { name: 'formaPagamento', label: 'Pagamento', field: 'formaPagamento', sortable: true, align: 'center' },
  { name: 'dataCadastro', label: 'Cadastro', field: row => row.dataCadastro,
  format: val => {
    const parsed = new Date(val + 'T00:00:00') // Força UTC neutro
    return date.formatDate(parsed, 'DD/MM/YYYY')
  }, sortable: true, align: 'left' },
  { field: 'actions', name: 'actions', label: 'Ações', align: 'center' },
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

    const dataCadastro = date.extractDate(pedido.dataCadastro, 'YYYY-MM-DD')
    const dataInicio = filtros.value.dataInicio ? date.extractDate(filtros.value.dataInicio, 'YYYY-MM-DD') : null
    const dataFim = filtros.value.dataFim ? date.extractDate(filtros.value.dataFim, 'YYYY-MM-DD') : null

    const dataOk =
      (!dataInicio || dataCadastro >= dataInicio) &&
      (!dataFim || dataCadastro <= dataFim)

    const termo = filtros.value.termoBusca?.toLowerCase() || ''
    const termoOk =
      !termo ||
      pedido.nomeCliente.toLowerCase().includes(termo) ||
      pedido.placa.toLowerCase().includes(termo)

    return statusOk && dataOk && termoOk
  })
})


const converterOrcamentoEmPedido = async (idPedido) => {
  const pedido = pedidoStore.pedidos.find(p => p.idOrdem === idPedido)
  if (pedido && pedido.tipoProposta === 'Orçamento') {

    $q.dialog({
    title: 'Autorizar Orçamento', message: 'Deseja mudar este orçamento para pedido?',
    cancel: {
      label: 'Cancelar',
      color: 'negative', // cor do botão Cancelar
      flat: true
    },
    ok: {
      label: 'Confirmar',
      color: 'accent', // cor do botão OK
      unelevated: true
      },
    persistent: true}
  )
    .onOk(async () => {
      const response = await atualizarOrcamentoParaPedido(idPedido)
      if (response.status === 204) {
        notifySuccess('Orçamento convertido para Pedido com sucesso!')
      }
    })

    await carregarTodasAsOrdensDoEstabelecimento()
  } else {
    notifyError(`Não foi possível converter o pedido ${idPedido}`)
  }
}

const atualizarStatusPedido = (pedidoRow, novoStatus) => {
  const pedido = pedidoStore.pedidos.find(p => p.idOrdem === pedidoRow.idOrdem)
  if (pedido) {

    if(novoStatus === 'EE') {
      $q.dialog({title: 'Enviar pedido para oficina', message: `Deseja enviar o pedido do(a) cliente ${pedidoRow.nomeCliente} para oficina?`,
        cancel: {
          label: 'Cancelar',
          color: 'negative', // cor do botão Cancelar
          flat: true
        },
        ok: {
          label: 'Confirmar',
          color: 'accent', // cor do botão OK
          unelevated: true
          },
        persistent: true})
        .onOk(async () => {
          const response = await mudarStatusPedido({idOrdem: pedidoRow.idOrdem, novoStatus})
          if (response.status === 204) {
            notifySuccess('Pedido com status alterado com sucesso!')
          }

          await carregarTodasAsOrdensDoEstabelecimento()
        })
    }

    if(novoStatus === 'FI') {
      $q.dialog({title: 'Confirmar pagamento', message: `Deseja confirmar o pagamento e finalizar o pedido do(a) Sr(a). ${pedidoRow.nomeCliente}?`,
        cancel: {
          label: 'Cancelar',
          color: 'negative', // cor do botão Cancelar
          flat: true
        },
        ok: {
          label: 'Confirmar',
          color: 'accent', // cor do botão OK
          unelevated: true
          },
        persistent: true})
        .onOk(async () => {
          const response = await mudarStatusPedido({idOrdem: pedidoRow.idOrdem, novoStatus})
          if (response.status === 204) {
            notifySuccess('Pedido finalizado com sucesso!')
          }

          await carregarTodasAsOrdensDoEstabelecimento()
        })
    }

  } else {
    notifyError(`Pedido ${pedidoRow.idOrdem} não encontrado.`)
  }
}
</script>
