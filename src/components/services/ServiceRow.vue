<script setup lang="ts">
import type { Product } from '@/types'
import { formatMoney } from '@/utils/format'

defineProps<{
  service: Product
  /** pick: checkbox para armar paquete; link: modo informativo sin precios. */
  mode: 'pick' | 'link'
  selected?: boolean
}>()

const emit = defineEmits<{ toggle: [] }>()
</script>

<template>
  <RouterLink
    v-if="mode === 'link'"
    :to="`/producto/${service.slug}`"
    class="service-row service-row--link"
  >
    <span class="service-row__body">
      <span class="service-row__name">{{ service.name }}</span>
      <span v-if="service.description" class="service-row__description">
        {{ service.description }}
      </span>
    </span>
    <span class="service-row__cta">Solo reservar <i class="fa-solid fa-arrow-right"></i></span>
  </RouterLink>

  <label v-else class="service-row" :class="{ 'service-row--selected': selected }">
    <input type="checkbox" class="visually-hidden" :checked="selected" @change="emit('toggle')" />
    <span class="service-row__check" aria-hidden="true">
      <i class="fa-solid fa-check"></i>
    </span>
    <span class="service-row__body">
      <span class="service-row__name">{{ service.name }}</span>
      <span v-if="service.description" class="service-row__description">
        {{ service.description }}
      </span>
    </span>
    <span class="service-row__price" :class="{ 'service-row__price--muted': service.price === 0 }">
      {{ service.price > 0 ? formatMoney(service.price / 100) : 'Consultar precio' }}
    </span>
  </label>
</template>

<style scoped lang="scss">
.service-row {
  @include card;
  @include flex(row, center, flex-start, 1rem);
  padding: 1.1rem 1.3rem;
  cursor: pointer;
  @include transition;

  &:hover {
    border-color: rgba($accent, 0.4);
  }

  &--selected {
    border-color: $accent;
    background: $accent-soft;
  }

  &__cta {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    white-space: nowrap;
  }

  &__check {
    @include flex(row, center, center);
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid $line;
    border-radius: 7px;
    color: transparent;
    font-size: 0.7rem;
    flex-shrink: 0;
    @include transition;

    .service-row--selected & {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.15rem);
    flex: 1;
    min-width: 0;
  }

  &__name {
    @include display($text-lg, 500);
  }

  &__description {
    font-size: $text-sm;
    color: $ink-soft;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__price {
    font-weight: 600;
    color: $accent-deep;
    white-space: nowrap;

    &--muted {
      font-size: $text-sm;
      font-weight: 500;
      color: $ink-muted;
    }
  }
}
</style>
