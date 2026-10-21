<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { formatMoney } from '@/utils/format'
import { formatDateTime } from '@/utils/datetime'
import OrderSummary from '@/components/checkout/OrderSummary.vue'
import type { SummaryLine } from '@/components/checkout/OrderSummary.vue'

const cart = useCartStore()

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
  <section class="cart">
    <header class="cart__head">
      <p class="cart__eyebrow">Tu selección</p>
      <h1 class="cart__title">Carrito</h1>
    </header>

    <div v-if="cart.isEmpty" class="cart__empty">
      <i class="fa-solid fa-paw"></i>
      <h2>Tu carrito está vacío</h2>
      <p>Explora la tienda: alimento, medicinas, accesorios y servicios para tu mascota.</p>
      <RouterLink class="btn btn--primary" to="/tienda">Explorar la tienda</RouterLink>
    </div>

    <div v-else class="cart__layout">
      <ul class="cart__lines">
        <li v-for="line in cart.lines" :key="line.productId" class="cart__line">
          <RouterLink :to="`/producto/${line.slug}`" class="cart__media">
            <img v-if="line.image" :src="line.image" :alt="line.name" loading="lazy" />
            <i v-else class="fa-solid fa-paw"></i>
          </RouterLink>

          <div class="cart__body">
            <RouterLink :to="`/producto/${line.slug}`" class="cart__name">{{ line.name }}</RouterLink>
            <p class="cart__unit">{{ formatMoney(line.price / 100) }} c/u</p>
            <p v-if="line.type === 'service' && line.branchName" class="cart__booking">
              <i class="fa-solid fa-location-dot"></i>
              {{ line.branchName }}
              <template v-if="line.scheduledFor"> · {{ formatDateTime(line.scheduledFor) }}</template>
            </p>
          </div>

          <div class="cart__controls">
            <div v-if="line.type === 'physical'" class="cart__qty" aria-label="Cantidad">
              <button type="button" aria-label="Quitar una unidad" @click="cart.setQty(line.productId, line.qty - 1)">
                <i class="fa-solid fa-minus"></i>
              </button>
              <span>{{ line.qty }}</span>
              <button type="button" aria-label="Agregar una unidad" @click="cart.setQty(line.productId, line.qty + 1)">
                <i class="fa-solid fa-plus"></i>
              </button>
            </div>

            <p class="cart__subtotal">{{ formatMoney((line.price * line.qty) / 100) }}</p>

            <button class="cart__remove" type="button" aria-label="Eliminar del carrito" @click="cart.remove(line.productId)">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </li>
      </ul>

      <OrderSummary :lines="summaryLines" :total="cart.total" :show-lines="false" class="cart__summary">
        <RouterLink class="btn btn--primary cart__checkout" to="/checkout">
          Finalizar compra <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
        <RouterLink class="cart__keep" to="/tienda">Seguir comprando</RouterLink>
      </OrderSummary>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cart {
  @include container;
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

  &__empty {
    @include card;
    @include flex(column, center, center, 0.7rem);
    text-align: center;
    padding: $space-xl 1.5rem;

    i {
      font-size: 2rem;
      color: $accent-soft;
    }

    h2 {
      @include display($text-xl, 600);
    }

    p {
      color: $ink-soft;
      font-size: $text-sm;
      max-width: 42ch;
    }

    .btn {
      margin-top: 0.8rem;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, $space-md);

    @include from('lg') {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.9rem);
    list-style: none;
    flex: 1 1 auto;
    min-width: 0;
  }

  &__line {
    @include card;
    @include flex(row, center, flex-start, 1rem);
    flex-wrap: wrap;
    padding: 1rem 1.1rem;
    @include transition(box-shadow);

    &:hover {
      box-shadow: $shadow-sm;
    }
  }

  &__media {
    @include flex(row, center, center);
    width: 68px;
    height: 68px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    background: $sand;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    i {
      font-size: 1.3rem;
      color: $accent-soft;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1 1 180px;
    min-width: 0;
  }

  &__name {
    font-weight: 600;
    font-size: $text-sm;
    @include transition(color);

    &:hover {
      color: $accent;
    }
  }

  &__unit {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__booking {
    font-size: $text-xs;
    color: $ink-soft;

    i {
      color: $accent;
      margin-right: 0.25rem;
    }
  }

  &__controls {
    @include flex(row, center, flex-end, 0.9rem);
    margin-left: auto;
  }

  &__qty {
    @include flex(row, center, center, 0.1rem);
    border: 1px solid $line;
    border-radius: $radius-pill;
    padding: 0.15rem 0.3rem;

    button {
      @include flex(row, center, center);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      font-size: 0.68rem;
      color: $ink-soft;
      @include transition(background);

      &:hover {
        background: $sand;
        color: $accent;
      }
    }

    span {
      min-width: 1.6rem;
      text-align: center;
      font-size: $text-sm;
      font-weight: 600;
    }
  }

  &__subtotal {
    font-weight: 600;
    font-size: $text-sm;
    white-space: nowrap;
  }

  &__remove {
    color: $ink-muted;
    font-size: 0.9rem;
    padding: 0.4rem;
    @include transition(color);

    &:hover {
      color: $danger;
    }
  }

  &__summary {
    flex: 0 0 auto;
    width: 100%;

    @include from('lg') {
      width: 330px;
      position: sticky;
      top: 90px;
    }
  }

  &__checkout {
    width: 100%;
    margin-top: 0.3rem;
  }

  &__keep {
    align-self: center;
    font-size: $text-xs;
    color: $ink-soft;
    text-decoration: underline;
    text-underline-offset: 3px;
    @include transition(color);

    &:hover {
      color: $accent;
    }
  }
}
</style>
