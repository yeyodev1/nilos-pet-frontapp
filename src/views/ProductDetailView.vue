<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site, whatsappLink } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatMoney } from '@/utils/format'
import { productCategoryName, productIcon } from '@/utils/catalog'
import ServiceBooking from '@/components/catalog/ServiceBooking.vue'
import type { Product } from '@/types'

const route = useRoute()
const cartStore = useCartStore()
const toast = useToastStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const notFound = ref(false)

async function load(slug: string) {
  loading.value = true
  notFound.value = false
  product.value = null
  try {
    product.value = await catalogService.getProductBySlug(slug)
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.slug,
  (slug) => {
    if (typeof slug === 'string' && slug) load(slug)
  },
  { immediate: true },
)

const image = computed(() => product.value?.images[0]?.url || '')
const categoryName = computed(() => (product.value ? productCategoryName(product.value) : ''))
const icon = computed(() => (product.value ? productIcon(product.value) : 'fa-solid fa-paw'))

const isBookableService = computed(
  () => product.value?.type === 'service' && Boolean(product.value?.bookable),
)
// Físicos con precio van directo al carrito; también un servicio con precio
// que no se reserva por sucursal.
const canAddToCart = computed(
  () => Boolean(product.value && product.value.price > 0) && !isBookableService.value,
)

function addToCart() {
  if (!product.value) return
  cartStore.add(product.value)
  toast.success('Agregado al carrito')
}
</script>

<template>
  <div class="product">
    <div v-if="loading" class="product__skeleton" aria-hidden="true">
      <div class="product__skeleton-media"></div>
      <div class="product__skeleton-info">
        <div v-for="n in 3" :key="n" class="product__skeleton-line"></div>
      </div>
    </div>

    <div v-else-if="notFound || !product" class="product__state">
      <span class="product__state-icon"><i class="fa-solid fa-paw"></i></span>
      <h1 class="product__state-title">No encontramos este producto</h1>
      <p class="product__state-text">Puede que ya no esté disponible o que el enlace cambiara.</p>
      <RouterLink to="/tienda" class="btn btn--primary">Volver a la tienda</RouterLink>
    </div>

    <template v-else>
      <RouterLink to="/tienda" class="product__back">
        <i class="fa-solid fa-arrow-left"></i> Volver a la tienda
      </RouterLink>

      <div class="product__layout">
        <div class="product__media">
          <img v-if="image" :src="image" :alt="product.name" />
          <span v-else class="product__placeholder" aria-hidden="true"><i :class="icon"></i></span>
        </div>

        <div class="product__info">
          <p v-if="categoryName" class="product__category">{{ categoryName }}</p>
          <h1 class="product__name">{{ product.name }}</h1>

          <p v-if="product.price > 0" class="product__price">
            {{ formatMoney(product.price / 100) }}
          </p>

          <p v-if="product.description" class="product__description">{{ product.description }}</p>

          <div v-if="canAddToCart" class="product__actions">
            <button class="btn btn--primary" @click="addToCart">
              <i class="fa-solid fa-bag-shopping"></i> Agregar al carrito
            </button>
          </div>

          <ServiceBooking v-else-if="isBookableService" :product="product" />

          <div v-else class="product__consult">
            <button class="btn btn--ghost" disabled>Consultar precio</button>
            <p class="product__note">
              Este producto aún no tiene precio en línea.
              <a
                v-if="site.whatsapp"
                :href="whatsappLink(`Hola, quiero consultar el precio de ${product.name}`)"
                target="_blank"
                rel="noopener"
              >
                Escríbenos por WhatsApp
              </a>
              <template v-else>Consúltanos en tu sucursal más cercana.</template>
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.product {
  @include container(1080px);
  padding-block: $space-lg $space-section;

  &__back {
    @include flex(row, center, flex-start, 0.5rem);
    display: inline-flex;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    margin-bottom: $space-md;
    @include transition(color);

    &:hover {
      color: $accent-deep;
    }
  }

  &__layout {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('md') {
      flex-direction: row;
      align-items: flex-start;
      gap: 3.5rem;
    }
  }

  &__media {
    @include flex(row, center, center);
    flex: 1;
    aspect-ratio: 1;
    background: $sand;
    border-radius: $radius-lg;
    overflow: hidden;

    @include from('md') {
      position: sticky;
      top: 6rem;
      max-width: 460px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__placeholder {
    font-size: 4rem;
    color: rgba($accent, 0.3);
  }

  &__info {
    @include flex(column, stretch, flex-start, 1rem);
    flex: 1.1;
  }

  &__category {
    @include eyebrow;
  }

  &__name {
    @include display($display-md);
  }

  &__price {
    @include display($text-xl, 600);
    color: $accent-deep;
  }

  &__description {
    color: $ink-soft;
    white-space: pre-line;
    max-width: 56ch;
  }

  &__actions {
    margin-top: 0.5rem;
  }

  &__consult {
    @include flex(column, flex-start, flex-start, 0.7rem);
    margin-top: 0.5rem;
  }

  &__note {
    font-size: $text-sm;
    color: $ink-muted;
    max-width: 44ch;

    a {
      color: $accent-deep;
      font-weight: 600;
      text-decoration: underline;
    }
  }

  &__state {
    @include flex(column, center, center, 0.8rem);
    text-align: center;
    padding-block: $space-section;

    &-icon {
      @include flex(row, center, center);
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      background: $sand;
      color: $accent;
      font-size: 1.3rem;
    }

    &-title {
      @include display($display-sm);
    }

    &-text {
      color: $ink-soft;
      margin-bottom: 0.6rem;
    }
  }

  &__skeleton {
    @include flex(column, stretch, flex-start, 2rem);

    @include from('md') {
      flex-direction: row;
      gap: 3.5rem;
    }

    &-media {
      flex: 1;
      aspect-ratio: 1;
      background: $sand;
      border-radius: $radius-lg;
      max-width: 460px;
    }

    &-info {
      @include flex(column, stretch, flex-start, 1rem);
      flex: 1.1;
    }

    &-line {
      height: 1rem;
      border-radius: $radius-pill;
      background: $sand;
      animation: pulso 1.4s ease-in-out infinite;

      &:first-child {
        width: 30%;
      }

      &:last-child {
        width: 55%;
      }
    }
  }
}

@keyframes pulso {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}
</style>
