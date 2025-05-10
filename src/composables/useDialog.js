// composables/useConfirmDialog.js
import { ref } from 'vue'
import { useQuasar } from 'quasar'

export function useConfirmDialog() {
  const $q = useQuasar()
  const loading = ref(false)

  const confirm = async ({ title = 'Confirmar', message = 'Deseja continuar?', okLabel = 'Sim'} = {}) => {
    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        cancel: true,
        persistent: true,
        ok: {
          label: okLabel,
          color: 'primary'
        },
      }).onOk(() => resolve(true))
        .onCancel(() => resolve(false))
    })
  }

  return { confirm, loading }
}
