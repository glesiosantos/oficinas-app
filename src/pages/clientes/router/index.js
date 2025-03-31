const ClienteListaPage = import('../ClienteListPage.vue')
const ClienteDetailPage = import('../ClienteDetailsPage.vue')
const ClientPedidoPage = import('../ClientePedidoPage.vue')

export default [
  { path: '/clientes', name: 'clientes', component: () =>  ClienteListaPage},
  { path: '/clientes/:id', name: 'clienteDetails', component: () =>  ClienteDetailPage},
  { path: '/clientes/pedido/:id', name: 'clientePedido', component: () =>  ClientPedidoPage},
]
