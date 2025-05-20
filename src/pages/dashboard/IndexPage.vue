<template>
  <q-page class="q-pa-md">
    <!-- Row com 4 Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3" v-for="(card, index) in dashboardStore.dashboard.cards" :key="index">
        <q-card class="my-card full-height">
          <q-card-section class="row items-center no-wrap full-height">
            <div class="col">
              <div class="text-h6">{{ card.titulo }}</div>
              <div class="text-subtitle1">{{ card.valor }}</div>
            </div>
            <q-icon :name="card.icon" size="40px" color="accent" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <!-- Gráfico -->
      <div class="col-12 col-md-6">
        <q-card class="full-height">
          <q-card-section>
            <div class="text-h6">Acompanhamento de Vendas</div>
            <apexchart type="line" height="300" :options="chartOptions" :series="series"></apexchart>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card class="full-height">
          <q-card-section>
            <div class="text-h6">Distribuição de Vendas</div>
            <apexchart type="pie" height="300" :options="pieOptions" :series="pieSeries" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <q-card class="full-height">
          <q-card-section>
            <div class="text-h6">Últimos Atendimentos</div>
            <q-table
              :columns="columns"
              :rows="tableData"
              row-key="id"
              :pagination="pagination"
              flat
              dense
            >
            <!-- Slot para customizar a coluna 'status' com badges -->
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    :color="props.row.status === 'Concluído' ? 'green' : 'orange'"
                    :label="props.row.status"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { useDashboardStore } from 'src/stores/dashboard.store'
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

const dashboardStore = useDashboardStore()

// Configuração do Gráfico
const chartOptions = ref({
  chart: { id: 'sales-chart' },
  xaxis: { categories: ['Mar', 'Abr', 'Mai'] },
  title: { text: '' }
})

const series = ref([
  {
    name: 'Vendas',
    data: dashboardStore.dashboard.series
  }
])

const pieOptions = ref({
  chart: {
    type: 'pie'
  },
  labels: ['Serviços', 'Produtos', 'Outros'],
  title: {
    text: 'Distribuição de Vendas'
  }
})

const pieSeries = ref([44, 33, 23])

// Configuração da Tabela
const columns = ref([
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'date', label: 'Data', field: 'date', align: 'left' },
  { name: 'client', label: 'Cliente', field: 'client', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'left' }
])

const tableData = ref([
  { id: '001', date: '19/03/2025', client: 'João Silva', status: 'Concluído' },
  { id: '002', date: '19/03/2025', client: 'Maria Oliveira', status: 'Pendente' }
])

const pagination = ref({ rowsPerPage: 10 })

// Exportando componentes (necessário para Composition API com <script setup>)
defineOptions({
  components: {
    apexchart: VueApexCharts
  }
})

</script>

<style scoped>
.my-card {
  background: #f5f5f5;
  min-height: 100px; /* Altura mínima para os cards */
}

.full-height {
  height: 100%; /* Garante que os elementos ocupem a altura total */
}

/* Ajuste para responsividade */
@media (max-width: 599px) {
  .my-card {
    min-height: 100px;
  }
}
</style>
