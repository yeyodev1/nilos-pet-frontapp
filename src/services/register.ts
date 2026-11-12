import APIBase from './httpBase'
import type { SessionUser } from '@/types'

export interface RegisterInput {
  name: string
  email: string
  phone: string
  password: string
  pet: { name: string; age: string; species: string; breed: string }
}

class RegisterService extends APIBase {
  async register(input: RegisterInput): Promise<{ token: string; user: SessionUser }> {
    const { data } = await this.post<{ token: string; user: SessionUser }>('auth/register', input)
    return data
  }
}

export const registerService = new RegisterService()
