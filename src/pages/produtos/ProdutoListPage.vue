<template>
  <q-page padding>
    <div class="row">
      <q-card class="col-12 col-sm-12">
        <q-card-section>
          <q-table
            flat
            bordered
            :columns="columns"
            :rows="produtos"
            :filter="filter"
          >
            <template v-slot:top>
              <q-input outlined color="primary" v-model="filter" class="col-4" :class="{'full-width': $q.screen.xs}">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-space />
              <q-btn
                color="primary"
                class="text-black"
                label="Adicionar produto"
                @click="openDrawer('add')"
                :class="{'full-width q-mt-sm': $q.screen.xs}"/>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="q-gutter-x-xs text-center">
                <!-- <q-btn round dense color="primary text-black" size="md" @click="openDrawer('edit', props.row)" title="Adicionar um Carro">
                  <span class="material-symbols-outlined" style="font-size: 20px;">transportation</span>
                </q-btn> -->
                <q-btn
                  round
                  dense
                  color="green"
                  size="md"
                  icon="visibility"
                  @click="visualizarProduto(props.row)"
                  title="Visualizar Produto"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-drawer v-model="drawer" side="right" overlay elevated :width="400">
      <q-scroll-area class="fit">
        <produto-form
          v-if="drawer"
          :is-edit="isEdit"
          :initial-data="currentData"
          @submit="handleSubmit"
          @cancel="closeDrawer"
        />
      </q-scroll-area>
    </q-drawer>
  </q-page>
</template>
<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { useDrawer } from 'src/composables/useDrawer'

import ProdutoForm from './components/ProdutoForm.vue'
import useNotify from 'src/composables/useNotify'
import { useRouter } from 'vue-router'
import { marcaService } from '../marcas/services/marca_service'
import { fornecedorService } from '../fornecedor/services/fornecedor_service'
import { produtoService } from './services/produto_service'

const { drawer, openDrawer,closeDrawer, isEdit, currentData } = useDrawer()
const { notifyError, notifyWarning } = useNotify()
const { carregarMarcas, carregarModelosDasMarcas } = marcaService()
const { carregarFornecedores } = fornecedorService()
const { carregarProdutosDoEstabelecimento } = produtoService()

const filter = ref('')
const router = useRouter()
const produtos = ref([])

const columns = [
  { label: 'Cod. Produto', field: row => row.descricao, align: 'left'},
  { label: 'Descrição do produto', field: row => row.descricao, align: 'left'},
  { label: 'Referência', field: row => row.referencia, align: 'left' },
  { label: 'Categoria', field: row => row.categoria, align: 'left' },
  { label: 'Valor de Venda',  field: row => row.contatos, format: val => `${val}`, sortable: true, align: 'left' },
  { label: 'Total em estoque',  field: row => row.veiculos.length, align: 'center'},
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      console.log('**** ', formData)
    } else {
      console.log('**** ', formData)

    }
    await nextTick()
    closeDrawer()
  } catch (error) {

    if(error.response.data.status === 400) {
      notifyWarning(error.response.data.mensagem);
    } else {
      notifyError('Erro ao salvar cliente: ' + (error.message || 'Erro desconhecido'))
    }

    await nextTick()
    closeDrawer()
  }
}

const visualizarProduto = (produto) => {
  router.push({name: 'produtoDetails', params: { id: produto.idCliente }})
}

onMounted(async () => {
  await carregarMarcas()
  await carregarModelosDasMarcas()
  await carregarFornecedores()
  await carregarProdutosDoEstabelecimento()
})
</script>
