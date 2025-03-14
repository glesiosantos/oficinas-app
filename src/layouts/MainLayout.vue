<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <q-btn-dropdown label="Adminitrador" flat>
          <q-list>
            <q-item clickable v-close-popup @click="router.push({ name: 'profile'})">
                <q-item-section>
                  <q-item-label>Perfil do usuário</q-item-label>
                </q-item-section>
            </q-item>
            <q-item clickable v-close-popup @click="sair">
                <q-item-section>
                  <q-item-label>Sair do Sistema</q-item-label>
                </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list>
          <q-item-label
            header
          >
            Essential Links
          </q-item-label>

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>

      <q-img
  class="absolute-top"
  src="https://wallpapers.com/images/featured/fundo-azul-liso-pxzqbyisuhs4gu7m.jpg"
  style="height: 180px"
>
  <!-- Logo da Empresa e Nome na mesma linha -->
  <div class="absolute-top row justify-center items-center q-px-md q-py-sm w-100 bg-transparent">
    <q-avatar size="60px" class="q-mr-md">
      <img
        src="https://img.freepik.com/vetores-premium/desenho-de-logotipo-bonito-e-unico-para-empresa-de-comercio-eletronico-e-varejo_1287271-14561.jpg?semt=ais_hybrid"
        alt="Logo da Empresa"
      >
    </q-avatar>
    <div class="text-weight-bold text-white text-h6">Auto Center para Teste</div>
  </div>

  <!-- Avatar do Usuário, Nome e Perfil na mesma linha -->
  <div class="absolute-bottom row items-center q-px-md q-pb-sm bg-transparent">
    <q-avatar size="40px" class="q-mr-sm">
      <img
        src="data:image/png;base64,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"
        alt="Avatar do Usuário"
      >
    </q-avatar>
    <div>
      <div class="text-weight-bold text-white">Glêsio Santos</div>
      <div class="text-white text-caption">PROPRIETÁRIO</div>
    </div>
  </div>
</q-img>

    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import { useRouter } from 'vue-router'
import { authService } from 'src/pages/auth/services/auth_service'
import useNotify from 'src/composables/useNotify'

const { logout } = authService()

const router = useRouter()
const { notifySuccess } = useNotify()

const linksList = [
  {
    title: 'Dashboard',
    caption: 'quasar.dev',
    icon: 'dashboard',
    route: {name: 'dashboard'}
  },
  {
    title: 'Fornecedores',
    caption: 'quasar.dev',
    icon: 'people',
    route: {name: 'fornecedores'}
  },
  {
    title: 'Colaboradores',
    caption: 'quasar.dev',
    icon: 'people',
    route: {name: 'colaboradores'}
  },
]

const sair = () => {
  logout()
  notifySuccess('Logout realizado!')
  router.replace({ name: 'login'})
}

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
