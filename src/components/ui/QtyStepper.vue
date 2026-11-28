<script setup lang="ts">
const qty = defineModel<number>({ required: true })
const { max = 99, size = 'md' } = defineProps<{ max?: number; size?: 'sm' | 'md' }>()
</script>

<template>
  <div class="qty" :class="`qty--${size}`" role="group" aria-label="Cantidad">
    <button type="button" aria-label="Quitar una unidad" :disabled="qty <= 1" @click="qty--">
      <i class="fa-solid fa-minus"></i>
    </button>
    <span aria-live="polite">{{ qty }}</span>
    <button type="button" aria-label="Agregar una unidad" :disabled="qty >= max" @click="qty++">
      <i class="fa-solid fa-plus"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.qty {
  @include flex(row, center, center, 0.1rem);
  display: inline-flex;
  border: 1px solid $line;
  border-radius: $radius-pill;
  padding: 0.25rem 0.35rem;

  button {
    @include flex(row, center, center);
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 0.72rem;
    color: $ink-soft;
    @include transition(background);

    &:hover:not(:disabled) {
      background: $sand;
      color: $accent;
    }

    &:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
  }

  span {
    min-width: 2rem;
    text-align: center;
    font-weight: 600;
  }

  &--sm {
    padding: 0.15rem 0.3rem;

    button {
      width: 28px;
      height: 28px;
      font-size: 0.68rem;
    }

    span {
      min-width: 1.6rem;
      font-size: $text-sm;
    }
  }
}
</style>
