<template>
  <div ref="pdfContent" class="pdf-page">
    <!-- Header -->
    <div class="row items-center q-mb-xs justify-center">
      <div class="col-auto">
        <img src="../../../assets/logo.jpeg" style="height: 60px; width: auto; vertical-align: middle;" alt="AutoRevise Logo" />
      </div>
      <div class="col q-ml-sm">
        <h5 class="q-my-xs text-primary text-weight-bold header-title" style="line-height: 1.2;">AutoRevise Oficina</h5>
        <div class="header-text" style="line-height: 1.2;">Av. Principal, 123 - Centro</div>
        <div class="header-text" style="line-height: 1.2;">Telefone: (99) 99999-9999 | WhatsApp: (99) 98888-8888</div>
        <div class="header-text" style="line-height: 1.2;">Email: contato@autorevise.com</div>
      </div>
    </div>

    <!-- ORÇAMENTO -->
    <h5 class="orcamento-title q-mt-xs q-mb-xs">ORÇAMENTO</h5>

    <!-- Cliente e Veículo -->
    <div class="q-mb-xs">
      <q-markup-table flat bordered dense class="custom-table" style="font-size: 10px;">
        <thead>
          <tr class="bg-black text-white">
            <th colspan="3">DADOS DO CLIENTE E VEÍCULO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colspan="2">
              <strong style="font-size: 7px; margin: 0; line-height: 1.5; display: block;">Nome</strong>
              <span style="display: block; margin: 0; line-height: 1.5;">{{ pedido.nomeCliente || 'Não informado' }}</span>
            </td>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1.5; display: block;">CPF</strong>
              <span style="display: block; margin: 0; line-height: 1.5;">{{ pedido.cpfCnpjCliente || 'Não informado' }}</span>
            </td>
          </tr>
          <tr v-if="pedido.veiculo">
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1.5; display: block;">Placa</strong>
              <span style="display: block; margin: 0; line-height: 1.5;">{{ pedido.veiculo?.placa || 'Não informado' }}</span>
            </td>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1.5; display: block;">Modelo</strong>
              <span style="display: block; margin: 0; line-height: 1.5;">{{ pedido.veiculo?.modelo || 'Não informado' }}</span>
            </td>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1.5; display: block;">Marca</strong>
              <span style="display: block; margin: 0; line-height: 1.5;">{{ pedido.veiculo?.marca || 'Não informado' }}</span>
            </td>
          </tr>
          <tr>
            <td colspan="3" v-if="pedido.observacoes">
              <strong style="font-size: 7px; margin: 0; line-height: 1.5; display: block;">Observações</strong>
              <span style="display: block; margin: 0; line-height: 1.5;">{{ pedido.observacoes }}</span>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <!-- Produtos -->
    <section v-if="pedido.produtos?.length" class="q-mb-xs">
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
          <tr class="bg-black text-white">
            <th colspan="4">PRODUTOS</th>
          </tr>
          <tr class="bg-grey-3">
            <th>Descrição</th>
            <th class="text-center">Qtd.</th>
            <th class="text-right">Unitário</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="produto in pedido.produtos" :key="produto.idProduto">
            <td>{{ produto.descricao || 'Não informado' }}</td>
            <td class="text-center">{{ produto.quantidade || 0 }}</td>
            <td class="text-right">R$ {{ produto.precoUnitario?.toFixed(2) || '0,00' }}</td>
            <td class="text-right">R$ {{ (produto.precoUnitario * produto.quantidade)?.toFixed(2) || '0,00' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <!-- Serviços -->
    <section v-if="pedido.servicos?.length" class="q-mb-xs">
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
          <tr class="bg-black text-white">
            <th colspan="2">SERVIÇOS</th>
          </tr>
          <tr class="bg-grey-3">
            <th>Descrição</th>
            <th class="text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servico in pedido.servicos" :key="servico.idServico">
            <td>{{ servico.descricao || 'Não informado' }}</td>
            <td class="text-right">R$ {{ servico.valorServico?.toFixed(2) || '0,00' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <!-- Informações da Proposta -->
    <section class="q-mb-xs">
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
          <tr class="bg-black text-white">
            <th colspan="4">DADOS DA PROPOSTA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1; display: block;">Forma de Pagamento</strong>
              <span style="display: block; margin: 0; line-height: 1;">{{ pedido.formaPagamento || 'Não informado' }}</span>
            </td>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1; display: block;">Parcelas</strong>
              <span style="display: block; margin: 0; line-height: 1;">{{ pedido.formaPagamento?.toLowerCase().includes('cartão') ? (pedido.parcelas || 'Não informado') : '-' }}</span>
            </td>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1; display: block;">Desconto</strong>
              <span style="display: block; margin: 0; line-height: 1;">R$ {{ pedido.desconto?.toFixed(2) || '0,00' }}</span>
            </td>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1; display: block;">Valor da Proposta</strong>
              <span style="display: block; margin: 0; line-height: 1;" class="text-weight-bold">R$ {{ calcularTotal.toFixed(2) }}</span>
            </td>
          </tr>
          <tr>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1; display: block;">Data da Proposta</strong>
              <span style="display: block; margin: 0; line-height: 1;">{{ formatarData(pedido.dtCadastro) }}</span>
            </td>
            <td>
              <strong style="font-size: 7px; margin: 0; line-height: 1; display: block;">Total de dias da Proposta</strong>
              <span style="display: block; margin: 0; line-height: 1;">{{ pedido.diasValidade }} dias</span>
            </td>
            <td colspan="2">
              <strong style="font-size: 7px; margin: 0; line-height: 1; display: block;">Data de Vencimento da Proposta</strong>
              <span style="display: block; margin: 0; line-height: 1;">{{ formatarData(pedido?.dtVencimentoOrcamento) }}</span>
            </td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <!-- Validade
    <section v-if="pedido.tipoProposta === 'Orçamento' && pedido.diasValidade > 0" class="q-mb-xs">
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
          <tr class="bg-black text-white">
            <th>VALIDADE DO ORÇAMENTO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ pedido.diasValidade }} dias</td>
          </tr>
        </tbody>
      </q-markup-table>
    </section> -->

    <!-- Assinatura -->
    <div class="assinatura-container">
      <div class="row justify-center">
        <div class="col text-center">
          <div class="assinatura-linha"></div>
          <div style="margin-top: 2px; font-size: 10px;">{{pedido.responsavel}}</div>
        </div>
      </div>
    </div>

    <!-- Rodapé fixo -->
    <footer class="pdf-footer">
      <div class="row justify-content-center">
        <div class="col-6 text-left" style="display: flex; align-items: center;">
          <span>Pedido/orçamento gerado pela <b>AutoRevise PRO</b></span>
        </div>
        <div class="col-6 text-right" style="display: flex; align-items: center; justify-content: flex-end;">
          <img src="../../../assets/logo.jpeg" style="height: 20px; width: auto;" alt="AutoRevise Logo" />
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  pedido: Object,
});

