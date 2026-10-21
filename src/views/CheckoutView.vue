<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useCartStore } from '@/stores/cart'
import { useCheckout } from '@/composables/useCheckout'
import CheckoutForm from '@/components/checkout/CheckoutForm.vue'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import type { SummaryLine } from '@/components/checkout/OrderSummary.vue'

const router = useRouter()
const cart = useCartStore()
const { step, expired, order, retry, dispose } = useCheckout()

// Sin carrito no hay checkout. Mientras la Cajita está montada no se
// redirige: Payphone se lleva al usuario a /pago/respuesta por su cuenta.
watch(
  () => cart.isEmpty,
  (empty) => {
    if (empty && step.value !== 'box') router.replace('/carrito')
  },
  { immediate: true },
)

onUnmounted(dispose)

const summaryLines = computed<SummaryLine[]>(() =>
  cart.lines.map((line) => ({
    key: line.productId,
    name: line.name,
    qty: line.qty,
    price: line.price,
    branchName: line.branchName,
    scheduledFor: line.scheduledFor,
  })),
)
</script>

<template>
  <section class="checkout">
    <header class="checkout__head">
      <p class="checkout__eyebrow">Último paso</p>
      <h1 class="checkout__title">{{ site.checkout.title }}</h1>
    </header>

    <div class="checkout__layout">
      <div class="checkout__main">
        <CheckoutForm v-if="step === 'form'" />

        <div v-else-if="step === 'creating'" class="checkout__loading">
          <i class="fa-solid fa-spinner fa-spin"></i>
          <p>Preparando tu pago seguro…</p>
        </div>

        <div v-else-if="step === 'box'" :key="order?._id" class="checkout__box">
          <div class="checkout__box-head">
            <p class="checkout__box-eyebrow">Pago seguro</p>
            <h2>Completa el pago</h2>
            <p v-if="order" class="checkout__box-ref">Pedido #{{ order.number }}</p>
          </div>

          <div v-if="!expired" id="pp-button" class="checkout__pp"></div>

          <div v-else class="checkout__expired">
            <i class="fa-regular fa-clock"></i>
            <h3>El formulario de pago expiró</h3>
            <p>Por seguridad, la Cajita de Payphone vence a los 10 minutos. No se realizó ningún cobro.</p>
            <button class="btn btn--primary" type="button" @click="retry">Intentar de nuevo</button>
          </div>

          <p class="checkout__note">
            <i class="fa-solid fa-lock"></i> {{ site.checkout.payNote }}
          </p>
        </div>
      </div>

      <OrderSummary :lines="summaryLines" :total="cart.total" class="checkout__summary">
        <p v-if="step === 'form'" class="checkout__note">
          <i class="fa-solid fa-lock"></i> {{ site.checkout.payNote }}
        </p>
      </OrderSummary>
    </div>
  </section>
</template>

<style scoped lang="scss">
.checkout {
  @include container(1040px);
  padding-block: $space-lg $space-section;

  &__head {
    margin-bottom: $space-md;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 600);
    margin-top: 0.3rem;
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__main {
    @include card;
    flex: 1 1 auto;
    min-width: 0;
    padding: 1.8rem 1.5rem;
    box-shadow: $shadow-sm;

    @include from('md') {
      padding: 2.2rem 2rem;
    }
  }

  &__loading {
    @include flex(column, center, center, 0.8rem);
    padding: $space-xl 1rem;
    color: $ink-soft;

    i {
      font-size: 1.6rem;
      color: $accent;
    }
  }

  &__box {
    @include flex(column, stretch, flex-start, 1.2rem);
  }

  &__box-head {
    h2 {
      @include display($text-xl, 600);
      margin-top: 0.2rem;
    }
  }

  &__box-eyebrow {
    @include eyebrow;
  }

  &__box-ref {
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.3rem;
  }

  &__pp {
    min-height: 220px;
  }

  &__expired {
    @include flex(column, center, center, 0.6rem);
    text-align: center;
    background: $sand;
    border-radius: $radius-md;
    padding: $space-lg 1.2rem;

    i {
      font-size: 1.6rem;
      color: $accent;
    }

    h3 {
      @include display($text-lg, 600);
    }

    p {
      font-size: $text-sm;
      color: $ink-soft;
      max-width: 46ch;
    }

    .btn {
      margin-top: 0.5rem;
    }
  }

  &__note {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-size: $text-xs;
    color: $ink-muted;

    i {
      color: $success;
      margin-top: 0.15rem;
    }
  }

  &__summary {
    width: 100%;

    @include from('lg') {
      width: 340px;
      flex-shrink: 0;
      position: sticky;
      top: 90px;
    }
  }
}
</style>
