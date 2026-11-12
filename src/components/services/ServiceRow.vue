<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { formatMoney } from '@/utils/format'
import { canPayOnline, finalPrice, productCategoryName } from '@/utils/catalog'

const props = defineProps<{ service: Product }>()
const emit = defineEmits<{ open: [] }>()

const image = computed(() => props.service.images[0]?.url || '')

// Qué puede hacer el cliente con este servicio decide el texto del botón.
const action = computed(() => {
  if (canPayOnline(props.service)) {
    return { icon: 'fa-solid fa-calendar-check', label: 'Reservar o pagar' }
  }
  if (props.service.bookable) {
    return { icon: 'fa-solid fa-calendar-check', label: 'Reservar o consultar' }
  }
  return { icon: 'fa-brands fa-whatsapp', label: 'Consultar por WhatsApp' }
})
</script>

<template>
  <article class="service-row">
    <div class="service-row__media">
      <img v-if="image" :src="image" :alt="service.name" loading="lazy" />
      <i v-else class="fa-solid fa-paw" aria-hidden="true"></i>
    </div>

    <div class="service-row__body">
      <span class="service-row__tag">{{ productCategoryName(service) }}</span>
      <h2 class="service-row__name">{{ service.name }}</h2>
      <p class="service-row__description">{{ service.description }}</p>
      <p v-if="service.price > 0" class="service-row__price">
        <template v-if="service.priceFrom">Desde </template>
        {{ formatMoney(finalPrice(service) / 100) }}
        <s v-if="service.discount > 0">{{ formatMoney(service.price / 100) }}</s>
      </p>
    </div>

    <button class="btn btn--primary service-row__cta" @click="emit('open')">
      <i :class="action.icon"></i> {{ action.label }}
    </button>
  </article>
</template>

<style scoped lang="scss">
.service-row {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1rem;
  @include transition(box-shadow border-color);

  &:hover {
    border-color: rgba($accent, 0.35);
    box-shadow: $shadow-md;
  }

  @include from('md') {
    flex-direction: row;
    align-items: center;
    gap: 1.4rem;
  }

  &__media {
    @include flex(row, center, center);
    flex-shrink: 0;
    aspect-ratio: 16 / 10;
    border-radius: $radius-sm;
    overflow: hidden;
    background: $blush-soft;
    color: rgba($accent, 0.4);
    font-size: 2rem;

    @include from('md') {
      width: 150px;
      aspect-ratio: 1;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.3rem);
    flex: 1;
    min-width: 0;
  }

  &__tag {
    @include eyebrow;
    font-size: 0.62rem;
    background: $sand;
    padding: 0.2rem 0.6rem;
    border-radius: $radius-pill;
  }

  &__name {
    @include display($text-xl, 500);
  }

  &__description {
    font-size: $text-sm;
    color: $ink-soft;
    white-space: pre-line;
  }

  &__price {
    @include display($text-lg, 600);
    color: $accent;

    s {
      font-family: $font-principal;
      font-size: $text-sm;
      font-weight: 400;
      color: $ink-muted;
    }
  }

  &__cta {
    flex-shrink: 0;
    padding: 0.7rem 1.2rem;
    font-size: $text-xs;
  }
}
</style>
