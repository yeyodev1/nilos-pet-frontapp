<script setup lang="ts">
// Cabecera común de las páginas internas: la misma línea gráfica que la home
// y Quiénes somos (titular Fraunces con cursiva, foto ladeada, sticker y huella).
import { ref } from 'vue'
import { useGsapReveal } from '@/composables/useGsapReveal'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import PawPrint from '@/components/ui/PawPrint.vue'

defineProps<{
  eyebrow: string
  titleParts: ReadonlyArray<{ text: string; italic?: boolean }>
  subtitle: string
  image: string
  alt: string
  sticker?: string
}>()

const root = ref<HTMLElement | null>(null)
useGsapReveal(root)
</script>

<template>
  <section ref="root" class="page-hero">
    <span class="page-hero__blob" aria-hidden="true"></span>
    <div class="page-hero__inner">
      <div class="page-hero__copy" data-reveal>
        <p class="page-hero__eyebrow">{{ eyebrow }}</p>
        <h1 class="page-hero__title"><DisplayParts :parts="titleParts" /></h1>
        <p class="page-hero__subtitle">{{ subtitle }}</p>
        <div v-if="$slots.default" class="page-hero__actions"><slot /></div>
      </div>

      <figure class="page-hero__photo" data-reveal data-reveal-delay="0.1">
        <img :src="image" :alt="alt" fetchpriority="high" />
        <span v-if="sticker" class="page-hero__sticker">{{ sticker }}</span>
        <span class="page-hero__paw" aria-hidden="true" data-float><PawPrint /></span>
      </figure>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page-hero {
  position: relative;
  overflow: clip;
  background: linear-gradient(180deg, $sand 0%, $paper 100%);

  &__blob {
    position: absolute;
    right: -8rem;
    top: -6rem;
    width: 28rem;
    height: 28rem;
    border-radius: 50%;
    background: $blush-soft;
    opacity: 0.7;
  }

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, $space-lg);
    position: relative;
    padding-block: $space-lg $space-xl;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1rem);
    flex: 1.15;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-lg);
    max-width: 14ch;
  }

  &__subtitle {
    color: $ink-soft;
    max-width: 52ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.7rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }

  &__photo {
    position: relative;
    flex: 1;
    width: 100%;
    max-width: 460px;
    margin-inline: auto;
    rotate: 2deg;

    img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      border-radius: $radius-lg;
      border: 8px solid $surface;
      box-shadow: $shadow-lg;
    }
  }

  &__sticker {
    position: absolute;
    left: -0.8rem;
    bottom: 1.2rem;
    rotate: -6deg;
    background: $accent;
    color: $paper;
    font-family: $font-display;
    font-style: italic;
    font-size: $text-lg;
    padding: 0.45rem 1.1rem;
    border-radius: $radius-pill;
    box-shadow: $shadow-md;
  }

  &__paw {
    position: absolute;
    top: -2rem;
    right: -1.2rem;
    font-size: 5rem;
    color: $blush;
    rotate: 18deg;
  }
}
</style>
