<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBackLink } from '@/composables/useBackLink'
import { site, whatsappLink } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import { formatMoney } from '@/utils/format'
import { canPayOnline, finalPrice, productCategoryName, productIcon } from '@/utils/catalog'
import ServiceBooking from '@/components/catalog/ServiceBooking.vue'
import QtyStepper from '@/components/ui/QtyStepper.vue'
import type { Product } from '@/types'

const route = useRoute()
const cartStore = useCartStore()
const toast = useToastStore()

const product = ref<Product | null>(null)
const loading = ref(true)
const notFound = ref(false)
const qty = ref(1)

async function load(slug: string) {
  loading.value = true
  notFound.value = false
  product.value = null
  qty.value = 1
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

// Servicios y exámenes se resuelven con sucursal: reserva, pago o WhatsApp.
const isService = computed(() => Boolean(product.value) && product.value?.type !== 'physical')
const canAddToCart = computed(
  () => Boolean(product.value && canPayOnline(product.value)) && !isService.value,
)

const { backTo, goBack } = useBackLink(product)

function addToCart() {
  if (!product.value) return
  cartStore.add(product.value, undefined, qty.value)
  toast.success(
    qty.value > 1 ? `${qty.value} unidades agregadas al carrito` : 'Agregado al carrito',
  )
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
      <a :href="backTo.to" class="product__back" @click.prevent="goBack">
        <i class="fa-solid fa-arrow-left"></i> {{ backTo.label }}
      </a>

      <div class="product__layout">
        <div class="product__media">
          <img v-if="image" :src="image" :alt="product.name" />
          <span v-else class="product__placeholder" aria-hidden="true"
            ><i :class="productIcon(product)"></i
          ></span>
        </div>

        <div class="product__info">
          <p class="product__category">{{ productCategoryName(product) }}</p>
          <h1 class="product__name">{{ product.name }}</h1>

          <p v-if="product.price > 0" class="product__price">
            <template v-if="product.priceFrom">Desde </template>
            {{ formatMoney(finalPrice(product) / 100) }}
            <s v-if="product.discount > 0">{{ formatMoney(product.price / 100) }}</s>
          </p>

          <p v-if="product.description" class="product__description">{{ product.description }}</p>

          <div v-if="canAddToCart" class="product__actions">
            <QtyStepper v-model="qty" />
            <button class="btn btn--primary" @click="addToCart">
              <i class="fa-solid fa-bag-shopping"></i> Agregar al carrito
            </button>
          </div>

          <ServiceBooking v-else-if="isService" :products="[product]" />

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
    background: $blush-soft;
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
    font-size: 5.5rem;
    color: rgba($accent, 0.4);
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
    @include display($display-sm, 600);
    color: $accent;
  }

  &__description {
    color: $ink-soft;
    white-space: pre-line;
    max-width: 56ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.75rem);
    flex-wrap: wrap;
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
</style>
