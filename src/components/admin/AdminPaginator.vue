<script setup lang="ts">
defineProps<{
  pages: number
  total?: number
}>()

const page = defineModel<number>('page', { required: true })
</script>

<template>
  <nav v-if="pages > 1 || total !== undefined" class="paginator" aria-label="Paginación">
    <span v-if="total !== undefined" class="paginator__total">
      {{ total }} {{ total === 1 ? 'registro' : 'registros' }}
    </span>
    <div v-if="pages > 1" class="paginator__controls">
      <button
        class="paginator__btn"
        :disabled="page <= 1"
        aria-label="Página anterior"
        @click="page--"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      <span class="paginator__page">{{ page }} / {{ pages }}</span>
      <button
        class="paginator__btn"
        :disabled="page >= pages"
        aria-label="Página siguiente"
        @click="page++"
      >
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.paginator {
  @include flex(row, center, space-between, 1rem);
  flex-wrap: wrap;
  margin-top: 1rem;

  &__total {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__controls {
    @include flex(row, center, flex-end, 0.6rem);
    margin-left: auto;
  }

  &__page {
    font-size: $text-sm;
    font-weight: 600;
    color: $ink-soft;
    min-width: 3.2rem;
    text-align: center;
  }

  &__btn {
    @include flex(row, center, center);
    width: 2.2rem;
    height: 2.2rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    color: $ink-soft;
    font-size: 0.8rem;
    @include transition(border-color);
    @include focus-ring;

    &:hover:not(:disabled) {
      border-color: $accent;
      color: $accent;
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }
}
</style>
