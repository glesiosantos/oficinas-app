// src/composables/useDrawer.js
import { ref } from 'vue'

export function useDrawer() {
  const drawer = ref(false)
  const isEdit = ref(false)
  const currentData = ref(null)

  function openDrawer(mode, data = null) {
    isEdit.value = mode === 'edit'
    currentData.value = data ? { ...data } : null
    drawer.value = true
  }

  function closeDrawer() {
    drawer.value = false
    currentData.value = null
    isEdit.value = false
  }

  return {
    drawer,
    isEdit,
    currentData,
    openDrawer,
    closeDrawer
  }
}