const calcularTotal = computed(() => {
  const totalProdutos = props.pedido.produtos?.reduce((sum, p) => sum + (p.precoUnitario * p.quantidade || 0), 0) || 0;
  const totalServicos = props.pedido.servicos?.reduce((sum, s) => sum + (s.valorServico || 0), 0) || 0;
  const desconto = props.pedido.desconto || 0;
  return totalProdutos + totalServicos - desconto;
});

function formatarData(data) {
  if (!data) return 'Não informada';
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
}

// function formatarDataVencimento(data, diasValidade) {
//   if (!data || !diasValidade) return 'Não informado';
//   const d = new Date(data);
//   d.setDate(d.getDate() + diasValidade);
//   return d.toLocaleDateString('pt-BR');
// }
</script>

<style scoped>
.pdf-page {
  width: 595px;
  min-height: 842px;
  padding: 10px;
  background: white;
  font-family: Arial, sans-serif;
  font-size: 10px;
  color: #333;
  position: relative;
  box-sizing: border-box;
}

.header-title {
  font-size: 13px;
  margin-bottom: 2px;
}
.header-text {
  font-size: 9px;
  line-height: 1.2;
}
.orcamento-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: #000;
  margin-top: 4px;
  margin-bottom: 4px;
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 9px;
}
.custom-table th, .custom-table td {
  padding: 4px;
  border: 1px solid #ccc;
}
.custom-table th.bg-black {
  background-color: #000 !important;
  color: #fff !important;
  text-align: center;
}
.pdf-footer {
  position: absolute;
  bottom: 5px;
  width: calc(100% - 20px);
  font-size: 9px;
  color: #888;
  padding: 2px 0;
}
.pdf-footer a {
  color: #888;
  text-decoration: none;
  padding: 5px;
}
.assinatura-linha {
  border-top: 1px solid #000;
  width: 100%;
  margin-bottom: 2px;
}
.assinatura-container {
  position: absolute;
  bottom: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  z-index: 1;
}
</style>
