const ClienteListaPage = import('../ClienteListPage.vue')
const ClienteDetailPage = import('../ClienteDetailsPage.vue')

export default [
  { path: '/clientes', name: 'clientes', component: () =>  ClienteListaPage},
  { path: '/clientes/:id', name: 'clienteDetails', component: () =>  ClienteDetailPage},
]
