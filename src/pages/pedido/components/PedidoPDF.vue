<template>
  <div ref="pdfContent" class="pdf-page">
    <!-- Header -->
    <div class="row items-start q-mb-xs">
      <div class="col-auto">
        <img src="/logo-autorevise.png" style="height: 50px; width: auto;" alt="AutoRevise Logo" />
      </div>
      <div class="col q-ml-sm">
        <h5 class="q-my-xs text-primary text-weight-bold header-title">AutoRevise Oficina</h5>
        <div class="header-text">Av. Principal, 123 - Centro</div>
        <div class="header-text">Telefone: (99) 99999-9999 | WhatsApp: (99) 98888-8888</div>
        <div class="header-text">Email: contato@autorevise.com</div>
      </div>
    </div>

    <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 14px;">Orçamento</h6>
    <!-- Cliente -->
   <div class="q-mb-xs">
      <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 11px;">Dados do Cliente e Veículo</h6>
      <q-markup-table flat bordered dense class="custom-table" style="font-size: 11px;">
        <tbody>
          <tr>
            <td class="text-left"><strong>CPF:</strong> {{ pedido.cpfCliente || 'Não informado' }}</td>
            <td class="text-left"><strong>Nome:</strong> {{ pedido.nomeCliente || 'Não informado' }}</td>
          </tr>
          <tr>
            <td class="text-left"><strong>Placa:</strong> {{ pedido.veiculo?.placa || 'Não informado' }}</td>
            <td class="text-left"><strong>Modelo:</strong> {{ pedido.veiculo?.modelo || 'Não informado' }}</td>
            <td class="text-left"><strong>Marca:</strong> {{ pedido.veiculo?.marca || 'Não informado' }}</td>
          </tr>
          <tr>
            <td class="text-left"><strong>Data da Proposta:</strong> {{ formatarData(pedido.dataProposta) }}</td>
            <td class="text-left"><strong>Vencimento:</strong> {{ formatarData(pedido.dataVencimento) }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <!-- Produtos -->
    <section v-if="pedido.produtos?.length" class="q-mb-xs">
      <h6 class="section-title">Produtos</h6>
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
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
      <h6 class="section-title">Serviços</h6>
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
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

    <!-- Pagamento -->
    <section class="q-mb-xs">
      <h6 class="section-title">Informações de Pagamento</h6>
      <q-markup-table flat bordered dense class="custom-table">
        <tbody>
          <tr>
            <td>Forma de Pagamento</td>
            <td>{{ pedido.formaPagamento || 'Não informado' }}</td>
          </tr>
          <tr v-if="pedido.formaPagamento?.toLowerCase().includes('cartão')">
            <td>Parcelas</td>
            <td>{{ pedido.parcelas || 'Não informado' }}</td>
          </tr>
          <tr>
            <td>Desconto</td>
            <td>R$ {{ pedido.desconto?.toFixed(2) || '0,00' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </section>

    <!-- Validade -->
    <section v-if="pedido.tipoProposta === 'Orçamento' && pedido.diasValidade > 0" class="q-mb-xs">
      <h6 class="section-title">Validade do Orçamento</h6>
      <div>{{ pedido.diasValidade }} dias</div>
    </section>

    <!-- Total -->
    <section class="q-mt-xs text-right">
      <h5 class="text-primary total-text">Total: R$ {{ calcularTotal.toFixed(2) }}</h5>
    </section>

    <!-- Assinatura -->
    <div class="q-mt-lg q-pt-lg">
      <div style="height: 60px;"></div>
      <div class="row justify-center">
        <div class="col-6 text-center">
          <div style="border-top: 1px solid #000; margin-top: 10px;"></div>
          <div style="font-size: 10px;">Assinatura do Responsável pela Proposta</div>
        </div>
      </div>
    </div>

    <!-- Rodapé fixo -->
    <footer class="pdf-footer">
      PDF gerado por <strong>autorevise.com.br</strong>
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
.section-title {
  font-size: 10px;
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.total-text {
  font-size: 13px;
  font-weight: bold;
}
.assinatura-linha {
  border-top: 1px solid #333;
  width: 180px;
  margin: 0 auto;
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
.custom-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
.pdf-footer {
  position: absolute;
  bottom: 10px;
  width: 100%;
  font-size: 9px;
  text-align: center;
  color: #888;
}
</style>
