<script setup lang="ts">
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import { formatMoney } from '@/utils/format'

const cart = useCartStore()
const { form, errors, unbuyable, canPay, submit } = useCheckout()
</script>

<template>
  <form class="buyer" novalidate @submit.prevent="submit">
    <p class="buyer__hint">
      Estos datos los pide Payphone para procesar el pago y te enviaremos el comprobante al correo.
    </p>

    <div class="buyer__field">
      <label for="buyer-name">Nombre completo</label>
      <input id="buyer-name" v-model="form.name" type="text" autocomplete="name" />
      <p v-if="errors.name" class="buyer__error">{{ errors.name }}</p>
    </div>

    <div class="buyer__field">
      <label for="buyer-email">Correo</label>
      <input id="buyer-email" v-model="form.email" type="email" autocomplete="email" />
      <p v-if="errors.email" class="buyer__error">{{ errors.email }}</p>
    </div>

    <div class="buyer__row">
      <div class="buyer__field">
        <label for="buyer-phone">Teléfono</label>
        <input id="buyer-phone" v-model="form.phone" type="tel" autocomplete="tel" placeholder="0991234567" />
        <p v-if="errors.phone" class="buyer__error">{{ errors.phone }}</p>
      </div>

      <div class="buyer__field">
        <label for="buyer-document">Cédula</label>
        <input id="buyer-document" v-model="form.documentId" type="text" inputmode="numeric" placeholder="0102030405" />
        <p v-if="errors.documentId" class="buyer__error">{{ errors.documentId }}</p>
      </div>
    </div>

    <div v-if="unbuyable.length" class="buyer__blocked">
      <i class="fa-solid fa-circle-exclamation"></i>
      <div>
        <p>Hay productos sin precio asignado que no se pueden comprar en línea:</p>
        <ul>
          <li v-for="line in unbuyable" :key="line.productId">{{ line.name }}</li>
        </ul>
        <p>Quítalos del carrito para continuar o escríbenos para cotizarlos.</p>
      </div>
    </div>

    <button class="btn btn--primary buyer__submit" type="submit" :disabled="!canPay">
      Pagar {{ formatMoney(cart.total / 100) }}
    </button>
  </form>
</template>

<style scoped lang="scss">
.buyer {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__hint {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__row {
    @include flex(column, stretch, flex-start, 1.1rem);

    @include from('sm') {
      flex-direction: row;

      > * {
        flex: 1 1 0;
      }
    }
  }

  &__error {
    font-size: $text-xs;
    color: $danger;
    margin-top: 0.3rem;
  }

  &__blocked {
    @include flex(row, flex-start, flex-start, 0.7rem);
    background: $warning-bg;
    border: 1px solid rgba($warning, 0.4);
    border-radius: $radius-sm;
    padding: 0.9rem 1rem;
    font-size: $text-sm;
    color: $ink-soft;

    i {
      color: $warning;
      margin-top: 0.2rem;
    }

    ul {
      list-style: none;
      margin-block: 0.3rem;
      font-weight: 600;
      color: $ink;
    }
  }

  &__submit {
    margin-top: 0.3rem;
    align-self: flex-start;
  }
}
</style>
