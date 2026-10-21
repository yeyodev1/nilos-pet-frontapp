<template>
  <div class="skeleton" aria-hidden="true">
    <div class="skeleton__media"></div>
    <div class="skeleton__body">
      <div class="skeleton__line skeleton__line--short"></div>
      <div class="skeleton__line"></div>
      <div class="skeleton__line skeleton__line--half"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton {
  @include card;
  overflow: hidden;

  &__media {
    aspect-ratio: 4 / 3;
    background: $sand;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 1.1rem 1.2rem 1.4rem;
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
