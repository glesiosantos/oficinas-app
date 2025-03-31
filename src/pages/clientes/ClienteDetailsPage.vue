<!-- src/pages/ClienteDetails.vue -->
<template>
  <q-page padding>
    <q-card>
      <q-card-section class="bg-accent text-white">
        <div class="text-h6">Detalhes do Cliente</div>
      </q-card-section>

      <q-card-section v-if="cliente">
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>ID do Cliente</q-item-label>
                  <q-item-label>{{ cliente.idCliente }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>CPF/CNPJ</q-item-label>
                  <q-item-label>{{ formatarCPFouCNPJ(cliente.cpfOuCnpj) }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-4">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Nome</q-item-label>
                  <q-item-label>{{ cliente.nome }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Razão Social</q-item-label>
                  <q-item-label>{{ cliente.razao }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-12 col-md-4">
            <q-list bordered>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Tipo</q-item-label>
                  <q-item-label>{{ cliente.tipo }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Contatos</q-item-label>
                  <q-item-label>
                    <span v-for="(contato, index) in cliente.contatos" :key="index">
                      {{ contato }}<br>
                    </span>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>

        <q-separator class="q-my-md" />

        <div class="text-subtitle1 q-mb-md">Veículos</div>
        <q-table
          flat
          bordered
          :columns="veiculoColumns"
          :rows="cliente.veiculos"
          row-key="id"
          :pagination="pagination"
        >
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                color="primary"
                class="text-black"
                size="sm"
                label="Novo Pedido"
                icon="shopping_cart"
                @click="novoPedido(props.row)"
              />
            </q-td>
          </template>
          <template v-slot:no-data>
            <div class="full-width row flex-center text-negative q-gutter-sm">
              <q-icon name="warning" />
              <span>Nenhum veículo cadastrado</span>
            </div>
          </template>
        </q-table>
      </q-card-section>

      <q-card-section v-else>
        <div class="text-center text-grey">Carregando dados do cliente...</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          color="primary"
          label="Voltar"
          @click="$router.push('/clientes')"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useClienteStore } from 'src/stores/cliente.store'

const route = useRoute()
const router = useRouter()
const clienteStore = useClienteStore()
const cliente = ref(null)

const veiculoColumns = [
  { name: 'marca', label: 'Marca', field: 'marca', align: 'left', sortable: true },
  { name: 'modelo', label: 'Modelo', field: 'modelo', align: 'left', sortable: true },
  { name: 'placa', label: 'Placa', field: 'placa', align: 'left' },
  { name: 'ano', label: 'Ano', field: 'ano', align: 'center', sortable: true },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' }
]

const pagination = {
  rowsPerPage: 10,
  sortBy: 'marca',
  descending: false
}

const formatarCPFouCNPJ = (valor) => {
  if (!valor) return ''
  const apenasNumeros = valor.replace(/\D/g, '')

  if (apenasNumeros.length === 11) {
    return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  else if (apenasNumeros.length === 14) {
    return apenasNumeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return valor
}

const novoPedido = (veiculo) => {
  router.push({
    name: 'clientePedido',
    query: {
      clienteId: cliente.value.idCliente,
      veiculoId: veiculo.id // Assumindo que o veículo tem um ID
    }
  })
}

onMounted(() => {
  const clienteId = route.params.id
  cliente.value = clienteStore.clientes.find(c => c.idCliente === Number(clienteId))
})
</script>

<style scoped>
.q-list {
  margin-bottom: 16px;
}

@media (max-width: 767px) {
  .q-list {
    margin-bottom: 8px;
  }
}
</style>
