<script setup lang="ts">
import type { Category } from '@/types'

defineProps<{ categories: Category[]; modelValue: string }>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="category-filter" role="group" aria-label="Filtrar por categoría">
    <button
      type="button"
      class="category-filter__pill"
      :class="{ 'category-filter__pill--active': modelValue === '' }"
      @click="emit('update:modelValue', '')"
    >
      Todo
    </button>
    <button
      v-for="cat in categories"
      :key="cat._id"
      type="button"
      class="category-filter__pill"
      :class="{ 'category-filter__pill--active': modelValue === cat.slug }"
      @click="emit('update:modelValue', cat.slug)"
    >
      {{ cat.name }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.category-filter {
  @include flex(row, center, flex-start, 0.5rem);
  // En móvil es una fila scrolleable; en pantallas grandes envuelve.
  overflow-x: auto;
  padding-block: 0.25rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  @include from('md') {
    flex-wrap: wrap;
    overflow-x: visible;
  }

  &__pill {
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-pill;
    padding: 0.45rem 1.1rem;
    white-space: nowrap;
    flex-shrink: 0;
    @include transition;
    @include focus-ring;

    &:hover {
      border-color: $accent;
      color: $accent-deep;
    }

    &--active {
      background: $ink;
      border-color: $ink;
      color: $paper;

      &:hover {
        color: $paper;
        border-color: $ink;
      }
    }
  }
}
</style>
