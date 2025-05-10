<template>
  <div class="column full-height relative-position">
    <!-- Cabeçalho -->
    <q-card-section class="bg-primary q-py-sm">
      <div class="row items-center no-wrap">
        <div class="text-h6">Detalhe do Pedido</div>
        <q-space />
        <q-btn flat round dense icon="close" @click="$emit('cancel')" />
      </div>
    </q-card-section>

    <!-- Conteúdo -->
    <q-card-section class="q-gutter-md">
      <!-- Dados do Cliente e Veículo -->
      <div>
        <div><strong>Cliente:</strong> {{ initialData?.nomeCliente }}</div>
        <div><strong>Veículo:</strong> {{ initialData?.placa }}</div>
        <div><strong>Status atual:</strong> {{ initialData?.statusOficina }}</div>
      </div>

      <!-- Lista de Produtos com checkbox -->
      <div v-if="initialData?.produtos?.length" class="q-mt-md">
        <div class="text-subtitle2 q-mb-sm">Produtos</div>
        <q-list bordered>
          <q-item v-for="produto in initialData.produtos" :key="produto.id" class="q-py-sm">
            <q-item-section side>
              <q-checkbox
                v-model="produtosSelecionados"
                :val="produto.id"
                color="accent"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ produto.descricao }}</q-item-label>
              <q-item-label caption>Qtd: {{ produto.quantidade }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Lista de Serviços -->
      <div v-if="initialData?.servicos?.length" class="q-mt-md">
        <div class="text-subtitle2 q-mb-sm">Serviços</div>
        <q-list bordered>
          <q-item
            v-for="servico in initialData.servicos"
            :key="servico.id"
            class="q-py-sm"

          >
            <q-item-section>
              <q-item-label>{{ servico.descricao }}</q-item-label>
              <q-item-label caption>{{ servico.detalhes || 'Sem detalhes' }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </div>

      <!-- Alterar Status -->
      <div class="q-mt-md">
        <q-select
          v-model="novoStatus"
          :options="statusDisponiveis"
          label="Alterar Status da Ordem"
          outlined
          color="accent"
          dense
        />
      </div>

      <!-- Campo de Pendência -->
      <div v-if="novoStatus === 'Pendente'" class="q-mt-sm">
        <q-input
          v-model="pendenciaDescricao"
          label="Descreva a pendência"
          type="textarea"
          outlined
          color="accent"
          dense
        />
      </div>
    </q-card-section>

    <!-- Ações -->
    <div class="fixed-bottom q-pa-sm bg-white" style="border-top: 1px solid #ccc;">
      <div class="row q-gutter-sm">
        <q-btn
          flat
          label="Cancelar"
          color="negative"
          class="col"
          @click="$emit('cancel')"
        />
        <q-btn
          flat
          label="Concluir Ordem"
          color="accent"
          class="col"
          @click="emitirSubmit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  initialData: Object,
  isEdit: Boolean
});

const emit = defineEmits(['cancel', 'submit']);

const produtosSelecionados = ref([])
const novoStatus = ref(null)
const pendenciaDescricao = ref('')

const statusDisponiveis = computed(() => {
  const todos = ['Aguardando', 'Em Andamento', 'Pendente', 'Concluído'];
  return todos.filter((s) => s !== props.initialData?.statusOficina);
})

function emitirSubmit() {
  const payload = {
    ...props.initialData,
    produtosSelecionados: produtosSelecionados.value,
    novoStatus: novoStatus.value,
    pendenciaDescricao: novoStatus.value === 'Pendente' ? pendenciaDescricao.value : null
  };
  emit('submit', payload)
}
</script>
