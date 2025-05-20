import { defineStore } from "pinia"
import { ref } from "vue"

export const useVeiculoStore = defineStore('veiculoStore', () => {

  const veiculos = ref([])

  const setVeiculos = (data) => veiculos.value = data

  const buscarPorPlaca = (placa) => {
    if (!placa) return null;
    const veiculo = this.veiculos.find(
      (v) => v.placa === placa
    )
    return veiculo || null; // Return the matching vehicle or null if not found
  }

  return { veiculos, setVeiculos, buscarPorPlaca }
})
