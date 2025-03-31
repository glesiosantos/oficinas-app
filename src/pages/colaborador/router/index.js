const ColaboradorListaPagePage = import('../ColaboradorListPage.vue')
const ColaboradorPerfilPage = import('../ColaboradorPerfilPage.vue')

export default [
  { path: '/colaboradores', name: 'colaboradores', component: () =>  ColaboradorListaPagePage},
  { path: '/colaborador-perfil', name: 'colaboradorPerfil', component: () =>  ColaboradorPerfilPage},
]
