import authRouter from '../pages/auth/router';

const routes = [
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      ...authRouter
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true }, // Todas as rotas filhas exigem autenticação
    children: [
      {
        path: '', // Raiz redireciona para dashboard
        name: 'dashboard',
        component: () => import('pages/IndexPage.vue'),
      },
    ],
  },

  // Rota 404 (catch-all)
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
