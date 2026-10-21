<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useUserStore } from '@/stores/user'
import { orderService } from '@/services/order.service'
import { formatDateTime } from '@/utils/datetime'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import type { SummaryLine } from '@/components/checkout/OrderSummary.vue'
import type { ApiError, Order, OrderItem } from '@/types'

type State = 'confirming' | 'paid' | 'canceled' | 'failed' | 'invalid'

const route = useRoute()
const cart = useCartStore()
const userStore = useUserStore()

const state = ref<State>('confirming')
const order = ref<Order | null>(null)
const errorMessage = ref('')

function branchName(item: OrderItem): string {
  return item.branch && typeof item.branch === 'object' ? item.branch.name : ''
}

const summaryLines = computed<SummaryLine[]>(() =>
  (order.value?.items || []).map((item, index) => ({
    key: `${index}`,
    name: item.name,
    qty: item.qty,
    price: item.price,
    branchName: branchName(item),
    scheduledFor: item.scheduledFor,
  })),
)

const bookings = computed(() => (order.value?.items || []).filter((item) => item.scheduledFor))

// Payphone reversa el cobro si no se confirma en 5 minutos: la confirmación
// se dispara apenas carga la página, sin esperar ningún clic.
onMounted(async () => {
  const id = route.query.id
  const clientTransactionId = route.query.clientTransactionId

  if (typeof id !== 'string' || !id || typeof clientTransactionId !== 'string' || !clientTransactionId) {
    state.value = 'invalid'
    return
  }

  try {
    const confirmed = await orderService.confirmOrder(id, clientTransactionId)
    order.value = confirmed

    if (confirmed.status === 'paid') {
      cart.clear()
      state.value = 'paid'
    } else if (confirmed.status === 'canceled') {
      state.value = 'canceled'
    } else {
      state.value = 'failed'
    }
  } catch (error) {
    errorMessage.value = (error as ApiError).message || ''
    state.value = 'failed'
  }
})
</script>

<template>
  <section class="payment">
    <div v-if="state === 'confirming'" class="payment__panel">
      <i class="fa-solid fa-spinner fa-spin payment__spin"></i>
      <h1>Confirmando tu pago…</h1>
      <p>No cierres esta página: estamos verificando la transacción con Payphone.</p>
    </div>

    <div v-else-if="state === 'paid'" class="payment__panel payment__panel--wide">
      <i class="fa-solid fa-circle-check payment__icon payment__icon--ok"></i>
      <p class="payment__eyebrow">Pago confirmado</p>
      <h1>¡Gracias por tu compra!</h1>
      <p v-if="order">Tu pedido <strong>#{{ order.number }}</strong> quedó registrado y te enviamos el detalle al correo.</p>

      <OrderSummary v-if="order" :lines="summaryLines" :total="order.total" title="Tu pedido" class="payment__summary" />

      <div v-if="bookings.length" class="payment__bookings">
        <h2><i class="fa-solid fa-calendar-check"></i> Tus reservas</h2>
        <ul>
          <li v-for="(item, index) in bookings" :key="index">
            <strong>{{ item.name }}</strong>
            <span>
              {{ branchName(item) || 'Sucursal por confirmar' }}
              <template v-if="item.scheduledFor"> · {{ formatDateTime(item.scheduledFor) }}</template>
            </span>
          </li>
        </ul>
        <p>Te contactaremos para confirmar la hora exacta de cada reserva.</p>
      </div>

      <div class="payment__actions">
        <RouterLink v-if="userStore.hasToken" class="btn btn--primary" to="/cuenta">Ver mi cuenta</RouterLink>
        <RouterLink class="btn" :class="userStore.hasToken ? 'btn--ghost' : 'btn--primary'" to="/tienda">
          Seguir comprando
        </RouterLink>
      </div>
    </div>

    <div v-else-if="state === 'canceled'" class="payment__panel">
      <i class="fa-solid fa-circle-xmark payment__icon payment__icon--muted"></i>
      <p class="payment__eyebrow">Pago cancelado</p>
      <h1>No se realizó ningún cobro</h1>
      <p>Cancelaste el pago antes de completarlo. Tu carrito sigue intacto por si quieres intentarlo de nuevo.</p>
      <div class="payment__actions">
        <RouterLink class="btn btn--primary" to="/checkout">Volver a intentar</RouterLink>
        <RouterLink class="btn btn--ghost" to="/carrito">Ver el carrito</RouterLink>
      </div>
    </div>

    <div v-else-if="state === 'failed'" class="payment__panel">
      <i class="fa-solid fa-triangle-exclamation payment__icon payment__icon--bad"></i>
      <p class="payment__eyebrow">Pago no confirmado</p>
      <h1>No pudimos confirmar tu pago</h1>
      <p>{{ errorMessage || 'La transacción no se completó. Si el cobro aparece en tu tarjeta, escríbenos y lo revisamos de inmediato.' }}</p>
      <div class="payment__actions">
        <RouterLink class="btn btn--primary" to="/carrito">Volver al carrito</RouterLink>
      </div>
    </div>

    <div v-else class="payment__panel">
      <i class="fa-solid fa-link-slash payment__icon payment__icon--muted"></i>
      <p class="payment__eyebrow">Enlace inválido</p>
      <h1>Falta información del pago</h1>
      <p>Este enlace no trae los datos de la transacción. Si vienes de pagar, revisa el correo de confirmación o escríbenos.</p>
      <div class="payment__actions">
        <RouterLink class="btn btn--primary" to="/">Ir al inicio</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.payment {
  @include container(720px);
  @include flex(column, center, flex-start);
  padding-block: $space-xl $space-section;

  &__panel {
    @include card;
    @include flex(column, center, flex-start, 0.7rem);
    text-align: center;
    width: 100%;
    padding: $space-xl 1.5rem;
    box-shadow: $shadow-sm;

    @include from('md') {
      padding: $space-xl 3rem;
    }

    h1 {
      @include display($display-sm, 600);
    }

    > p {
      color: $ink-soft;
      font-size: $text-sm;
      max-width: 52ch;
    }

    &--wide {
      text-align: left;
      align-items: stretch;

      h1,
      > p,
      .payment__eyebrow,
      .payment__icon {
        text-align: center;
        align-self: center;
      }
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__spin {
    font-size: 1.8rem;
    color: $accent;
    margin-bottom: 0.4rem;
  }

  &__icon {
    font-size: 2.4rem;
    margin-bottom: 0.4rem;

    &--ok {
      color: $success;
    }

    &--bad {
      color: $danger;
    }

    &--muted {
      color: $ink-muted;
    }
  }

  &__summary {
    margin-top: $space-md;
  }

  &__bookings {
    background: $sand;
    border-radius: $radius-md;
    padding: 1.2rem 1.4rem;
    margin-top: 1rem;

    h2 {
      @include display($text-lg, 600);
      margin-bottom: 0.6rem;

      i {
        color: $accent;
        margin-right: 0.4rem;
      }
    }

    ul {
      @include flex(column, stretch, flex-start, 0.5rem);
      list-style: none;
    }

    li {
      @include flex(column, flex-start, flex-start, 0.1rem);
      font-size: $text-sm;

      span {
        color: $ink-soft;
        font-size: $text-xs;
      }
    }

    > p {
      font-size: $text-xs;
      color: $ink-muted;
      margin-top: 0.7rem;
    }
  }

  &__actions {
    @include flex(row, center, center, 0.7rem);
    flex-wrap: wrap;
    margin-top: $space-md;
  }
}
</style>
