<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { registerService } from '@/services/register'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()

const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  error.value = ''
  loading.value = true
  try {
    const { token, user } = await registerService.register({
      name: name.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim(),
      password: password.value,
    })
    userStore.setSession(token, user)
    toast.success(`Bienvenido, ${user.name || user.email}`)
    const next = typeof route.query.next === 'string' ? route.query.next : '/cuenta'
    router.replace(next)
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="register">
    <form class="register__card" @submit.prevent="submit">
      <p class="register__eyebrow">Bienvenido</p>
      <h1 class="register__title">Crear cuenta</h1>

      <div class="register__field">
        <label for="name">Nombre</label>
        <input id="name" v-model="name" type="text" autocomplete="name" required minlength="3" />
      </div>

      <div class="register__field">
        <label for="email">Correo</label>
        <input id="email" v-model="email" type="email" autocomplete="email" required />
      </div>

      <div class="register__field">
        <label for="phone">Teléfono</label>
        <input id="phone" v-model="phone" type="tel" autocomplete="tel" required minlength="7" />
      </div>

      <div class="register__field">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          required
          minlength="8"
        />
      </div>

      <Transition name="rise">
        <p v-if="error" class="register__error">
          <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
        </p>
      </Transition>

      <button class="btn btn--primary register__submit" type="submit" :disabled="loading">
        <i v-if="loading" class="fa-solid fa-spinner fa-spin"></i>
        {{ loading ? 'Creando cuenta…' : 'Crear cuenta' }}
      </button>

      <p class="register__alt">
        ¿Ya tienes cuenta?
        <RouterLink to="/login">Ingresar</RouterLink>
      </p>
    </form>
  </section>
</template>

<style scoped lang="scss">
.register {
  @include container(480px);
  @include flex(column, stretch, center);
  flex: 1;
  padding-block: $space-xl;

  &__card {
    @include card;
    @include flex(column, stretch, flex-start, 1rem);
    padding: 2.2rem 2rem;
    box-shadow: $shadow-sm;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 600);
    margin-bottom: 0.4rem;
  }

  &__error {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $danger;
    background: $danger-bg;
    padding: 0.7rem 0.9rem;
    border-radius: $radius-sm;
  }

  &__submit {
    margin-top: 0.4rem;
  }

  &__alt {
    font-size: $text-sm;
    color: $ink-soft;
    text-align: center;

    a {
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
    }
  }
}
</style>
