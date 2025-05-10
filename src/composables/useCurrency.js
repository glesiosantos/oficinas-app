// src/composables/useCurrency.js
import { ref, computed } from 'vue'

export default function useCurrency(initialValue = 0) {
  const rawValue = ref(initialValue)

  const parseCurrency = (value) => {
    if (!value) return 0
    const cleanValue = value.toString().replace(/[^\d,]/g, '').replace(',', '.')
    return parseFloat(cleanValue) || 0
  }

  const formatToBRL = (value) => {
    if (value === null || value === undefined) return 'R$ 0,00'
    const num = typeof value === 'string' ? parseCurrency(value) : value
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(num)
  }

  const formattedValue = computed({
    get: () => formatToBRL(rawValue.value),
    set: (val) => {
      console.log('formattedValue setter chamado com:', val)
      const numericValue = parseCurrency(val)
      rawValue.value = numericValue
      console.log('rawValue atualizado para:', rawValue.value)
    }
  })

  return {
    rawValue,
    formattedValue,
    formatToBRL
  }
}
