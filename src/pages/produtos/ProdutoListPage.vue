<template>
  <q-page padding style="min-height: 100vh;">
    <q-card flat bordered class="list-card flex-grow">
      <!-- Cabeçalho -->
      <q-card-section class="bg-accent text-white q-py-sm">
        <div class="text-h6">Produtos do estabelecimento</div>
      </q-card-section>
      <div class="row">
        <q-card class="col-12 col-sm-12">
          <q-card-section>
            <q-table
              flat
              bordered
              :columns="columns"
              :rows="produtoStore.produtos"
              :pagination="{ rowsPerPage: 30 }"
              :filter="filter"
            >
              <template v-slot:top>
                <q-input outlined color="accent" v-model="filter" class="col-12" :class="{'full-width': $q.screen.xs}">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props" class="q-gutter-x-xs text-center">
                  <q-btn
                    round
                    dense
                    color="green"
                    size="md"
                    icon="visibility"
                    @click="visualizarProduto(props.row)"
                    title="Visualizar Produto"
                  />

                  <q-btn round dense color="accent" size="md" icon="edit" @click="openDrawer('edit', props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </q-card>
    <q-page-sticky :position="stickyPosition" :offset="[18, 18]">
        <div :class="layoutClass">
          <q-btn fab icon="add" title="Adicionar Produto" color="accent" @click="openDrawer('add')" />
        </div>
    </q-page-sticky>

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
import { produtoService } from './services/produto_service'
import { useProdutoStore } from 'src/stores/produto.store'
import useCalcularPrecoVendas from 'src/composables/usCalcularPrecoVenda'
import useCurrency from 'src/composables/useCurrency'
import { fornecedorService } from '../fornecedor/services/fornecedor_service'
import { useQuasar } from 'quasar'

const { drawer, openDrawer,closeDrawer, isEdit, currentData } = useDrawer()
const { notifyError, notifySuccess, notifyWarning } = useNotify()
const { carregarProdutosDoEstabelecimento, addProduto, editarProduto } = produtoService()
const { carregarFornecedores } = fornecedorService()
const {calcularPrecoVenda} = useCalcularPrecoVendas()
const {formatToBRL } = useCurrency()

const produtoStore = useProdutoStore()

const filter = ref('')
const router = useRouter()
const $q = useQuasar()

const columns = [
  { label: 'Código', field: row => row.codigoProduto, align: 'center'},
  { label: 'Descrição', field: row => row.descricao, align: 'left'},
  { label: 'Referência', field: row => row.referencia, align: 'left' },
  { label: 'Categoria', field: row => row.categoria, align: 'left' },
  { label: 'Valor de Venda',  field: row =>  formatToBRL(calcularPrecoVenda(row.valorCusto, row.percentualLucro)), sortable: true, align: 'center' },
  { label: 'Quant. Minima',  field: row => row.quantidadeMinimaEstoque, align: 'center'},
  { label: 'Quant. Atual',  field: row => row.quantidadeEstoque, align: 'center'},
  { label: 'Ações', field: 'actions', name: 'actions', align: 'center' }
]

const handleSubmit = async (formData) => {
  try {
    if (isEdit.value) {
      await editarProduto(formData)
      notifySuccess('Produto atualizado com sucesso!')
    } else {
      console.log('*** *** ', formData)
      await addProduto(formData)
      notifySuccess('Produto cadastrado com sucesso!')
    }
    await carregarProdutosDoEstabelecimento()
    await nextTick()
    closeDrawer()
  } catch (error) {
    console.log('error: ', error)
    if(error.status === 400) {
      notifyWarning(error.response.data.mensagem)
    } else {
      notifyError('Erro ao salvar produto: ' + (error.message || 'Erro desconhecido'))
    }
    await carregarProdutosDoEstabelecimento()
    await nextTick()
    closeDrawer()
  }
}

const visualizarProduto = (produto) => {
  router.push({name: 'produtoDetails', params: { id: produto.idProduto }})
}

onMounted(async () => {
  await carregarFornecedores()
  await carregarProdutosDoEstabelecimento()
})
</script>
