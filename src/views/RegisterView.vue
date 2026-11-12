<script setup lang="ts">
import { reactive, ref } from 'vue'
import { site } from '@/config/site'
import PawPrint from '@/components/ui/PawPrint.vue'
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
const lastName = ref('')
const pet = reactive({ name: '', age: '', species: '', breed: '' })
const consent = ref(false)
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
      name: `${name.value.trim()} ${lastName.value.trim()}`,
      pet: { ...pet },
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
    <span v-for="n in 6" :key="n" class="register__paw" aria-hidden="true"><PawPrint /></span>
    <form class="register__card" @submit.prevent="submit">
      <p class="register__eyebrow">Bienvenido</p>
      <h1 class="register__title">Crear cuenta</h1>

      <div class="register__pair">
        <div>
          <label for="name">Nombres</label>
          <input id="name" v-model="name" type="text" autocomplete="given-name" required />
        </div>
        <div>
          <label for="last-name">Apellidos</label>
          <input
            id="last-name"
            v-model="lastName"
            type="text"
            autocomplete="family-name"
            required
          />
        </div>
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

      <p class="register__eyebrow">Tu mascota</p>
      <div class="register__pair">
        <div>
          <label for="pet-name">Nombre</label>
          <input id="pet-name" v-model="pet.name" type="text" required />
        </div>
        <div>
          <label for="pet-age">Edad</label>
          <input id="pet-age" v-model="pet.age" type="text" required placeholder="Ej.: 3 años" />
        </div>
      </div>
      <div class="register__pair">
        <div>
          <label for="pet-species">Especie</label>
          <select id="pet-species" v-model="pet.species" required>
            <option value="" disabled>Elige</option>
            <option>Canino</option>
            <option>Felino</option>
            <option>Otro</option>
          </select>
        </div>
        <div>
          <label for="pet-breed">Raza</label>
          <input id="pet-breed" v-model="pet.breed" type="text" required />
        </div>
      </div>

      <label class="register__consent">
        <input v-model="consent" type="checkbox" required />
        <span>{{ site.reviews.register.consent }}</span>
      </label>

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
  @include container(540px);
  @include flex(column, stretch, center);
  position: relative;
  flex: 1;
  padding-block: $space-xl;

  // Huellitas en marca de agua detrás del formulario.
  &__paw {
    position: absolute;
    font-size: 7rem;
    color: rgba($blush-deep, 0.22);
    pointer-events: none;

    @for $i from 1 through 6 {
      &:nth-child(#{$i}) {
        top: #{($i - 1) * 17%};
        left: #{-6rem + ($i % 3) * 2rem};
        transform: rotate(#{$i * 47 - 120}deg);
      }
    }

    &:nth-child(even) {
      left: auto;
      right: -4rem;
    }
  }

  &__pair {
    @include flex-cards(160px, 0.8rem);
  }

  &__consent {
    @include flex(row, flex-start, flex-start, 0.6rem);
    font-size: $text-xs;
    cursor: pointer;

    input {
      width: auto;
      margin-top: 0.2rem;
      accent-color: $accent;
    }
  }

  &__card {
    position: relative;
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
