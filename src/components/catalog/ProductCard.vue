<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { formatMoney } from '@/utils/format'
import { productCategory, productCategoryName, productIcon } from '@/utils/catalog'
import PawPrint from '@/components/ui/PawPrint.vue'

const props = defineProps<{ product: Product; toneSeed?: number }>()

const image = computed(() => props.product.images[0]?.url || '')
const categoryName = computed(() => productCategoryName(props.product))
const icon = computed(() => productIcon(props.product))
const hasPrice = computed(() => props.product.price > 0)
const priceLabel = computed(() =>
  hasPrice.value ? formatMoney(props.product.price / 100) : 'Consultar precio',
)

// Sin fotos, la grilla vive del color: arena y rosa alternados. Con semilla
// (la posición en la grilla) la alternancia es estricta; sin ella, decide la
// categoría para que una tarjeta suelta siempre pinte igual.
const tone = computed<'sand' | 'blush'>(() => {
  let hash = props.toneSeed
  if (hash === undefined) {
    hash = 0
    const slug = productCategory(props.product)?.slug || props.product.slug
    for (const char of slug) hash += char.charCodeAt(0)
  }
  return hash % 2 === 0 ? 'sand' : 'blush'
})
</script>

<template>
  <RouterLink :to="`/producto/${product.slug}`" class="product-card">
    <div class="product-card__media" :class="`product-card__media--${tone}`">
      <img v-if="image" :src="image" :alt="product.name" loading="lazy" />
      <template v-else>
        <PawPrint class="product-card__watermark" />
        <span class="product-card__placeholder" aria-hidden="true">
          <i :class="icon"></i>
        </span>
      </template>
      <span v-if="product.type === 'service'" class="product-card__tag">Servicio</span>
    </div>

    <div class="product-card__body">
      <span class="product-card__sticker" :class="{ 'product-card__sticker--ask': !hasPrice }">
        {{ priceLabel }}
      </span>
      <p v-if="categoryName" class="product-card__category">{{ categoryName }}</p>
      <h3 class="product-card__name">{{ product.name }}</h3>
      <div class="product-card__foot">
        <span class="product-card__more">Ver producto</span>
        <span class="product-card__arrow" aria-hidden="true">
          <i class="fa-solid fa-arrow-right"></i>
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped lang="scss">
.product-card {
  @include card;
  @include flex(column, stretch, flex-start);
  overflow: visible;
  @include transition(transform box-shadow border-color);

  // Levanta y se ladea apenas: tarjeta con carácter, no tarjeta de dashboard.
  &:hover {
    transform: translateY(-6px) rotate(-1deg);
    box-shadow: $shadow-md;
    border-color: rgba($accent, 0.3);

    .product-card__media img {
      transform: scale(1.04);
    }

    .product-card__sticker {
      transform: rotate(4deg) scale(1.07);
    }

    .product-card__arrow {
      background: $accent;
      color: $surface;
    }
  }

  @include reduced-motion {
    &:hover {
      transform: none;

      .product-card__media img {
        transform: none;
      }

      .product-card__sticker {
        transform: rotate(-5deg);
      }
    }
  }

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: 13px 13px 0 0;
    overflow: hidden;

    &--sand {
      background: $sand;
    }

    &--blush {
      background: $blush-soft;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      @include transition(transform);
    }
  }

  &__watermark {
    position: absolute;
    right: -1.4rem;
    bottom: -1.6rem;
    font-size: 8.5rem;
    color: rgba($blush-deep, 0.18);
    transform: rotate(-18deg);
  }

  &__placeholder {
    @include flex(row, center, center);
    position: absolute;
    inset: 0;
    font-size: 2.4rem;
    color: rgba($accent, 0.45);
  }

  &__tag {
    @include eyebrow;
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    font-size: 0.6rem;
    background: rgba($paper, 0.92);
    color: $accent-deep;
    padding: 0.3rem 0.65rem;
    border-radius: $radius-pill;
  }

  &__sticker {
    position: absolute;
    right: 0.7rem;
    top: -0.95rem;
    z-index: 2;
    font-family: $font-display;
    font-size: 0.95rem;
    font-weight: 600;
    background: $ink;
    color: $paper;
    padding: 0.4rem 0.85rem;
    border-radius: $radius-pill;
    transform: rotate(-5deg);
    box-shadow: $shadow-sm;
    @include transition(transform);

    &--ask {
      font-size: 0.78rem;
      font-style: italic;
      background: $blush;
      color: $accent-deep;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.3rem);
    position: relative;
    flex: 1;
    padding: 1.4rem 1.2rem 1.2rem;
  }

  &__category {
    @include eyebrow;
    font-size: 0.6rem;
    color: $ink-muted;
  }

  &__name {
    @include display($text-lg, 500);
    color: $ink;
  }

  &__foot {
    @include flex(row, center, space-between, 0.6rem);
    margin-top: auto;
    padding-top: 0.8rem;
  }

  &__more {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-muted;
  }

  &__arrow {
    @include flex(row, center, center);
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: $sand;
    color: $ink;
    font-size: 0.75rem;
    flex-shrink: 0;
    @include transition;
  }
}
</style>
