import authRouter from '../pages/auth/router'
import estabelecimentoRouter from '../pages/estabelecimento/router'
import fornecedorRouter from '../pages/fornecedor/router'
import colaboradorRouter from '../pages/colaborador/router'
import clienteRouter from '../pages/clientes/router'
import pedidoRouter from '../pages/pedido/router'

const routes = [
  {
    path: '',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      ...authRouter
    ],
  },
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true }, // Todas as rotas filhas exigem autenticação
    children: [
      {
        path: '', // Raiz redireciona para dashboard
        name: 'dashboard',
        component: () => import('src/pages/dashboard/IndexPage.vue'),
      },
      ...estabelecimentoRouter,
      ...fornecedorRouter,
      ...colaboradorRouter,
      ...clienteRouter,
      ...pedidoRouter
    ],
  },

  // Rota 404 (catch-all)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
