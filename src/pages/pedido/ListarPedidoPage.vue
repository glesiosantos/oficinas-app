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

    <q-tabs
      v-model="abaSelecionada"
      dense
      align="left"
      class="text-accent q-mb-md"
      active-color="accent"
      indicator-color="accent"
      narrow-indicator
    >
      <q-tab name="todos" label="Todos" />
      <q-tab name="aguardando" label="Aguardando Autorização" />
      <q-tab name="execucao" label="Em Execução" />
      <q-tab name="finalizado" label="Finalizado" />
    </q-tabs>
      <q-table
        :rows="pedidosFiltradosPorAba"
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
              <q-card flat bordered class="q-mb-sm" :class="{ 'bg-orange-1': props.row.statusPedido === 'Em Execução' }">
                <q-card-section>
                  <div class="text-subtitle2 text-weight-bold">
                    Pedido #{{ props.row.idOrdem }}
                  </div>
                  <div class="text-caption">Cliente: {{ props.row.nomeCliente }}</div>
                  <div class="text-caption">Placa: {{ props.row.placa }}</div>
                  <div class="text-caption">Status: {{ props.row.statusPedido }}</div>
                </q-card-section>

                <q-expansion-item icon="expand_more" label="Ver mais detalhes" dense expand-separator>
                  <q-card-section class="q-pt-none">
                    <div class="text-caption">Modelo: {{ props.row.veiculo?.modelo }}</div>
                    <div class="text-caption">Tipo: {{ props.row.tipoProposta }}</div>
                    <div class="text-caption">Pagamento: {{ props.row.formaPagamento }}</div>
                    <div class="text-caption">Cadastro: {{ date.formatDate(props.row.dataCadastro, 'DD/MM/YYYY') }}</div>
                    <div class="text-caption">Vencimento: {{ date.formatDate(props.row.dataVencimentoProposta, 'DD/MM/YYYY')}}</div>
                  </q-card-section>
                </q-expansion-item>

                <q-separator />

                <q-card-actions align="right" class="q-gutter-sm">
                  <template v-if="props.row.statusPedido !== 'Finalizado' && props.row.statusPedido !== 'Cancelado'">

                    <q-btn round dense icon="picture_as_pdf" color="deep-orange" title="Exportar PDF" @click="exportarPDF(props.row)"/>
                    <!-- Autorizar Pedido -->
                    <q-btn
                      v-if="props.row.statusPedido === 'Aguardando Autorização'"
                      round dense icon="check" color="green"
                      @click="converterOrcamentoEmPedido(props.row.idOrdem)"
                      title="Autorizar Pedido"
                    />

                    <!-- Enviar para Execução -->
                    <q-btn
                      v-if="props.row.tipoProposta === 'Pedido' && props.row.statusPedido === 'Pendente' || props.row.statusPedido === 'Autorizado'"
                      round dense icon="construction" color="blue"
                      @click="atualizarStatusPedido(props.row, 'EE')"
                      title="Enviar para Execução"
                    />

                    <!-- Cancelar após aguardando pagamento (Finalizar) -->
                    <q-btn
                      v-if="props.row.tipoProposta === 'Pedido' && props.row.statusPedido === 'Aguardando Pagamento'"
                      round dense icon="payments" color="blue"
                      title="Finalizar Pedido"
                      @click="atualizarStatusPedido(props.row, 'FI')"
                    />

                    <!-- Cancelar Pedido geral (exceto aguardando pagamento) -->
                    <q-btn
                      v-if="props.row.tipoProposta === 'Pedido' && props.row.statusPedido !== 'Aguardando Pagamento'"
                      round dense icon="stop_circle" color="red"
                      title="Cancelar Pedido"
                      @click="atualizarStatusPedido(props.row, 'CA')"
                    />

                    <!-- Editar Pedido -->
                    <q-btn
                      v-if="['Aguardando Autorização', 'Autorizado', 'Pendente'].includes(props.row.statusPedido)"
                      round dense icon="edit" color="accent"
                      title="Editar Pedido"
                      @click="editarPedido(props.row)"
                    />
                  </template>
                </q-card-actions>
              </q-card>
            </q-td>
          </q-tr>
        </template>

        <!-- DESKTOP: AÇÕES NA COLUNA -->
        <template v-else v-slot:body="props">
    <q-tr
      :props="props"
      :class="{ 'bg-orange-1': props.row.statusPedido === 'Em Execução' }"
    >
      <q-td
        v-for="col in props.cols"
        :key="col.name"
        :props="props"
      >
        <!-- Se for a célula de ações, renderize os botões -->
        <template v-if="col.name === 'actions'">
        <div class="q-gutter-x-sm row justify-end">
          <template v-if="props.row.statusPedido !== 'Finalizado' && props.row.statusPedido !== 'Cancelado'">

            <q-btn round dense icon="picture_as_pdf" color="deep-orange" title="Exportar PDF" @click="exportarPDF(props.row)"/>


            <!-- Autorizar Pedido -->
            <q-btn
              v-if="props.row.statusPedido === 'Aguardando Autorização'"
              round dense icon="check" color="green"
              @click="converterOrcamentoEmPedido(props.row.idOrdem)"
              title="Autorizar Pedido"
            />

            <!-- Enviar para Execução -->
            <q-btn
              v-if="props.row.tipoProposta === 'Pedido' && props.row.statusPedido === 'Pendente' || props.row.statusPedido === 'Autorizado'"
              round dense icon="construction" color="blue"
              @click="atualizarStatusPedido(props.row, 'EE')"
              title="Enviar para Execução"
            />

            <!-- Cancelar após aguardando pagamento (Finalizar) -->
            <q-btn
              v-if="props.row.tipoProposta === 'Pedido' && (props.row.statusPedido === 'Aguardando Pagamento' || props.row.statusPedido === 'Autorizado')"
              round dense icon="payments" color="green"
              title="Finalizar Pedido"
              @click="atualizarStatusPedido(props.row, 'FI')"
            />

            <q-btn
              v-if="['Aguardando Autorização', 'Autorizado', 'Pendente'].includes(props.row.statusPedido)"
              round dense icon="edit" color="accent"
              title="Editar Pedido"
              @click="editarPedido(props.row)"
            />

            <!-- Cancelar Pedido geral (exceto aguardando pagamento) -->
            <q-btn
              v-if="props.row.tipoProposta === 'Pedido' && props.row.statusPedido !== 'Aguardando Pagamento'"
              round dense icon="stop_circle" color="red"
              title="Cancelar Pedido"
              @click="atualizarStatusPedido(props.row, 'CA')"
            />
          </template>
        </div>
      </template>
        <!-- Caso contrário, exiba o valor da célula -->
        <template v-else>
          {{ col.value }}
        </template>
      </q-td>
    </q-tr>

    <div style="position: absolute; left: -9999px;">
      <PedidoPDF v-if="pedidoSelecionadoParaPDF" :pedido="pedidoSelecionadoParaPDF" ref="pdfRef" />
    </div>
  </template>

    </q-table>

    <q-page-sticky :position="stickyPosition" :offset="[18, 18]">
        <div :class="layoutClass">
          <q-btn fab icon="receipt" color="accent" :to="{ name: 'criar-pedido' }" />
        </div>
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePedidoStore } from 'src/stores/pedido.store'
import { useQuasar, date } from 'quasar'
import { useFormatarDocumento } from 'src/composables/useFormatarDocumento'
import { pedidoService } from './services/pedido_service'
import useNotify from 'src/composables/useNotify'
import { useRouter } from 'vue-router'
import PedidoPDF from './components/PedidoPDF.vue'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const pedidoSelecionadoParaPDF = ref(null)
const pdfRef = ref(null)

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

