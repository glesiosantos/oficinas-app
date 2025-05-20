const PedidoListaPage = import('../ListarPedidoPage.vue')
const CriarPedidoPage = import('../CriarPedidoPage.vue')
const PedidoOficinaListPage = import('../PedidoOficinaListPage.vue')

export default [
  { path: '/pedidos', name: 'pedidos', component: () =>  PedidoListaPage},
  { path: '/pedidos/criar', name: 'criar-pedido', component: () =>  CriarPedidoPage},
  { path: '/pedidos/editar/:id', name: 'editar-pedido', component: () =>  CriarPedidoPage},
  { path: '/pedidos/oficina', name: 'naOficina', component: () =>  PedidoOficinaListPage}
]
