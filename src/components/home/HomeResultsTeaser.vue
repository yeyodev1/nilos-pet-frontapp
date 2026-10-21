<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useGsapReveal } from '@/composables/useGsapReveal'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import PawPrint from '@/components/ui/PawPrint.vue'

const root = ref<HTMLElement | null>(null)
useGsapReveal(root)
</script>

<template>
  <section ref="root" class="results-teaser">
    <span class="results-teaser__paw results-teaser__paw--one" data-float aria-hidden="true">
      <PawPrint />
    </span>
    <span class="results-teaser__paw results-teaser__paw--two" data-float aria-hidden="true">
      <PawPrint />
    </span>

    <div class="results-teaser__inner">
      <p class="results-teaser__eyebrow" data-reveal>
        <i class="fa-solid fa-file-waveform"></i>
        Resultados en línea
      </p>
      <h2 class="results-teaser__title" data-reveal data-reveal-delay="0.1">
        <DisplayParts :parts="site.resultsBand.titleParts" />
      </h2>
      <p class="results-teaser__text" data-reveal data-reveal-delay="0.18">
        {{ site.resultsBand.text }}
      </p>
      <RouterLink
        to="/resultados"
        class="btn btn--paper results-teaser__cta"
        data-reveal
        data-reveal-delay="0.26"
      >
        {{ site.hero.ctaSecondary }} <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.results-teaser {
  position: relative;
  background: $ink;
  color: $paper;
  overflow: hidden;

  :deep(.cursiva) {
    color: $blush;
  }

  &__inner {
    @include container(860px);
    @include flex(column, center, center, 1.1rem);
    position: relative;
    text-align: center;
    padding-block: $space-section;
    z-index: 1;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, center, 0.5rem);
    color: $blush;
  }

  &__title {
    @include display(clamp(2.2rem, 6vw, 4.4rem));
    color: $paper;
  }

  &__text {
    color: rgba($paper, 0.7);
    max-width: 46ch;
    margin-bottom: 0.8rem;
  }

  &__paw {
    position: absolute;
    color: rgba($paper, 0.07);

    &--one {
      font-size: 9rem;
      top: 10%;
      left: 4%;
      transform: rotate(-20deg);
    }

    &--two {
      font-size: 6rem;
      bottom: 8%;
      right: 7%;
      transform: rotate(16deg);
    }
  }
}
</style>
