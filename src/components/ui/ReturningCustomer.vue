<script setup lang="ts">
// Cliente que vuelve sin cuenta: con su correo y celular traemos los datos de
// su última compra o reserva. Si no hay, le avisamos que solo llena una vez.
import { ref, useId } from 'vue'
import { customerService } from '@/services/customer.service'
import { saveLastCustomer, type LastCustomer } from '@/utils/lastCustomer'
import type { ApiError } from '@/types'

const emit = defineEmits<{ fill: [data: LastCustomer] }>()

const id = useId()
const email = ref('')
const phone = ref('')
const state = ref<'idle' | 'loading' | 'found' | 'missing' | 'error'>('idle')
const message = ref('')

async function search() {
  if (!/^\S+@\S+\.\S+$/.test(email.value.trim()) || phone.value.replace(/\D/g, '').length < 9) {
    state.value = 'error'
    message.value = 'Escribe tu correo y tu celular completo.'
    return
  }
  state.value = 'loading'
  try {
    const found = await customerService.lookup(email.value.trim(), phone.value.trim())
    if (found) {
      saveLastCustomer(found)
      emit('fill', found)
      state.value = 'found'
      message.value = `¡Hola, ${(found.name || '').split(' ')[0]}! Ya llenamos tus datos, revísalos abajo.`
    } else {
      emit('fill', { email: email.value.trim(), phone: phone.value.trim() })
      state.value = 'missing'
      message.value =
        'No encontramos compras con ese correo y celular. Completa tus datos abajo: es solo esta vez, la próxima te los llenamos solos.'
    }
  } catch (e) {
    state.value = 'error'
    message.value = (e as ApiError).message || 'No pudimos buscar tus datos. Llénalos abajo.'
  }
}

// Dentro del checkout hay un <form>: Enter aquí busca en vez de pagar.
function onEnter(event: KeyboardEvent) {
  if (!event.isComposing) search()
}
</script>

<template>
  <section class="returning" :class="`returning--${state}`" :aria-labelledby="`${id}-title`">
    <p :id="`${id}-title`" class="returning__title">
      <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
      ¿Ya compraste o reservaste con nosotros?
    </p>

    <template v-if="state !== 'found'">
      <p class="returning__hint">
        Escribe tu correo y tu celular y llenamos el resto por ti. ¿Primera vez? Llena tus datos
        abajo una sola vez.
      </p>
      <div class="returning__row">
        <div>
          <label :for="`${id}-email`">Correo</label>
          <input
            :id="`${id}-email`"
            v-model="email"
            type="email"
            autocomplete="email"
            autocapitalize="none"
            spellcheck="false"
            enterkeyhint="next"
            @keydown.enter.prevent="onEnter"
          />
        </div>
        <div>
          <label :for="`${id}-phone`">Celular</label>
          <input
            :id="`${id}-phone`"
            v-model="phone"
            type="tel"
            autocomplete="tel"
            placeholder="0991234567"
            enterkeyhint="search"
            @keydown.enter.prevent="onEnter"
          />
        </div>
        <button
          type="button"
          class="btn btn--primary returning__btn"
          :disabled="state === 'loading'"
          @click="search"
        >
          {{ state === 'loading' ? 'Buscando…' : 'Llenar mis datos' }}
        </button>
      </div>
    </template>

    <p role="status" class="returning__msg">
      <i v-if="state === 'found'" class="fa-solid fa-circle-check" aria-hidden="true"></i>
      <i v-else-if="state === 'missing'" class="fa-solid fa-pen" aria-hidden="true"></i>
      <i v-else-if="state === 'error'" class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>
      {{ message }}
    </p>
  </section>
</template>

<style scoped lang="scss">
.returning {
  @include flex(column, stretch, flex-start, 0.6rem);
  background: $accent-soft;
  border: 1.5px dashed rgba($accent, 0.45);
  border-radius: $radius-md;
  padding: 1rem 1.1rem;

  &__title {
    @include display($text-lg, 600);
    @include flex(row, center, flex-start, 0.5rem);
    color: $accent-deep;
  }

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__row {
    @include flex-cards(170px, 0.7rem);
    align-items: flex-end;
  }

  &__btn {
    flex: 0 0 auto;
  }

  &__msg {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;

    &:empty {
      display: none;
    }
  }

  &--found {
    border-style: solid;

    .returning__msg {
      color: $success;
    }
  }

  &--error .returning__msg {
    color: $danger;
  }
}
</style>
