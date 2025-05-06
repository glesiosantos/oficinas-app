<template>
  <q-page class="q-pa-md">
    <!-- Título -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Acompanhamento da Oficina</div>
    </div>

    <!-- Legenda -->
    <div class="row q-col-gutter-sm q-mb-md">
      <div v-for="item in legenda" :key="item.label" class="col-6 col-sm-3">
        <q-card flat bordered class="q-pa-sm row items-center">
          <div
            class="q-mr-sm"
            style="width: 16px; height: 16px; border-radius: 4px;"
            :style="{ backgroundColor: item.color }"
          ></div>
          <div class="text-caption text-weight-medium">{{ item.label }}</div>
        </q-card>
      </div>
    </div>

    <!-- Tabela para Desktop -->
    <q-table
      v-if="$q.screen.gt.sm"
      :rows="pedidosFiltrados"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :pagination="{ rowsPerPage: 20 }"
    >
      <!-- <template v-slot:body-cell-status="props">
        <q-badge
          class="q-pa-sm"
          rounded
          :style="{ backgroundColor: getStatusColor(props.row.statusOficina) }"
        >
          {{ props.row.statusOficina }}
        </q-badge>
      </template> -->
      <template v-slot:body-cell-acao="props">
        <q-td :props="props" class="q-gutter-x-xs text-center">
          <q-btn round dense color="blue" size="md" icon="checklist" @click="openDrawer('edit',props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Cards com Collapse para Mobile -->
    <div v-else>
      <q-card
        v-for="pedido in pedidosFiltrados"
        :key="pedido.id"
        class="q-mb-md"
        bordered
      >
        <q-expansion-item
          icon="directions_car"
          :label="pedido.veiculo"
          dense
          expand-separator
        >
          <div class="q-pa-sm">
            <div><strong>Cliente:</strong> {{ pedido.cliente }}</div>
            <div class="row items-center q-gutter-sm q-mt-sm">
              <div
                style="width: 12px; height: 12px; border-radius: 3px;"
                :style="{ backgroundColor: getStatusColor(pedido.statusOficina) }"
              ></div>
              <div><strong>Status:</strong> {{ pedido.statusOficina }}</div>
            </div>
            <q-btn
              dense
              flat
              icon="info"
              color="primary"
              class="q-mt-sm"
              @click="openDrawer(pedido)"
              label="Detalhes"
            />
          </div>
        </q-expansion-item>
      </q-card>
    </div>

    <!-- Drawer com detalhes -->
    <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <detalhe-pedido-oficina
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
import { computed } from 'vue'
import { usePedidoStore } from 'src/stores/pedido.store'
import { useDrawer } from 'src/composables/useDrawer'
import DetalhePedidoOficina from './components/DetalhePedidoOficina.vue'

const { drawer, isEdit, currentData, openDrawer, closeDrawer } = useDrawer()
const pedidoStore = usePedidoStore()

// Legenda dos status
const legenda = [
  { label: 'Aguardando', color: '#9e9e9e' },
  { label: 'Em Andamento', color: '#43a047' },
  { label: 'Pendente', color: '#fb8c00' },
  { label: 'Concluído', color: '#42a5f5' }
]

// Retorna a cor do status
const getStatusColor = (status) => {
  const item = legenda.find(l => l.label === status)
  return item ? item.color : '#ccc'
}

// Filtra os pedidos com os status da legenda
const statusPermitidos = legenda.map(l => l.label)
const pedidosFiltrados = computed(() =>
  pedidoStore.pedidos.filter(p => statusPermitidos.includes(p.statusOficina))
)

const columns = [
  {
    name: 'veiculo',
    label: 'Veículo',
    field: row => `${row.placa} - ${row.modelo}`,
    align: 'left',
    style: 'min-width: 200px;'
  },
  {
    name: 'cliente',
    label: 'Cliente',
    field: 'nomeCliente',
    align: 'left',
    style: 'min-width: 180px;'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'statusOficina',
    align: 'left',
    style: 'min-width: 120px;'
  },
  {
    name: 'acao',
    label: 'Ação',
    field: 'acao',
    align: 'center',
    style: 'width: 80px;',
    sortable: false
  }
]
const handleSubmit = (data) => {
  // Atualização ou lógica personalizada aqui
  console.log(data)
  closeDrawer()
}
</script>
