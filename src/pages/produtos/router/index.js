const ProdutoListPage = import('../ProdutoListPage.vue')
const ProdutoDetailsPage = import('../ProdutoDetailsPage.vue')

export default [
  { path: '/produtos', name: 'produtos', component: () =>  ProdutoListPage},
  { path: '/produtos/:id', name: 'produtoDetails', component: () =>  ProdutoDetailsPage}
]
