<!-- src/pages/ListarPedidos.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gerenciamento de Pedidos/Orçamentos</div>

    <!-- Filtros -->
    <q-form @submit="filtrarPedidos" class="q-mb-md">
      <div class="row q-col-gutter-md">
        <div :class="['col-12', { 'col-md-3': !isMobile }]">
          <q-input
            v-model="filtros.cliente"
            label="Cliente (Nome ou CPF)"
            outlined
            dense
            clearable
          />
        </div>
        <div :class="['col-12', { 'col-md-3': !isMobile }]">
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
        <div :class="['col-12', { 'col-md-3': !isMobile }]">
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
        <div :class="['col-12', { 'col-md-3': !isMobile }]">
          <q-select
            v-model="filtros.status"
            :options="statusOptions"
            label="Status"
            outlined
            dense
            multiple
            use-chips
            clearable
          />
        </div>
        <div class="col-12">
          <q-btn color="primary" label="Filtrar" type="submit" class="q-mr-sm text-black" />
          <q-btn color="accent" label="Limpar Filtros" @click="limparFiltros" flat />
        </div>
      </div>
    </q-form>

    <!-- Tabela de Pedidos -->
    <q-table
      :rows="pedidosFiltrados"
      :columns="columns"
      row-key="numero"
      :loading="loading"
      :pagination="pagination"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-badge :color="getStatusColor(props.row.status)">
            {{ props.row.status }}
          </q-badge>
        </q-td>
      </template>
    </q-table>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add_shopping_cart" color="accent" :to="{name: 'criar-pedido'}" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { date } from 'quasar'

export default defineComponent({
  name: 'ListarPedidosPage',
  setup() {
    const pedidos = ref([])
    const loading = ref(false)
    const hoje = date.formatDate(new Date(), 'DD/MM/YYYY')
    const filtros = ref({
      cliente: '',
      status: [],
      dataInicio: hoje,
      dataFim: hoje
    })

    const pedidosIniciais = [
      { numero: '001', cliente: 'João Silva', cpf: '123.456.789-00', placa: 'ABC-1234', tipo: 'Pedido', status: 'Pendente', data: hoje },
      { numero: '002', cliente: 'Maria Souza', cpf: '987.654.321-00', placa: 'XYZ-5678', tipo: 'Orçamento', status: 'Concluído', data: hoje },
    ]

    const columns = [
      { name: 'numero', label: 'Nº Pedido', field: 'numero', sortable: true },
      { name: 'cliente', label: 'Cliente', field: 'cliente', sortable: true },
      { name: 'cpf', label: 'CPF', field: 'cpf', sortable: true },
      { name: 'placa', label: 'Placa', field: 'placa', sortable: true },
      { name: 'tipo', label: 'Tipo', field: 'tipo', sortable: true },
      { name: 'status', label: 'Status', field: 'status', sortable: true },
      { name: 'data', label: 'Data', field: 'data', sortable: true },
    ]

    const pagination = { rowsPerPage: 10 }
    const statusOptions = ['Pendente', 'Concluído', 'Cancelado']
    const isMobile = computed(() => window.innerWidth <= 600)

    const pedidosFiltrados = computed(() => {
      let result = [...pedidos.value]

      // Filtro por cliente (nome ou CPF)
      if (filtros.value.cliente) {
        const busca = filtros.value.cliente.toLowerCase()
        result = result.filter(p =>
          p.cliente.toLowerCase().includes(busca) ||
          p.cpf.toLowerCase().includes(busca)
        )
      }

      // Filtro por status
      if (filtros.value.status.length > 0) {
        result = result.filter(p => filtros.value.status.includes(p.status))
      }

      // Filtro por período
      const dataInicio = filtros.value.dataInicio ? date.extractDate(filtros.value.dataInicio, 'DD/MM/YYYY') : null
      const dataFim = filtros.value.dataFim ? date.extractDate(filtros.value.dataFim, 'DD/MM/YYYY') : null

      result = result.filter(p => {
        const dataPedido = date.extractDate(p.data, 'DD/MM/YYYY')
        // Usando comparação nativa de JavaScript para datas
        return (!dataInicio || dataPedido >= dataInicio) &&
               (!dataFim || dataPedido <= dataFim)
      })

      return result
    })

    const getStatusColor = (status) => {
      return { Pendente: 'orange', Concluído: 'green', Cancelado: 'red' }[status] || 'grey'
    }

    const carregarPedidos = () => {
      loading.value = true
      return new Promise(resolve => {
        setTimeout(() => {
          pedidos.value = pedidosIniciais
          loading.value = false
          resolve()
        }, 500)
      })
    }

    const filtrarPedidos = async () => {
      await carregarPedidos()
    }

    const limparFiltros = async () => {
      filtros.value = {
        cliente: '',
        status: [],
        dataInicio: hoje,
        dataFim: hoje
      }
      await carregarPedidos()
    }

    onMounted(async () => {
      await carregarPedidos()
    })

    return {
      pedidos,
      pedidosFiltrados,
      columns,
      loading,
      pagination,
      filtros,
      statusOptions,
      isMobile,
      getStatusColor,
      filtrarPedidos,
      limparFiltros
    }
  },
})
</script>
