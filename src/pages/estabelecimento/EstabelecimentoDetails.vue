<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Card de Detalhes -->
      <div class="col-12 col-lg-8">
        <q-card class="establishment-details full-height">
          <q-card-section>
            <div class="text-h5">Detalhes do Estabelecimento</div>
          </q-card-section>

          <q-card-section class="q-pb-lg">
            <q-list>
              <q-item>
                <q-item-section>
                  <q-item-label caption>Nome Fantasia</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ establishment.tradeName }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Razão Social</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ establishment.companyName }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>CPF/CNPJ</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ establishment.document }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Endereço</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ establishment.address.street }}, {{ establishment.address.number }}<br>
                    {{ establishment.address.city }} - {{ establishment.address.state }}
                    {{ establishment.address.zipCode }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Contatos</q-item-label>
                  <q-item-label class="text-weight-medium">
                    Telefone: {{ establishment.contact.phone }}<br>
                    Email: {{ establishment.contact.email }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label caption>Plano Atual</q-item-label>
                  <q-item-label class="text-weight-medium">
                    {{ establishment.plan.name }}
                    <q-chip
                      :color="planStatusColor"
                      text-color="white"
                      size="sm"
                    >
                      {{ establishment.plan.status }}
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
            <div class="text-h6">Upgrade de Plano</div>
          </q-card-section>

          <q-card-section class="q-pb-lg">
            <q-select
              v-model="selectedPlan"
              :options="availablePlans"
              label="Selecione um novo plano"
              filled
              class="q-mb-md"
            />

            <div class="plan-details" v-if="selectedPlan">
              <q-list bordered class="rounded-borders">
                <q-item>
                  <q-item-section>
                    <q-item-label>Preço</q-item-label>
                    <q-item-label caption>{{ selectedPlan.price }}/mês</q-item-label>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <q-item-label>Benefícios</q-item-label>
                    <q-item-label caption>{{ selectedPlan.benefits }}</q-item-label>
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

<script>
import { defineComponent, ref, computed } from 'vue'
import { useQuasar } from 'quasar'

export default defineComponent({
  name: 'EstablishmentDetails',

  setup() {
    const $q = useQuasar()

    const establishment = ref({
      tradeName: 'Loja do João',
      companyName: 'João Comércio Ltda',
      document: '12.345.678/0001-90',
      address: {
        street: 'Rua Principal',
        number: '123',
        city: 'São Paulo',
        state: 'SP',
        zipCode: '01234-567'
      },
      contact: {
        phone: '(11) 98765-4321',
        email: 'contato@lojadojoao.com'
      },
      plan: {
        name: 'Plano Básico',
        status: 'Ativo'
      }
    })

    const availablePlans = ref([
      {
        label: 'Plano Pro',
        value: 'pro',
        price: 'R$ 99,90',
        benefits: 'Até 100 produtos, Suporte 24/7'
      },
      {
        label: 'Plano Empresarial',
        value: 'enterprise',
        price: 'R$ 199,90',
        benefits: 'Produtos ilimitados, Suporte prioritário, Relatórios avançados'
      }
    ])

    const selectedPlan = ref(null)

    const planStatusColor = computed(() => {
      return establishment.value.plan.status === 'Ativo' ? 'positive' : 'negative'
    })

    const upgradePlan = () => {
      $q.dialog({
        title: 'Confirmar Upgrade',
        message: `Deseja fazer upgrade para o ${selectedPlan.value.label}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        $q.notify({
          type: 'positive',
          message: 'Plano atualizado com sucesso!'
        })
        establishment.value.plan.name = selectedPlan.value.label
        selectedPlan.value = null
      })
    }

    return {
      establishment,
      availablePlans,
      selectedPlan,
      planStatusColor,
      upgradePlan
    }
  }
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
