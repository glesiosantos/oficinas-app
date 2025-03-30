const PedidoListaPage = import('../ListarPedidoPage.vue')
const CriarPedidoPage = import('../CriarPedidoPage.vue')
// const EditarOrcamentoPage = import('../EditarOrcamentoPage.vue')

export default [
  { path: '/pedidos', name: 'pedidos', component: () =>  PedidoListaPage},
  { path: '/pedidos/criar', name: 'criarPedido', component: () =>  CriarPedidoPage},
  // { path: '/pedidos/orcamento/:id', name: 'editarOrcamento', component: () =>  EditarOrcamentoPage}
]
