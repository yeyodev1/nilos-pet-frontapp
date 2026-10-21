<script setup lang="ts">
// El esqueleto replica el ritmo de la tarjeta real: media con tono, sticker
// y líneas de texto. La alternancia de tono la decide quien lo pinta.
withDefaults(defineProps<{ tone?: 'sand' | 'blush' }>(), { tone: 'sand' })
</script>

<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__media" :class="`skeleton__media--${tone}`"></div>
    <div class="skeleton__body">
      <span class="skeleton__sticker"></span>
      <div class="skeleton__line skeleton__line--short"></div>
      <div class="skeleton__line"></div>
      <div class="skeleton__line skeleton__line--half"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  @include card;

  &__media {
    aspect-ratio: 4 / 3;
    border-radius: 13px 13px 0 0;
    animation: pulso 1.4s ease-in-out infinite;

    &--sand {
      background: $sand;
    }

    &--blush {
      background: $blush-soft;
    }
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.6rem);
    position: relative;
    padding: 1.4rem 1.2rem;
  }

  &__sticker {
    position: absolute;
    top: -0.95rem;
    right: 0.7rem;
    width: 5.2rem;
    height: 1.9rem;
    border-radius: $radius-pill;
    background: $line;
    transform: rotate(-5deg);
    animation: pulso 1.4s ease-in-out infinite;
  }

  &__line {
    height: 0.8rem;
    border-radius: $radius-pill;
    background: $sand;
    animation: pulso 1.4s ease-in-out infinite;

    &--short {
      width: 34%;
    }

    &--half {
      width: 52%;
    }
  }
}
</style>
