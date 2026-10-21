<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useGsapReveal } from '@/composables/useGsapReveal'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import PawPrint from '@/components/ui/PawPrint.vue'

const root = ref<HTMLElement | null>(null)
useGsapReveal(root)

// Los tres pasos de reserva: copy corto, números grandes.
const steps = ['Elige el servicio', 'Reserva en tu sucursal', 'Paga en línea o en el local']
</script>

<template>
  <section ref="root" class="services-band">
    <span
      class="services-band__paw services-band__paw--one"
      data-parallax="0.35"
      aria-hidden="true"
    >
      <PawPrint />
    </span>
    <span class="services-band__arc" aria-hidden="true"></span>

    <div class="services-band__inner">
      <div class="services-band__copy" data-reveal>
        <p class="services-band__eyebrow">{{ site.servicesBand.eyebrow }}</p>
        <h2 class="services-band__title">
          <DisplayParts :parts="site.servicesBand.titleParts" />
        </h2>
        <p class="services-band__text">{{ site.servicesBand.text }}</p>
        <RouterLink to="/servicios" class="btn btn--paper">
          {{ site.servicesBand.cta }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

      <ol class="services-band__steps">
        <li v-for="(step, index) in steps" :key="step" data-reveal :data-reveal-delay="index * 0.1">
          <span class="services-band__step-number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="services-band__step-label">{{ step }}</span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped lang="scss">
.services-band {
  position: relative;
  background: $accent;
  color: $paper;
  overflow: hidden;

  // En banda vino la cursiva de acento se vuelve rosa para contrastar.
  :deep(.cursiva) {
    color: $blush;
  }

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    position: relative;
    padding-block: $space-xl;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
      padding-block: $space-section;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.1rem);
    flex: 1.2;
  }

  &__eyebrow {
    @include eyebrow;
    color: $blush;
  }

  &__title {
    @include display($display-md);
    color: $paper;
    max-width: 16ch;
  }

  &__text {
    color: rgba($paper, 0.78);
    max-width: 46ch;
    margin-bottom: 0.5rem;
  }

  &__steps {
    @include flex(column, stretch, flex-start);
    flex: 1;
    list-style: none;

    li {
      @include flex(row, baseline, flex-start, 1.2rem);
      font-family: $font-display;
      font-size: $text-xl;
      padding-block: 1.1rem;
      border-bottom: 1px solid rgba($paper, 0.18);
      @include transition(padding-left);

      &:first-child {
        border-top: 1px solid rgba($paper, 0.18);
      }

      &:hover {
        padding-left: 0.6rem;

        .services-band__step-label {
          font-style: italic;
        }
      }
    }
  }

  &__step-number {
    @include eyebrow;
    color: $blush;
  }

  &__paw--one {
    position: absolute;
    top: -3rem;
    right: 4%;
    font-size: 12rem;
    color: rgba($paper, 0.06);
    transform: rotate(-16deg);
  }

  &__arc {
    position: absolute;
    left: -80px;
    bottom: -120px;
    width: 260px;
    height: 260px;
    border: 3px solid transparent;
    border-top-color: rgba($blush, 0.55);
    border-right-color: rgba($blush, 0.55);
    border-radius: 50%;
    transform: rotate(140deg);
  }
}
</style>
