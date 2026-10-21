import APIBase from './httpBase'
import type { ExamResult } from '@/types'

/** Resultados de exámenes: consulta pública por número de cédula. */
class ExamResultService extends APIBase {
  async getByDocumentId(documentId: string): Promise<ExamResult[]> {
    const { data } = await this.get<ExamResult[]>(
      `exam-results?documentId=${encodeURIComponent(documentId)}`,
    )
    return data
  }
}

export const examResultService = new ExamResultService()
