import APIBase from './httpBase'
import type { SessionUser } from '@/types'

export interface RegisterInput {
  name: string
  email: string
  phone: string
  password: string
}

/**
 * PENDIENTE DEL BACKEND: POST /auth/register todavía no existe en el backapp
 * (auth.routes.ts solo expone login, me y password). El contrato espeja al de
 * /auth/login — { token, user } — para que la vista quede lista sin cambios
 * cuando el endpoint se agregue.
 */
class RegisterService extends APIBase {
  async register(input: RegisterInput): Promise<{ token: string; user: SessionUser }> {
    const { data } = await this.post<{ token: string; user: SessionUser }>('auth/register', input)
    return data
  }
}

export const registerService = new RegisterService()
