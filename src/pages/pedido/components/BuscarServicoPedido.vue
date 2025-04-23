<template>
  <q-page padding>
    <q-card>
      <q-card-section class="bg-primary text-white">
        <div class="row items-center no-wrap">
          <div class="text-h6">Buscar Serviço</div>
          <q-space />
          <q-btn flat round dense icon="close" @click="$emit('cancel')" />
        </div>
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="searchTerm"
          label="Buscar por Nome ou Referência"
          outlined
          dense
          clearable
          @update:model-value="searchServices"
        />
      </q-card-section>

      <q-card-section>
        <q-table
          :rows="searchResults"
          :columns="columns"
          row-key="id"
          dense
          :loading="loading"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">{{ props.row.name }}</q-td>
              <q-td key="reference" :props="props">{{ props.row.reference }}</q-td>
              <q-td key="price" :props="props">R$ {{ props.row.price.toFixed(2) }}</q-td>
              <q-td key="actions" :props="props">
                <q-btn
                  color="primary"
                  label="Selecionar"
                  dense
                  @click="$emit('select', props.row)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar();
const searchTerm = ref('');
const searchResults = ref([]);
const loading = ref(false);

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left' },
  { name: 'reference', label: 'Referência', field: 'reference', align: 'left' },
  { name: 'price', label: 'Preço', field: 'price', align: 'center' },
  { name: 'actions', label: 'Ações', field: 'actions', align: 'center' },
];

const searchServices = async () => {
  if (!searchTerm.value || searchTerm.value.length < 3) {
    searchResults.value = [];
    return;
  }

  try {
    loading.value = true;
    const response = null
    searchResults.value = response.data;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao buscar serviços.'+error,
    });
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

defineEmits(['select', 'cancel']);
</script>

<style scoped>
.q-card {
  min-width: 100%;
}
</style>
