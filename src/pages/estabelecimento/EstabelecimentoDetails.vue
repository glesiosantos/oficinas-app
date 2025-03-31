<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Card de Detalhes -->
      <div class="col-12 col-lg-8">
        <q-card class="establishment-details full-height">
          <q-card-section>
            <div class="text-h5">Detalhes do Estabelecimento</div>
          </q-card-section>

          <!-- <q-avatar size="100px" class="q-mr-md">
            <img :src="estabelecimentoStore.estabelecimento.logo"
              alt="Logo da Empresa"
            >
          </q-avatar> -->

          <q-card-section class="q-pb-lg">
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

              <q-item>
                <q-item-section>
                  <q-item-label caption>Plano Atual</q-item-label>
                  <q-item-label class="text-weight-medium">
                    <q-chip
                    :color="planStatusColor"
                    text-color="white"
                    size="sm"
                    >
                      {{ estabelecimentoStore.estabelecimento.plano }}
                    </q-chip>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

      <!-- Card de Upgrade -->
      <div class="col-12 col-lg-4">
        <q-card class="plan-upgrade full-height">
          <q-card-section>
            <div class="text-h6">Atualizar Plano</div>
          </q-card-section>

          <q-card-section class="q-pb-lg">
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
              label="Fazer Upgrade"
              class="q-mt-md full-width"
              :disable="!selectedPlan"
              @click="upgradePlan"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref} from 'vue'
import { useQuasar } from 'quasar'
import { useEstabelecimentoStore } from 'src/stores/estabelecimento.store'
import { estabelecimentoService } from './services/estabelecimento_service'
import { planoService } from '../planos/services/plano_service'
import { usePlanoStore } from 'src/stores/plano.store'

const $q = useQuasar()
const estabelecimentoStore = useEstabelecimentoStore()
const planoStore = usePlanoStore()
const { carregarEstabelecimento } = estabelecimentoService()
const { carregarPlanos, atualizarPlano } = planoService()

const selectedPlan = ref(null)

const planStatusColor = computed(() => {
  return estabelecimentoStore.estabelecimento.plano  ? 'positive' : 'negative'
})

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
    await atualizarPlano({novoPlano: selectedPlan.value.nome})
    await carregarEstabelecimento()
    selectedPlan.value = null
  })
}

const formatTelefone = (telefone) => {
  if (!telefone) return 'Telefone não informado'
  const cleaned = telefone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3') // (11) 98765-4321
  } else if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3') // (11) 8765-4321
  }
  return telefone // Retorna como está se não puder formatar
}

const formatCpfCnpj = (value) => {
  if (!value) return ''
  const cleaned = value.replace(/\D/g, '')
  if (cleaned.length <= 11) {
    // CPF: 123.456.789-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }
  // CNPJ: 12.345.678/0001-90
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

onMounted(async() => {
  await carregarEstabelecimento()
  await carregarPlanos()
})

</script>

<style scoped>
.establishment-details,
.plan-upgrade {
  min-height: 300px; /* Altura mínima para consistência */
}

@media (min-width: 1024px) { /* lg breakpoint do Quasar */
  .full-height {
    height: 100%;
  }

  .establishment-details,
  .plan-upgrade {
    margin-bottom: 0;
  }

  .row {
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
}

.plan-details {
  margin-top: 16px;
}
</style>
