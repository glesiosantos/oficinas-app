<template>
  <q-page class="q-pa-md">
    <!-- Título e botão de reload -->
    <div class="row items-center justify-between q-mb-md">
      <div class="text-h6">Acompanhamento da Oficina</div>
    </div>

    <!-- Legenda no topo como cards -->
    <div class="row q-col-gutter-sm q-mb-md">
      <div
        v-for="item in legenda"
        :key="item.label"
        class="col-6 col-sm-3"
      >
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

    <!-- Cards de pedidos -->
    <div class="row q-col-gutter-md">
      <div
        v-for="(pedido, index) in pedidosAguardando"
        :key="index"
        class="col-12 col-md-6"
      >
        <q-card :style="{ backgroundColor: getCardColor(pedido.statusOficina), color: 'white' }" bordered @click="openDialog(pedido)">
          <q-card-section>
            <div class="text-h5 text-weight-bold text-truncate">{{ pedido.modelo }} - Placa: {{ pedido.placa }}</div>
            <div class="text-subtitle2 text-truncate">
              Cliente: {{ pedido.nomeCliente }}
            </div>
            <div class="text-caption">Mecânico: {{ pedido.responsavel }}</div>
          </q-card-section>

          <q-separator dark />

          <!-- Timeline de status -->
        </q-card>
      </div>
    </div>
  </q-page>

  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 350px; max-width: 600px">
      <q-card-section class="text-h6">
        Detalhes do Pedido
      </q-card-section>

      <q-card-section>
        <div class="q-mv-sm"><strong>Veículo:</strong> {{ pedidoSelecionado?.modelo }} - {{ pedidoSelecionado?.placa }}</div>
        <div>
            <strong>Observações:</strong>
            <p>{{ pedidoSelecionado?.observacoes }}</p>
        </div>

        <q-select
          class="q-mt-md"
          v-model="novoStatus"
          :options="etapas.map(etapa => ({ label: etapa.label, value: etapa.valor }))"
          label="Novo status"
          emit-value
          map-options
          dense
          filled
        />

        <q-input
          v-if="novoStatus === 'PE'"
          v-model="pendenciaDescricao"
          label="Descreva a pendência"
          type="textarea"
          dense
          filled
          class="q-mt-md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" v-close-popup />
        <q-btn label="Salvar" color="primary" @click="salvarAlteracoes" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { computed, ref } from 'vue'
import { usePedidoStore } from 'src/stores/pedido.store'
import { pedidoService } from './services/pedido_service'
import useNotify from 'src/composables/useNotify'

const pedidoStore = usePedidoStore()
const {notifySuccess} = useNotify()
const { mudarStatusPedidoNaOficina, carregarTodasAsOrdensDoEstabelecimento } = pedidoService()

const dialog = ref(false)
const pedidoSelecionado = ref(null)
const novoStatus = ref(null)
const pendenciaDescricao = ref('')

const etapas = [
  { name: 1, valor: 'AG', label: 'Aguardando', icon: 'hourglass_empty' },
  { name: 2, valor: 'EA', label: 'Em Andamento', icon: 'build' },
  { name: 3, valor: 'PE', label: 'Pendente', icon: 'report_problem' },
  { name: 4, valor: 'CO', label: 'Concluído', icon: 'check_circle' }
]

const legenda = [
  { label: 'Aguardando', color: '#9e9e9e' },
  { label: 'Em Andamento', color: '#43a047' },
  { label: 'Pendente', color: '#fb8c00' },
  { label: 'Concluído', color: '#42a5f5' }
]

function getCardColor(status) {
  switch (status) {
    case 'Aguardando': return '#9e9e9e'
    case 'Em Andamento': return '#43a047'
    case 'Pendente': return '#fb8c00'
    case 'Concluído': return '#42a5f5'
    default: return '#424242'
  }
}

function openDialog(pedido) {
  pedidoSelecionado.value = { ...pedido }
  novoStatus.value = pedido.status
  pendenciaDescricao.value = pedido.pendencia || ''
  dialog.value = true
}

const salvarAlteracoes = async () => {
  await mudarStatusPedidoNaOficina({idOrdem: pedidoSelecionado.value.idOrdem, statusOficina: novoStatus.value, descricaoPendencia: pendenciaDescricao.value})
  notifySuccess('Status atualizado com sucesso!')
  await carregarTodasAsOrdensDoEstabelecimento()
  dialog.value = false
}

const pedidosAguardando = computed(() =>
  pedidoStore.pedidos.filter(pedido => pedido.statusOrdem === 'Em Execução')
)
</script>
<style scoped>
.line-connector {
  transition: background-color 0.3s ease;
}

</style>
