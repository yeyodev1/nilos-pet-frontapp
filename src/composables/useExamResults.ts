import { computed, ref } from 'vue'
import { examResultService } from '@/services/examResult.service'
import type { ApiError, ExamResult } from '@/types'

/** Consulta de resultados por cédula: solo dígitos, entre 6 y 13. */
export function useExamResults() {
  const documentId = ref('')
  const results = ref<ExamResult[]>([])
  const status = ref<'idle' | 'loading' | 'done' | 'error'>('idle')
  const errorMessage = ref('')

  const isValid = computed(() => /^\d{6,13}$/.test(documentId.value))
  const showHint = computed(() => documentId.value.length > 0 && !isValid.value)

  /** Deja pasar solo dígitos, aunque peguen la cédula con puntos o guiones. */
  function sanitize() {
    documentId.value = documentId.value.replace(/\D/g, '').slice(0, 13)
  }

  async function search() {
    if (!isValid.value || status.value === 'loading') return
    status.value = 'loading'
    errorMessage.value = ''
    try {
      results.value = await examResultService.getByDocumentId(documentId.value)
      status.value = 'done'
    } catch (e) {
      status.value = 'error'
      errorMessage.value = (e as ApiError).message
    }
  }

  return { documentId, results, status, errorMessage, isValid, showHint, sanitize, search }
}
