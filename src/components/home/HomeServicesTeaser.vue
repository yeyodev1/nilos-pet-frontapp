<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useGsapReveal } from '@/composables/useGsapReveal'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import PawPrint from '@/components/ui/PawPrint.vue'
import HomeServicesCarousel from '@/components/home/HomeServicesCarousel.vue'

const root = ref<HTMLElement | null>(null)
useGsapReveal(root)
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
    </div>

    <HomeServicesCarousel />
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
      align-items: flex-end;
      justify-content: space-between;
      gap: 4rem;
      padding-block: $space-section $space-lg;
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
    max-width: 52ch;
    margin-bottom: 0.5rem;
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
