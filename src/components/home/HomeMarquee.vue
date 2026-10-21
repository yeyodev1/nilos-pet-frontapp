<script setup lang="ts">
import { site } from '@/config/site'
import PawPrint from '@/components/ui/PawPrint.vue'

// El loop CSS necesita el contenido dos veces: cuando la primera copia sale
// de pantalla, la segunda ya está en su lugar y el salto es invisible.
const copies = [false, true]
</script>

<template>
  <section class="marquee" aria-label="Categorías de la tienda">
    <div class="marquee__band">
      <div class="marquee__track">
        <div
          v-for="hidden in copies"
          :key="String(hidden)"
          class="marquee__group"
          :aria-hidden="hidden"
        >
          <template v-for="item in site.marquee" :key="item">
            <span class="marquee__item">{{ item }}</span>
            <span class="marquee__paw"><PawPrint /></span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.marquee {
  // La banda rotada sobresale por los lados: la sección la recorta.
  overflow: hidden;
  padding-block: clamp(2rem, 5vw, 3.5rem);

  &__band {
    background: $accent;
    color: $paper;
    transform: rotate(-2deg);
    width: 110%;
    margin-left: -5%;
    box-shadow: $shadow-md;
  }

  &__track {
    @include flex(row, center, flex-start);
    width: max-content;
    animation: marquee 36s linear infinite;

    // Pausable: el dedo o el cursor detienen la cinta para poder leerla.
    .marquee__band:hover & {
      animation-play-state: paused;
    }
  }

  &__group {
    @include flex(row, center, flex-start, clamp(1.2rem, 3vw, 2.2rem));
    flex-shrink: 0;
    padding-block: clamp(0.7rem, 1.8vw, 1rem);
    padding-right: clamp(1.2rem, 3vw, 2.2rem);
  }

  &__item {
    font-family: $font-display;
    font-size: clamp(1.15rem, 2.6vw, 1.8rem);
    font-weight: 500;
    white-space: nowrap;

    &:nth-child(4n + 3) {
      font-style: italic;
      font-weight: 400;
      color: $blush;
    }
  }

  &__paw {
    font-size: clamp(0.8rem, 1.6vw, 1.1rem);
    color: rgba($paper, 0.5);
  }

  @include reduced-motion {
    &__track {
      animation: none;
    }
  }
}
</style>
