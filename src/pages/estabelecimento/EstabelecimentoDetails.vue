<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="activeTab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab name="detalhes" label="Detalhes do Estabelecimento" />
      <q-tab name="plano" label="Plano" />
    </q-tabs>

    <q-tab-panels v-model="activeTab" animated>
      <!-- Aba de Detalhes do Estabelecimento -->
      <q-tab-panel name="detalhes">
        <q-card class="establishment-details">
          <q-card-section>
            <div class="text-h5">Detalhes do Estabelecimento</div>
          </q-card-section>

          <q-card-section class="q-pb-lg">
            <div class="row q-mb-md">
              <q-avatar size="100px" class="q-mr-md">
                <img
                  :src="estabelecimentoStore.estabelecimento.logo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMFZPmbYdm1bx3zOLIccsFGbjtOBP2ahDmjg&s'"
                  alt="Logo da Empresa"
                >
              </q-avatar>
            </div>

            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Nome Fantasia</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ estabelecimentoStore.estabelecimento.nomeFantasia }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Razão Social</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ estabelecimentoStore.estabelecimento.razao }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>CPF/CNPJ</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ formatCpfCnpj(estabelecimentoStore.estabelecimento.cpfCnpj) }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Endereço</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ estabelecimentoStore.estabelecimento.endereco?.logradouro }}<br>
                    {{ estabelecimentoStore.estabelecimento.endereco?.cidade }} - {{ estabelecimentoStore.estabelecimento.endereco?.estado }}
                    {{ estabelecimentoStore.estabelecimento.endereco?.cep }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Telefones</q-item-label>
                  <q-list>
                    <q-item
                      v-for="(telefone, index) in estabelecimentoStore.estabelecimento.contatos"
                      :key="index"
                    >
                      <q-item-section>
                        <q-item-label>{{ formatTelefone(telefone) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </q-tab-panel>

      <!-- Aba de Plano -->
      <q-tab-panel name="plano">
        <q-card class="plan-details">

          <q-card-section>
            <div class="text-h5">Detalhes do Plano</div>
          </q-card-section>

          <q-card-section class="q-pb-lg">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Plano Atual</q-item-label>
                  <q-item-label class="text-weight-medium">
                    <q-chip :color="planStatusColor" text-color="white" size="sm">
                      {{ estabelecimentoStore.estabelecimento.periodoTeste ? 'Teste' : estabelecimentoStore.estabelecimento.plano }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="isTrial">
                <q-item-section>
                  <q-item-label caption>Período de Teste</q-item-label>
                  <q-item-label class="text-weight-medium">
                    Finaliza em: {{ formatDate(estabelecimentoStore.estabelecimento.dataFinalTeste) }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="upgrade-section q-mt-md">
              <q-select
                v-model="selectedPlan"
                :options="planoStore.planos"
                label="Selecione um novo plano"
                option-label="descricao"
                option-value="nome"
                filled
                class="q-mb-md"
              />

              <div class="plan-details" v-if="selectedPlan">
                <q-list bordered class="rounded-borders">
                  <q-item>
                    <q-item-section>
                      <q-item-label>Preço</q-item-label>
                      <q-item-label caption>{{ selectedPlan.preco }}/mês</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label>Benefícios</q-item-label>
                      <q-item-label caption>Pode ter até {{ selectedPlan.totalUsuario }} usuários cadastrados</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <q-btn
                color="primary"
                :label="isTrial ? 'Enviar Proposta' : 'Fazer Upgrade'"
                class="q-mt-md full-width"
                :disable="!selectedPlan"
                @click="handlePlanAction"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useEstabelecimentoStore } from 'src/stores/estabelecimento.store'
import { estabelecimentoService } from './services/estabelecimento_service'
import { planoService } from '../planos/services/plano_service'
import { usePlanoStore } from 'src/stores/plano.store'

const $q = useQuasar()
const estabelecimentoStore = useEstabelecimentoStore()
const planoStore = usePlanoStore()
const { carregarEstabelecimento } = estabelecimentoService()
const { carregarPlanos, atualizarPlano, enviarProposta } = planoService()

const activeTab = ref('detalhes')
const selectedPlan = ref(null)

const isTrial = computed(() => {
  return estabelecimentoStore.estabelecimento.periodoTeste ? 'teste' : estabelecimentoStore.estabelecimento.plano
})

const planStatusColor = computed(() => {
  return !estabelecimentoStore.estabelecimento.periodoTeste ? 'positive' : 'negative'
})

const handlePlanAction = () => {
  if (isTrial.value) {
    sendProposal()
  } else {
    upgradePlan()
  }
}

const sendProposal = () => {
  $q.dialog({
    title: 'Enviar Proposta',
    message: `Deseja enviar uma proposta para o plano ${selectedPlan.value.descricao}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    await enviarProposta({ plano: selectedPlan.value.nome })
    $q.notify({
      type: 'positive',
      message: 'Proposta enviada com sucesso!'
    })
    selectedPlan.value = null
  })
}

const upgradePlan = () => {
  $q.dialog({
    title: 'Confirmar Upgrade',
    message: `Deseja fazer upgrade para o ${selectedPlan.value.descricao}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    $q.notify({
      type: 'positive',
      message: 'Plano atualizado com sucesso!'
    })
    await atualizarPlano({ novoPlano: selectedPlan.value.nome })
    await carregarEstabelecimento()
    selectedPlan.value = null
  })
}

const formatTelefone = (telefone) => {
  if (!telefone) return 'Telefone não informado'
  const cleaned = telefone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return telefone
}

const formatCpfCnpj = (value) => {
  if (!value) return ''
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

onMounted(async () => {
  await carregarEstabelecimento()
  await carregarPlanos()
})
</script>

<style scoped>
.establishment-details,
.plan-details {
  min-height: 300px;
}

@media (min-width: 1024px) {
  .establishment-details,
  .plan-details {
    margin-bottom: 0;
  }

  .q-page {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
}

.plan-details {
  margin-top: 16px;
}
</style>