const filtros = ref({
  status: '',
  dataInicio: '',
  dataFim: '',
  termoBusca: ''
})

const router = useRouter()

const pedidoStore = usePedidoStore()
const { formatarDocumento } = useFormatarDocumento()

// Colunas da Tabela
const columns = [
  { name: 'idOrdem', label: 'Pedido', field: 'idOrdem', sortable: true, align: 'left' },
  { name: 'cliente', label: 'Cliente', field: 'nomeCliente', sortable: true, align: 'left' },
  { name: 'cpfCnpj', label: 'CPF/CNPJ', field: row => formatarDocumento(row.cpfCnpjCliente), sortable: true, align: 'left' },
  { name: 'placa', label: 'Placa', field: row => row.veiculo?.placa, sortable: true, align: 'left' },
  { name: 'modelo', label: 'Modelo', field: row => row.veiculo?.modelo, sortable: true, align: 'left' },
  { name: 'tipoProposta', label: 'Tipo Proposta', field: 'tipoProposta', sortable: true, align: 'center' },
  {
    name: 'dtVencimentoOrcamento',
    label: 'Vencimento',
    field: row => row.dtVencimentoOrcamento || '',
    format: val => {
      if (!val) return ' - '
      const parsed = new Date(`${val}T00:00:00`)
      return isNaN(parsed) ? ' - ' : date.formatDate(parsed, 'DD/MM/YYYY')
    },
    sortable: true,
    align: 'center'
  },
  { name: 'status', label: 'Status', field: 'statusPedido', sortable: true, align: 'center' },
  { name: 'formaPagamento', label: 'Pagamento', field: 'formaPagamento', sortable: true, align: 'center' },
  { name: 'dataCadastro', label: 'Data de Cadastro', field: row => row.dtCadastro,
  format: val => {
    const parsed = new Date(val + 'T00:00:00') // Força UTC neutro
    return date.formatDate(parsed, 'DD/MM/YYYY')
  }, sortable: true, align: 'left' },
  { field: 'actions', name: 'actions', label: 'Ações', align: 'center', style: 'width: 20%'},
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

const abaSelecionada = ref('todos')

const pedidosFiltradosPorAba = computed(() => {
  return rowsFiltrados.value.filter(pedido => {
    if (abaSelecionada.value === 'todos') return true
    if (abaSelecionada.value === 'aguardando') return pedido.statusPedido === 'Aguardando Autorização'
    if (abaSelecionada.value === 'execucao') return pedido.statusPedido === 'Em Execução'
    if (abaSelecionada.value === 'finalizado') return pedido.statusPedido === 'Finalizado'
    return true
  })
})

const rowsFiltrados = computed(() => {
  return pedidoStore.pedidos.filter(pedido => {
    const statusOk = !filtros.value.status || pedido.statusPedido === filtros.value.status

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
  ).onOk(async () => {
      const response = await atualizarOrcamentoParaPedido(idPedido)
      if (response.status === 204) {
        notifySuccess('Orçamento convertido para Pedido com sucesso!')
      }
      await carregarTodasAsOrdensDoEstabelecimento()
    })

  } else {
    notifyError(`Não foi possível converter o pedido ${idPedido}`)
  }
}

const exportarPDF = async (pedido) => {
  try {
    console.log('Dados do pedido:', JSON.stringify(pedido, null, 2)); // Log para verificar os dados
    pedidoSelecionadoParaPDF.value = pedido;

    // Aguarda a renderização do DOM
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 500)); // Pequeno atraso para garantir renderização

    if (!pdfRef.value) {
      console.error('pdfRef não está definido ou não está montado no DOM.');
      return;
    }

    const element = pdfRef.value.$el || pdfRef.value;

    if (!element) {
      console.error('Elemento para captura está nulo ou indefinido.');
      return;
    }

    // Configurações do html2canvas para capturar todo o conteúdo
    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a qualidade
      useCORS: true, // Para carregar imagens externas (como o logo)
      logging: true, // Para depuração
      width: element.scrollWidth, // Captura toda a largura
      height: element.scrollHeight, // Captura toda a altura
      windowWidth: element.scrollWidth, // Garante que o conteúdo não seja cortado
      windowHeight: element.scrollHeight,
    });

    // Opcional: Visualize o canvas para depuração
    const imgData = canvas.toDataURL('image/png');
    console.log('Canvas gerado:', imgData);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    // Adiciona o conteúdo em várias páginas, se necessário
    let position = 0;
    while (position < imgHeight) {
      pdf.addImage(imgData, 'PNG', 0, -position, pdfWidth, imgHeight);
      position += pdfHeight;
      if (position < imgHeight) {
        pdf.addPage();
      }
    }

    pdf.save(`pedido-${pedido.idOrdem}.pdf`);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
  }
}

const editarPedido = (pedido) => {
  router.push({ name: 'editar-pedido', params: { id: pedido.idOrdem } })
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

onMounted(async() => {
  await carregarTodasAsOrdensDoEstabelecimento()
  console.log('****', pedidoStore.pedidos)
  }
)
</script>

<style scoped>
.hidden {
  position: absolute;
  top: -9999px;
  left: -9999px;
  width: 210mm; /* A4 width */
  background: white;
  padding: 20px;
}
</style>
