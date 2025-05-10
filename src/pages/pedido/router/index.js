const PedidoListaPage = import('../ListarPedidoPage.vue')
const CriarPedidoPage = import('../CriarPedidoPage.vue')
const OrcamentoAvulsoPage = import('../OrcamentoAvulsoPage.vue')

export default [
  { path: '/pedidos', name: 'pedidos', component: () =>  PedidoListaPage},
  { path: '/pedidos/criar', name: 'criar-pedido', component: () =>  CriarPedidoPage},
  { path: '/pedidos/orcamento', name: 'criarOrcamentoAvulso', component: () =>  OrcamentoAvulsoPage}
]
