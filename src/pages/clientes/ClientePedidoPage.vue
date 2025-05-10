<!-- src/pages/CadastrarPedido.vue -->
<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md" style="color: black">Novo Pedido/Orçamento</div>

    <!-- Cabeçalho com dados do cliente e veículo -->
    <div class="q-mb-md">
      <div class="text-h6 q-my-md">Dados do Cliente</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input v-model="cliente.nome" label="Nome do Cliente" outlined dense readonly input-style="color: black" />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="cliente.cpf" label="CPF/CNPJ" outlined dense readonly input-style="color: black" />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="veiculo.placa" label="Placa" outlined dense readonly input-style="color: black" />
        </div>
        <div class="col-12 col-md-6">
          <q-input v-model="veiculo.modelo" label="Modelo" outlined dense readonly input-style="color: black" />
        </div>
      </div>
    </div>

    <!-- Tipo de Documento -->
    <div class="q-mb-md">
      <q-radio v-model="tipoDocumento" val="Pedido" label="Pedido" style="color: black" />
      <q-radio v-model="tipoDocumento" val="Orçamento" label="Orçamento" style="color: black" />
    </div>

    <!-- Produtos -->
    <div class="q-mb-md">
      <div class="text-h6 q-my-md">Produtos</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-4">
          <q-select v-model="produtoSelecionado" :options="produtoOptions" label="Nome ou Referência" outlined dense use-input @filter="filterProdutos" @update:model-value="atualizarPrecoProduto" input-style="color: black" />
        </div>
        <div class="col-12 col-md-2">
          <q-input v-model.number="produtoQuantidade" label="Quantidade" type="number" outlined dense input-style="color: black" />
        </div>
        <div class="col-12 col-md-3">
          <q-input v-model.number="produtoPreco" label="Preço Unitário" type="number" step="0.01" outlined dense input-style="color: black" />
        </div>
        <div class="col-12 col-md-3">
          <q-btn color="primary" label="Adicionar" @click="adicionarProduto" :class="{'full-width': $q.screen.xs}" class="text-black"/>
        </div>
      </div>
      <q-table :rows="produtosAdicionados" :columns="columnsProdutos" row-key="referencia" class="q-mt-md">
        <template v-slot:body-cell-preco="props">
          <q-td :props="props">
            <span>{{ formatarReal(props.row.preco) }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            <span>{{ formatarReal(props.row.preco * props.row.quantidade) }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <q-btn flat icon="delete" @click="removerProduto(props.row.referencia)" style="color: black" />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Serviços -->
    <div class="q-mb-md">
      <div class="text-h6 q-my-md">Serviços</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-select v-model="servicoSelecionado" :options="servicoOptions" label="Nome do Serviço" outlined dense use-input @filter="filterServicos" @update:model-value="servicoBusca = servicoSelecionado?.nome || ''" input-style="color: black" />
        </div>
        <div class="col-12 col-md-2">
          <q-btn color="primary" label="Adicionar" @click="adicionarServico" :class="{'full-width': $q.screen.xs}" class="text-black" />
        </div>
      </div>
      <q-table :rows="servicosAdicionados" :columns="columnsServicos" row-key="nome" class="q-mt-md">
        <template v-slot:body-cell-preco="props">
          <q-td :props="props">
            <span>{{ formatarReal(props.row.preco) }}</span>
          </q-td>
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <q-btn flat icon="delete" @click="removerServico(props.row.nome)" style="color: black" />
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Subtotal, Desconto, Forma de Pagamento e Total -->
    <div class="q-mb-md total-container">
      <div class="text-h6 q-my-md">Forma de Pagamento</div>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-input
            v-model.number="descontoPercentual"
            label="Desconto (%)"
            type="number"
            step="0.01"
            min="0"
            max="100"
            outlined
            dense
            input-style="color: black"
          />
        </div>
        <div class="col-12 col-md-6">
          <q-select
            v-model="formaPagamento"
            :options="formasPagamentoOptions"
            label="Forma de Pagamento"
            outlined
            dense
            input-style="color: black"
            @update:model-value="atualizarParcelas"
          />
        </div>
        <div class="col-12 col-md-6" v-if="formaPagamento === 'Cartão de Crédito'">
          <q-select
            v-model="numeroParcelas"
            :options="parcelasOptions"
            label="Número de Parcelas"
            outlined
            dense
            input-style="color: black"
          />
        </div>
      </div>
      <div class="subtotal-row">
        <span class="subtotal-label">Subtotal:</span>
        <span class="subtotal-value">{{ formatarReal(subtotal) }}</span>
      </div>
      <div class="total-row">
        <span class="total-label">Total com desconto:</span>
        <span class="total-value">{{ formatarReal(totalComDesconto) }}</span>
      </div>
    </div>

    <!-- Botões de Ação -->
    <div class="q-mt-md row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-btn color="primary" label="Salvar" @click="salvarPedido" :class="{'full-width': $q.screen.xs}" class="text-black" />
      </div>
      <div class="col-12 col-md-6" v-if="tipoDocumento === 'Orçamento'">
        <q-btn color="green" label="Compartilhar no WhatsApp" @click="compartilharWhatsApp" :class="{'full-width': $q.screen.xs}" class="text-white" />
      </div>
    </div>

    <!-- Modal de Busca de Cliente -->
    <q-dialog v-model="dialogCliente" :maximized="isMobile">
      <q-card class="modal-cliente" :class="{ 'full-width': isMobile }">
        <q-card-section>
          <div class="text-h6" style="color: black">Buscar Cliente</div>
        </q-card-section>
        <q-card-section>
          <q-select v-model="buscaCliente" :options="clienteOptions" label="CPF/CNPJ ou Nome" outlined dense use-input @filter="filterClientes" @update:model-value="buscarCliente" input-style="color: black" class="q-mb-md" />
          <q-select v-model="veiculoSelecionado" :options="veiculosCliente" label="Selecione o Veículo" option-label="placa" outlined dense input-style="color: black" />
        </q-card-section>
        <q-card-actions align="right" :class="{ 'column': isMobile }">
          <q-btn flat label="Cancelar" v-close-popup class="full-width-mobile q-mb-sm-mobile text-black" />
          <q-btn color="primary" label="Confirmar" @click="confirmarCliente" v-close-popup :class="{'full-width': $q.screen.xs}" class="text-black" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'

const buscaCliente = ref('')
const veiculosCliente = ref([])
const veiculoSelecionado = ref(null)
const cliente = ref({ nome: 'GLESIO SANTOS DA SILVA', cpf: '9654817334' })
const veiculo = ref({ placa: 'LVW6815', modelo: 'GOL G3 2005 POWER 1.6' })
const tipoDocumento = ref('Pedido')
const produtoQuantidade = ref(1)
const produtoPreco = ref(0)
const produtosAdicionados = ref([])
const servicoBusca = ref('')
const servicosAdicionados = ref([])
const dialogCliente = ref(false)
const produtoSelecionado = ref(null)
const servicoSelecionado = ref(null)
const descontoPercentual = ref(0)
const formaPagamento = ref('Dinheiro')
const numeroParcelas = ref(1)

const isMobile = computed(() => window.innerWidth <= 600)

const clientesDB = [
  { cpf: '123.456.789-00', nome: 'João Silva', veiculos: [{ placa: 'ABC-1234', modelo: 'Gol G5' }, { placa: 'XYZ-5678', modelo: 'Civic' }] },
  { cpf: '98.765.432/0001-00', nome: 'Empresa XYZ', veiculos: [{ placa: 'DEF-5678', modelo: 'Fiorino' }] },
]
const produtosDB = [
  { referencia: 'P001', nome: 'Óleo Motor', preco: 50.00 },
  { referencia: 'P002', nome: 'Filtro de Ar', preco: 30.00 },
]
const servicosDB = [
  { nome: 'Troca de Óleo', preco: 100.00 },
  { nome: 'Alinhamento', preco: 80.00 },
]

const formasPagamentoOptions = ['Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Pix']
const parcelasOptions = Array.from({ length: 12 }, (_, i) => i + 1)

const clienteOptions = ref(clientesDB.map(c => ({ label: `${c.cpf} - ${c.nome}`, value: c.cpf })))
const produtoOptions = ref(produtosDB.map(p => ({ label: `${p.referencia} - ${p.nome}`, value: p.referencia })))
const servicoOptions = ref(servicosDB.map(s => ({ label: s.nome, value: s.nome })))

const columnsProdutos = [
  { name: 'referencia', label: 'Referência', field: 'referencia' },
  { name: 'nome', label: 'Nome', field: 'nome' },
  { name: 'quantidade', label: 'Quantidade', field: 'quantidade' },
  { name: 'preco', label: 'Preço Unitário', field: 'preco' },
  { name: 'total', label: 'Total', field: row => row.preco * row.quantidade },
  { name: 'acoes', label: 'Ações', field: 'acoes' },
]

const columnsServicos = [
  { name: 'nome', label: 'Nome', field: 'nome' },
  { name: 'preco', label: 'Preço', field: 'preco' },
  { name: 'acoes', label: 'Ações', field: 'acoes' },
]

const subtotal = computed(() => {
  const totalProdutos = produtosAdicionados.value.reduce((sum, p) => sum + (Number(p.preco) * Number(p.quantidade)), 0)
  const totalServicos = servicosAdicionados.value.reduce((sum, s) => sum + Number(s.preco), 0)
  return totalProdutos + totalServicos || 0
})

const totalComDesconto = computed(() => {
  const desconto = subtotal.value * (Number(descontoPercentual.value) / 100)
  return subtotal.value - desconto || 0
})

const filterClientes = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    clienteOptions.value = clientesDB
      .filter(c => c.cpf.toLowerCase().includes(needle) || c.nome.toLowerCase().includes(needle))
      .map(c => ({ label: `${c.cpf} - ${c.nome}`, value: c.cpf }))
  })
}

