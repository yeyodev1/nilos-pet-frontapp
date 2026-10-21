<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useGsapReveal } from '@/composables/useGsapReveal'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import PawPrint from '@/components/ui/PawPrint.vue'

const root = ref<HTMLElement | null>(null)
useGsapReveal(root)

// Cada tarjeta llega con su propia inclinación: mano puesta, no plantilla.
const tilts = [-3, 2, -2, 3]
</script>

<template>
  <section ref="root" class="steps">
    <span class="steps__paw" data-parallax="0.4" aria-hidden="true"><PawPrint /></span>
    <div class="steps__inner">
      <header class="steps__head" data-reveal>
        <p class="steps__eyebrow">{{ site.howItWorks.eyebrow }}</p>
        <h2 class="steps__title">
          <DisplayParts :parts="site.howItWorks.titleParts" />
        </h2>
      </header>

      <ol class="steps__list">
        <li
          v-for="(step, index) in site.howItWorks.steps"
          :key="step.title"
          class="step"
          :style="{ '--tilt': `${tilts[index % tilts.length]}deg` }"
          data-reveal
          :data-reveal-delay="index * 0.1"
        >
          <span class="step__number">{{ String(index + 1).padStart(2, '0') }}.</span>
          <span class="step__icon" aria-hidden="true"><i :class="step.icon"></i></span>
          <h3 class="step__title">{{ step.title }}</h3>
          <p class="step__text">{{ step.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.steps {
  position: relative;
  background: $sand;
  overflow: hidden;

  &__inner {
    @include container;
    padding-block: $space-xl;

    @include from('md') {
      padding-block: $space-section;
    }
  }

  &__head {
    @include flex(column, center, center, 0.7rem);
    text-align: center;
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
  }

  &__paw {
    position: absolute;
    top: -2rem;
    right: -2.5rem;
    font-size: 11rem;
    color: rgba($blush, 0.5);
    transform: rotate(18deg);
  }

  &__list {
    @include flex-cards(230px, 1.6rem);
    list-style: none;
    max-width: 1060px;
    margin-inline: auto;

    @include from('lg') {
      gap: 2rem;
    }
  }
}

.step {
  position: relative;
  @include flex(column, flex-start, flex-start, 0.7rem);
  background: $surface;
  border-radius: $radius-md;
  padding: 1.6rem 1.4rem 1.8rem;
  box-shadow: $shadow-sm;
  transform: rotate(var(--tilt));
  @include transition(transform box-shadow);

  // Al pasar el cursor la tarjeta se endereza: pequeño gesto juguetón.
  &:hover {
    transform: rotate(0deg) translateY(-6px);
    box-shadow: $shadow-md;
  }

  @include reduced-motion {
    transform: none;

    &:hover {
      transform: none;
    }
  }

  &__number {
    @include display(2rem, 600);
    font-style: italic;
    color: $blush-deep;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
    background: $blush-soft;
    color: $accent-deep;
    font-size: 0.95rem;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
  }
}
</style>
