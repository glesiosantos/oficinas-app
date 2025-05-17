<template>
  <q-page padding style="min-height: 100vh;">
    <q-card flat bordered class="list-card flex-grow">
      <!-- Cabeçalho -->
      <q-card-section class="bg-accent text-white q-py-sm">
        <div class="text-h6">Clientes do estabelecimento</div>
      </q-card-section>
      <q-tabs
        v-model="activeTab"
        dense
        class="text-primary"
        active-color="accent"
        indicator-color="accent"
        align="left"
        narrow-indicator
      >
        <q-tab name="dados" label="Dados do Estabelecimento" />
        <q-tab name="especialidades" label="Especialidades" />
        <q-tab name="mensalidades" label="Mensalidades" />
        <q-tab name="plano" label="Atualizar de Plano" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="activeTab" animated>
        <q-tab-panel name="dados">
          <!-- Conteúdo dos dados do estabelecimento -->
          <div class="q-pa-md">
            <q-input filled label="Nome da Oficina" v-model="dados.nome" />
            <q-input filled label="CNPJ" v-model="dados.cnpj" />
            <q-input filled label="Endereço" v-model="dados.endereco" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="especialidades">
          <div class="q-pa-md">

            <!-- Carro -->
            <div class="text-h6 q-mb-sm">Especialidades de Carro</div>
            <div class="row q-col-gutter-sm">
              <div class="col-6" v-for="(item, index) in especialidadesCarro" :key="'carro-' + index">
                <q-checkbox
                  color="accent"
                  v-model="dados.especialidadesCarro"
                  :label="item.label"
                  :val="item.value"
                />
              </div>
            </div>

            <!-- Moto -->
            <div class="text-h6 q-mt-lg q-mb-sm">Especialidades de Moto</div>
            <div class="row q-col-gutter-sm">
              <div class="col-6" v-for="(item, index) in especialidadesMoto" :key="'moto-' + index">
                <q-checkbox
                  color="accent"
                  v-model="dados.especialidadesMoto"
                  :label="item.label"
                  :val="item.value"
                />
              </div>
            </div>

          </div>
        </q-tab-panel>

        <q-tab-panel name="mensalidades">
          <!-- Lista de mensalidades -->
          <div class="q-pa-md">
            <q-table
              title="Mensalidades"
              :rows="mensalidades"
              :columns="colunasMensalidade"
              row-key="id"
            />
          </div>
        </q-tab-panel>

        <q-tab-panel name="plano">
          <!-- Atualização de plano -->
          <div class="q-pa-md">
            <q-select
              filled
              v-model="planoSelecionado"
              :options="planosDisponiveis"
              label="Escolha um novo plano"
            />
            <q-btn
              label="Atualizar Plano"
              color="primary"
              class="q-mt-md"
              @click="atualizarPlano"
            />
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

const activeTab = ref('dados');

const dados = ref({
  nome: '',
  cnpj: '',
  endereco: '',
  especialidadesCarro: [],
  especialidadesMoto: [],
});

const especialidadesCarro = [
  { label: 'Mecânica Geral', value: 'carro-mecanica' },
  { label: 'Elétrica', value: 'carro-eletrica' },
  { label: 'Ar-condicionado', value: 'carro-ar' },
  { label: 'Suspensão', value: 'carro-suspensao' },
  { label: 'Alinhamento', value: 'carro-alinhamento' },
  { label: 'Freios', value: 'carro-freios' },
];

const especialidadesMoto = [
  { label: 'Mecânica de Moto', value: 'moto-mecanica' },
  { label: 'Elétrica de Moto', value: 'moto-eletrica' },
  { label: 'Troca de Óleo', value: 'moto-oleo' },
  { label: 'Freios de Moto', value: 'moto-freios' },
  { label: 'Pneus e Rodas', value: 'moto-pneus' },
  { label: 'Suspensão de Moto', value: 'moto-suspensao' },
];

const mensalidades = ref([
  { id: 1, mes: 'Abril/2025', valor: 'R$ 99,00', status: 'Paga' },
  { id: 2, mes: 'Maio/2025', valor: 'R$ 99,00', status: 'A Vencer' },
]);

const colunasMensalidade = [
  { name: 'mes', label: 'Mês', field: 'mes' },
  { name: 'valor', label: 'Valor', field: 'valor' },
  { name: 'status', label: 'Status', field: 'status' },
];

const planosDisponiveis = [
  'Básico',
  'Intermediário',
  'Profissional',
];

const planoSelecionado = ref('');

function atualizarPlano() {
  // Aqui você pode disparar a API ou lógica para atualizar o plano
  console.log('Novo plano selecionado:', planoSelecionado.value);
}
</script>
