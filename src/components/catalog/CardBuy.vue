<script setup lang="ts">
// Cantidad + "Agregar" dentro de la tarjeta de la tienda.
import { ref } from 'vue'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

const props = defineProps<{ product: Product }>()

const qty = ref(1)
const cart = useCartStore()
const toast = useToastStore()

function addToCart() {
  cart.add(props.product, undefined, qty.value)
  toast.success(`${qty.value} × ${props.product.name} en el carrito`)
  qty.value = 1
}
</script>

<template>
  <div class="buy">
    <div class="buy__qty">
      <button type="button" aria-label="Quitar una unidad" @click="qty = Math.max(1, qty - 1)">
        <i class="fa-solid fa-minus"></i>
      </button>
      <span aria-live="polite">{{ qty }}</span>
      <button type="button" aria-label="Agregar una unidad" @click="qty = Math.min(99, qty + 1)">
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
    <button type="button" class="btn btn--primary buy__add" @click="addToCart">
      <i class="fa-solid fa-bag-shopping"></i> Agregar
    </button>
  </div>
</template>

<style scoped lang="scss">
.buy {
  @include flex(row, center, space-between, 0.5rem);
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: 0.8rem;

  &__qty {
    @include flex(row, center, center, 0.2rem);
    border: 1px solid $line;
    border-radius: $radius-pill;

    button {
      width: 2rem;
      height: 2rem;
      font-size: 0.65rem;
      color: $ink-soft;
    }

    span {
      min-width: 1.4rem;
      text-align: center;
      font-weight: 600;
      font-size: $text-sm;
    }
  }

  &__add {
    flex: 1;
    padding: 0.55rem 0.9rem;
    font-size: $text-xs;
  }
}
</style>
