<template>
  <q-page class="q-pa-md">
    <!-- Row com 4 Cards -->
    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3" v-for="(card, index) in cards" :key="index">
        <q-card class="my-card full-height">
          <q-card-section class="row items-center no-wrap full-height">
            <div class="col">
              <div class="text-h6">{{ card.title }}</div>
              <div class="text-subtitle1">{{ card.value }}</div>
            </div>
            <q-icon :name="card.icon" size="40px" color="primary" />
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
import { ref } from 'vue'
import VueApexCharts from 'vue3-apexcharts'

// Dados dos Cards
const cards = ref([
  { title: 'Vendas Totais', value: 'R$ 15.000', icon: 'monetization_on' },
  { title: 'Clientes Atendidos', value: '120', icon: 'people' },
  { title: 'Ticket Médio', value: 'R$ 125', icon: 'bar_chart' },
  { title: 'Pedidos Pendentes', value: '8', icon: 'hourglass_empty' }
])

// Configuração do Gráfico
const chartOptions = ref({
  chart: { id: 'sales-chart' },
  xaxis: { categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'] },
  title: { text: '' }
})

const series = ref([
  {
    name: 'Vendas',
    data: [3000, 4000, 3500, 5000, 4900, 6000]
  }
])

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
