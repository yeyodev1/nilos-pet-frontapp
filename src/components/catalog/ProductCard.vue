<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { formatMoney } from '@/utils/format'
import { productCategoryName, productIcon } from '@/utils/catalog'

const props = defineProps<{ product: Product }>()

const image = computed(() => props.product.images[0]?.url || '')
const categoryName = computed(() => productCategoryName(props.product))
const icon = computed(() => productIcon(props.product))
const priceLabel = computed(() =>
  props.product.price > 0 ? formatMoney(props.product.price / 100) : 'Consultar precio',
)
</script>

<template>
  <RouterLink :to="`/producto/${product.slug}`" class="product-card">
    <div class="product-card__media">
      <img v-if="image" :src="image" :alt="product.name" loading="lazy" />
      <span v-else class="product-card__placeholder" aria-hidden="true">
        <i :class="icon"></i>
      </span>
      <span v-if="product.type === 'service'" class="product-card__tag">Servicio</span>
    </div>

    <div class="product-card__body">
      <p v-if="categoryName" class="product-card__category">{{ categoryName }}</p>
      <h3 class="product-card__name">{{ product.name }}</h3>
      <div class="product-card__foot">
        <p
          class="product-card__price"
          :class="{ 'product-card__price--muted': product.price === 0 }"
        >
          {{ priceLabel }}
        </p>
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
  overflow: hidden;
  @include transition;

  &:hover {
    transform: translateY(-4px);
    box-shadow: $shadow-md;
    border-color: rgba($accent, 0.3);

    .product-card__media img {
      transform: scale(1.04);
    }

    .product-card__arrow {
      background: $accent;
      color: $surface;
      transform: translateX(2px);
    }
  }

  @include reduced-motion {
    &:hover {
      transform: none;

      .product-card__media img {
        transform: none;
      }
    }
  }

  &__media {
    position: relative;
    aspect-ratio: 4 / 3;
    background: $sand;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      @include transition(transform);
    }
  }

  &__placeholder {
    @include flex(row, center, center);
    width: 100%;
    height: 100%;
    font-size: 2.1rem;
    color: rgba($accent, 0.35);
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

  &__body {
    @include flex(column, stretch, flex-start, 0.3rem);
    flex: 1;
    padding: 1.1rem 1.2rem 1.2rem;
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
    padding-top: 0.7rem;
  }

  &__price {
    font-size: $text-base;
    font-weight: 600;
    color: $accent-deep;

    &--muted {
      font-size: $text-sm;
      font-weight: 500;
      color: $ink-muted;
    }
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