const buscarCliente = () => {
  const clienteEncontrado = clientesDB.find(c => c.cpf === buscaCliente.value?.value)
  if (clienteEncontrado) {
    cliente.value = { nome: clienteEncontrado.nome, cpf: clienteEncontrado.cpf }
    veiculosCliente.value = clienteEncontrado.veiculos
    veiculoSelecionado.value = null
    veiculo.value = { placa: '', modelo: '' }
  }
}

const confirmarCliente = () => {
  if (veiculoSelecionado.value) {
    veiculo.value = { ...veiculoSelecionado.value }
    dialogCliente.value = false
  }
}

const filterProdutos = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    produtoOptions.value = produtosDB
      .filter(p => p.referencia.toLowerCase().includes(needle) || p.nome.toLowerCase().includes(needle))
      .map(p => ({ label: `${p.referencia} - ${p.nome}`, value: p.referencia }))
  })
}

const atualizarPrecoProduto = () => {
  const produto = produtosDB.find(p => p.referencia === produtoSelecionado.value?.value)
  produtoPreco.value = produto ? Number(produto.preco) : 0
}

const adicionarProduto = () => {
  const produto = produtosDB.find(p => p.referencia === produtoSelecionado.value?.value)
  if (produto) {
    produtosAdicionados.value = [...produtosAdicionados.value, {
      ...produto,
      quantidade: Number(produtoQuantidade.value) || 1,
      preco: Number(produtoPreco.value) || produto.preco
    }]
    produtoSelecionado.value = null
    produtoQuantidade.value = 1
    produtoPreco.value = 0
  }
}

