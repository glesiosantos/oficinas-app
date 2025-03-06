import { useQuasar } from "quasar";

export default function useNotify() {
  const $q = useQuasar()

  const notfifySucess = (message) => $q.notify({
    type: 'positive',
    message
  })

  const notfifyError = (message) => $q.notify({
    type: 'negative',
    message: message || 'Failed!'
  })

  const notfifyWarning = (message) => $q.notify({
    type: 'warning',
    message: message || 'Warning!'
  })


  return { notfifySucess, notfifyError, notfifyWarning }

}
