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

    <q-table
        :rows="pedidosFiltrados"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :pagination="{ rowsPerPage: 20 }"
        :hide-header="$q.screen.lt.md"
      >
        <!-- Desktop: botão de ação -->
        <template v-if="$q.screen.gt.sm" v-slot:body-cell-acao="props">
          <q-td :props="props" class="q-gutter-x-xs text-center">
            <q-btn round dense color="blue" size="md" icon="checklist" @click="openDrawer('edit', props.row)" />
          </q-td>
        </template>

        <!-- Mobile: renderização em card -->
        <template v-if="$q.screen.lt.md" v-slot:body="props">
          <q-tr :props="props">
            <q-td colspan="100%">
              <q-card
                flat
                bordered
                class="q-mb-sm"
                :style="`border-top: 4px solid ${getStatusColor(props.row.statusOficina)}`"
              >
                <q-card-section>
                  <div class="text-subtitle2 text-weight-bold">
                    {{ props.row.veiculo?.placa }} - {{ props.row.veiculo?.modelo }}
                  </div>
                  <div class="text-caption">Cliente: {{ props.row.nomeCliente }}</div>
                  <div class="row items-center q-gutter-sm q-mt-sm">
                    <div
                      style="width: 12px; height: 12px; border-radius: 3px;"
                      :style="{ backgroundColor: getStatusColor(props.row.statusOficina) }"
                    ></div>
                    <div class="text-caption"><strong>Status:</strong> {{ props.row.statusOficina }}</div>
                  </div>
                </q-card-section>

                <q-separator />

                <q-card-actions align="right" class="q-gutter-sm">
                  <q-btn
                    round
                    dense
                    icon="checklist"
                    color="blue"
                    @click="openDrawer('edit', props.row)"
                    title="Abrir detalhes"
                  />
                </q-card-actions>
              </q-card>
            </q-td>
          </q-tr>
        </template>
      </q-table>


    <!-- Drawer lateral com detalhes -->
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
import { pedidoService } from './services/pedido_service'
import useNotify from 'src/composables/useNotify'

const { drawer, isEdit, currentData, openDrawer, closeDrawer } = useDrawer()
const { notifySuccess } = useNotify()

const pedidoStore = usePedidoStore()
const { mudarStatusPedidoNaOficina, carregarTodasAsOrdensDoEstabelecimento } = pedidoService()

// Legenda dos status
const legenda = [
  { label: 'Aguardando', color: '#9e9e9e' },
  { label: 'Em Andamento', color: '#43a047' },
  { label: 'Pendente', color: '#fb8c00' },
  { label: 'Concluído', color: '#42a5f5' }
]

// Retorna a cor com base no status
const getStatusColor = (status) => {
  const item = legenda.find(l => l.label === status)
  return item ? item.color : '#ccc'
}

// Filtro dos pedidos
const statusPermitidos = legenda.map(l => l.label)
const pedidosFiltrados = computed(() =>
  pedidoStore.pedidos.filter(p => statusPermitidos.includes(p.statusOficina))
)

// Colunas da tabela desktop
const columns = [
  {
    name: 'veiculo',
    label: 'Veículo',
    field: row => `${row.veiculo?.placa} - ${row.veiculo?.modelo}`,
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

const handleSubmit = async (data) => {
  await mudarStatusPedidoNaOficina(data)
  await carregarTodasAsOrdensDoEstabelecimento()
  closeDrawer()
  notifySuccess('Status do serviço atualizado com sucesso!')
}
</script>