const removerProduto = (referencia) => {
  produtosAdicionados.value = produtosAdicionados.value.filter(p => p.referencia !== referencia)
}

const filterServicos = (val, update) => {
  update(() => {
    const needle = val.toLowerCase()
    servicoOptions.value = servicosDB
      .filter(s => s.nome.toLowerCase().includes(needle))
      .map(s => ({ label: s.nome, value: s.nome }))
  })
}

const adicionarServico = () => {
  const servico = servicosDB.find(s => s.nome === servicoSelecionado.value?.value)
  if (servico) {
    servicosAdicionados.value = [...servicosAdicionados.value, { ...servico, preco: Number(servico.preco) }]
    servicoSelecionado.value = null
  }
}

const removerServico = (nome) => {
  servicosAdicionados.value = servicosAdicionados.value.filter(s => s.nome !== nome)
}

const atualizarParcelas = () => {
  if (formaPagamento.value !== 'Cartão de Crédito') {
    numeroParcelas.value = 1
  }
}

const formatarReal = (valor) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
}

const salvarPedido = () => {
  const pedido = {
    numero: `00${Math.floor(Math.random() * 1000)}`,
    cliente: cliente.value.nome,
    placa: veiculo.value.placa,
    tipo: tipoDocumento.value,
    status: 'Pendente',
    data: new Date().toLocaleDateString('pt-BR'),
    produtos: produtosAdicionados.value,
    servicos: servicosAdicionados.value,
    subtotal: subtotal.value,
    descontoPercentual: descontoPercentual.value,
    formaPagamento: formaPagamento.value,
    numeroParcelas: formaPagamento.value === 'Cartão de Crédito' ? numeroParcelas.value : 1,
    total: totalComDesconto.value
  }
  console.log('Salvando pedido:', pedido)
}

const compartilharWhatsApp = () => {
  const mensagem = `Orçamento\nCliente: ${cliente.value.nome}\nVeículo: ${veiculo.value.placa} - ${veiculo.value.modelo}\n\nProdutos:\n${produtosAdicionados.value.map(p => `${p.nome} - ${p.quantidade}x ${formatarReal(p.preco)} = ${formatarReal(p.preco * p.quantidade)}`).join('\n')}\n\nServiços:\n${servicosAdicionados.value.map(s => `${s.nome} - ${formatarReal(s.preco)}`).join('\n')}\n\nSubtotal: ${formatarReal(subtotal.value)}\nDesconto: ${descontoPercentual.value}%\nTotal: ${formatarReal(totalComDesconto.value)}`
  const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`
  window.open(url, '_blank')
}
</script>

<style scoped>
.total-container {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
}

.subtotal-row, .total-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
  margin-top: 10px;
}

.subtotal-label, .total-label {
  flex-grow: 0;
}

.subtotal-value, .total-value {
  flex-grow: 1;
  text-align: right;
}

@media (min-width: 992px) {
  .subtotal-row, .total-row {
    justify-content: flex-end;
  }
  .subtotal-value, .total-value {
    min-width: 150px;
  }
}

@media (max-width: 600px) {
  .subtotal-row, .total-row {
    font-size: 1rem;
  }
}
</style>
