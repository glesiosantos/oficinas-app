<!-- src/pages/ListarPedido.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gerenciamento de Pedidos</div>

    <!-- Filtros -->
    <div class="q-mb-md">
      <q-form @submit="filtrarPedidos">
        <div class="row q-col-gutter-md">
          <div :class="['col-12', { 'col-md-4': !isMobile }]">
            <q-select
              v-model="filtros.status"
              :options="statusOptions"
              label="Status"
              outlined
              dense
              multiple
              use-chips
              emit-value
              map-options
            />
          </div>
          <div :class="['col-12', { 'col-md-4': !isMobile }]">
            <q-input
              v-model="filtros.dataInicio"
              label="Data Início"
              outlined
              dense
              mask="##/##/####"
              placeholder="DD/MM/AAAA"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date v-model="filtros.dataInicio" mask="DD/MM/YYYY" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div :class="['col-12', { 'col-md-4': !isMobile }]">
            <q-input
              v-model="filtros.dataFim"
              label="Data Fim"
              outlined
              dense
              mask="##/##/####"
              placeholder="DD/MM/AAAA"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy>
                    <q-date v-model="filtros.dataFim" mask="DD/MM/YYYY" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12">
            <q-btn color="primary" label="Filtrar" type="submit" />
          </div>
        </div>
      </q-form>
    </div>

    <!-- Tabela de Pedidos -->
    <q-table
      :rows="pedidosFiltrados"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :pagination="pagination"
      class="q-mb-md"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.row.status)">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>

    <!-- FAB para novo pedido -->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="abrirDialogNovoPedido" />
    </q-page-sticky>

    <!-- Dialog para novo pedido -->
    <q-dialog v-model="dialogNovoPedido">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Novo Pedido</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit="cadastrarPedido">
            <q-input
              v-model="novoPedido.cliente"
              label="Nome do Cliente"
              outlined
              dense
              class="q-mb-md"
              :rules="[val => !!val || 'Campo obrigatório']"
            />
            <q-input
              v-model="novoPedido.produto"
              label="Produto"
              outlined
              dense
              class="q-mb-md"
              :rules="[val => !!val || 'Campo obrigatório']"
            />
            <q-btn color="primary" label="Cadastrar" type="submit" />
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'ListarPedidoPage',

  setup() {
    const pedidos = ref([])
    const loading = ref(false)
    const dialogNovoPedido = ref(false)
    const filtros = ref({
      status: [],
      dataInicio: null,
      dataFim: null
    })
    const novoPedido = ref({
      cliente: '',
      produto: ''
    })

    const pedidosIniciais = [
      { id: 1, cliente: 'João Silva', produto: 'Smartphone', status: 'Pendente', data: '29/03/2025' },
      { id: 2, cliente: 'Maria Souza', produto: 'Notebook', status: 'Concluído', data: '29/03/2025' },
      { id: 3, cliente: 'Pedro Santos', produto: 'Tablet', status: 'Cancelado', data: '29/03/2025' },
      { id: 4, cliente: 'Ana Costa', produto: 'Monitor', status: 'Pendente', data: '29/03/2025' }
    ]

    const columns = [
      { name: 'id', label: 'ID', field: 'id', sortable: true },
      { name: 'cliente', label: 'Cliente', field: 'cliente', sortable: true },
      { name: 'produto', label: 'Produto', field: 'produto', sortable: true },
      { name: 'status', label: 'Status', field: 'status', sortable: true },
      { name: 'data', label: 'Data', field: 'data', sortable: true }
    ]

    const pagination = {
      rowsPerPage: 10
    }

    const statusOptions = [
      { label: 'Pendente', value: 'Pendente' },
      { label: 'Concluído', value: 'Concluído' },
      { label: 'Cancelado', value: 'Cancelado' }
    ]

    const isMobile = computed(() => window.innerWidth <= 600)

    const pedidosFiltrados = computed(() => {
      let result = [...pedidos.value]

      if (filtros.value.status.length > 0) {
        result = result.filter(pedido => filtros.value.status.includes(pedido.status))
      }

      if (filtros.value.dataInicio) {
        result = result.filter(pedido =>
          date.isSameOrAfter(pedido.data, filtros.value.dataInicio, 'day')
        )
      }

      if (filtros.value.dataFim) {
        result = result.filter(pedido =>
          date.isSameOrBefore(pedido.data, filtros.value.dataFim, 'day')
        )
      }

      return result
    })

    const getStatusColor = (status) => {
      switch (status) {
        case 'Pendente': return 'orange'
        case 'Concluído': return 'green'
        case 'Cancelado': return 'red'
        default: return 'grey'
      }
    }

    const carregarPedidos = () => {
      loading.value = true
      setTimeout(() => {
        pedidos.value = pedidosIniciais
        loading.value = false
      }, 1000)
    }

    const filtrarPedidos = () => {
      // Filtragem automática via computed
    }

    const abrirDialogNovoPedido = () => {
      dialogNovoPedido.value = true
      novoPedido.value = { cliente: '', produto: '' }
    }

    const cadastrarPedido = () => {
      const novo = {
        id: pedidos.value.length + 1,
        cliente: novoPedido.value.cliente,
        produto: novoPedido.value.produto,
        status: 'Pendente',
        data: date.formatDate(new Date(), 'DD/MM/YYYY')
      }
      pedidos.value.push(novo)
      dialogNovoPedido.value = false
    }

    onMounted(() => {
      carregarPedidos()
    })

    return {
      pedidos,
      pedidosFiltrados,
      columns,
      loading,
      pagination,
      filtros,
      statusOptions,
      dialogNovoPedido,
      novoPedido,
      isMobile,
      getStatusColor,
      filtrarPedidos,
      abrirDialogNovoPedido,
      cadastrarPedido
    }
  }
})
</script>
