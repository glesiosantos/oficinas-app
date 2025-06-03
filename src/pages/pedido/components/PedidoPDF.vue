<template>
  <div ref="pdfContent" class="q-pa-md bg-white" style="width: 595px; font-family: Arial, sans-serif; font-size: 12px; color: #333;">
    <!-- Header with Logo and Company Details -->
    <div class="row items-start q-mb-md">
      <div class="col-auto">
        <img src="/logo-autorevise.png" style="height: 80px; width: auto;" alt="AutoRevise Logo" />
      </div>
      <div class="col q-ml-md">
        <h5 class="q-my-xs text-primary text-weight-bold">AutoRevise Oficina</h5>
        <div>Av. Principal, 123 - Centro</div>
        <div>Telefone: (99) 99999-9999 | WhatsApp: (99) 98888-8888</div>
        <div>Email: contato@autorevise.com</div>
      </div>
    </div>

    <!-- Cliente -->
    <div class="q-mb-sm">
      <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 11px;">Dados do Cliente</h6>
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
          <tr class="bg-grey-3">
            <th class="text-left">Campo</th>
            <th class="text-left">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">Nome</td>
            <td class="text-left">{{ pedido.nomeCliente || 'Não informado' }}</td>
          </tr>
          <tr>
            <td class="text-left">CPF</td>
            <td class="text-left">{{ pedido.cpfCliente || 'Não informado' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <!-- Veículo -->
    <div v-if="pedido.veiculo" class="q-mb-sm">
      <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 11px;">Dados do Veículo</h6>
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
          <tr class="bg-grey-3">
            <th class="text-left">Campo</th>
            <th class="text-left">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-left">Placa</td>
            <td class="text-left">{{ pedido.veiculo.placa || 'Não informado' }}</td>
          </tr>
          <tr>
            <td class="text-left">Modelo</td>
            <td class="text-left">{{ pedido.veiculo.modelo || 'Não informado' }}</td>
          </tr>
          <tr>
            <td class="text-left">Marca</td>
            <td class="text-left">{{ pedido.veiculo.marca || 'Não informado' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <!-- Produtos -->
    <div v-if="pedido.produtos?.length" class="q-mb-sm">
      <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 11px;">Produtos</h6>
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
          <tr class="bg-grey-3">
            <th class="text-left">Descrição</th>
            <th class="text-center">Quantidade</th>
            <th class="text-right">Preço Unitário</th>
            <th class="text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="produto in pedido.produtos" :key="produto.id">
            <td class="text-left">{{ produto.descricao || 'Não informado' }}</td>
            <td class="text-center">{{ produto.quantidade || 0 }}</td>
            <td class="text-right">R$ {{ produto.precoVenda ? produto.precoVenda.toFixed(2) : '0,00' }}</td>
            <td class="text-right">R$ {{ produto.precoVenda ? (produto.precoVenda * produto.quantidade).toFixed(2) : '0,00' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <!-- Serviços -->
    <div v-if="pedido.servicos?.length" class="q-mb-sm">
      <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 11px;">Serviços</h6>
      <q-markup-table flat bordered dense class="custom-table">
        <thead>
          <tr class="bg-grey-3">
            <th class="text-left">Descrição</th>
            <th class="text-right">Valor</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servico in pedido.servicos" :key="servico.id">
            <td class="text-left">{{ servico.descricao || 'Não informado' }}</td>
            <td class="text-right">R$ {{ servico.valor ? servico.valor.toFixed(2) : '0,00' }}</td>
          </tr>
        </tbody>
      </q-markup-table>
    </div>

    <!-- Pagamento -->
    <div class="q-mb-sm">
      <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 11px;">Formas de Pagamento</h6>
      <div>{{ pedido.formaPagamento || 'Não informado' }}</div>
    </div>

    <!-- Validade do Orçamento -->
    <div v-if="pedido.status === 'Orçamento'" class="q-mb-sm">
      <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 11px;">Validade do Orçamento</h6>
      <div>{{ pedido.validadeDias || 0 }} dias</div>
    </div>

    <!-- Total -->
    <div class="q-mt-md text-right text-weight-bold">
      <h5 class="text-primary" style="font-size: 14px;">Total: R$ {{ pedido.total ? pedido.total.toFixed(2) : '0,00' }}</h5>
    </div>

    <!-- Assinatura do Responsável -->
    <div class="q-mt-md text-center">
      <h6 class="text-weight-bold text-uppercase q-mb-xs" style="font-size: 11px;">Responsável pelo Pedido</h6>
      <div>{{ pedido.responsavel || 'Não informado' }}</div>
      <div class="q-mt-sm" style="border-top: 1px solid #333; width: 200px; margin: 0 auto;">
        Assinatura
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  pedido: Object,
})
</script>

<style scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
}
.custom-table th, .custom-table td {
  padding: 8px;
  border: 1px solid #ccc;
}
.custom-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}
.text-primary {
  color: #1976D2;
}
</style>
