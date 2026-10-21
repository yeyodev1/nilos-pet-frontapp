<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useGsapReveal } from '@/composables/useGsapReveal'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import nilos from '@/assets/logo-nilos.webp'

const root = ref<HTMLElement | null>(null)
useGsapReveal(root)
</script>

<template>
  <section ref="root" class="home-cta">
    <span class="home-cta__arc" aria-hidden="true"></span>
    <div class="home-cta__inner">
      <img
        class="home-cta__mascot"
        :src="nilos"
        :alt="`${site.name} — ${site.tagline}`"
        width="180"
        height="156"
        data-reveal
      />
      <h2 class="home-cta__title" data-reveal data-reveal-delay="0.1">
        <DisplayParts :parts="site.finalCta.titleParts" />
      </h2>
      <div class="home-cta__actions" data-reveal data-reveal-delay="0.2">
        <RouterLink to="/tienda" class="btn btn--primary">
          {{ site.hero.ctaPrimary }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
        <RouterLink to="/servicios" class="btn btn--ghost">
          {{ site.finalCta.ctaSecondary }}
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-cta {
  position: relative;
  overflow: hidden;

  &__inner {
    @include container(760px);
    @include flex(column, center, center, 1.4rem);
    position: relative;
    text-align: center;
    padding-block: $space-section;
    z-index: 1;
  }

  &__mascot {
    width: clamp(130px, 18vw, 180px);
    height: auto;
    filter: drop-shadow(0 14px 24px rgba($ink, 0.18));
    @include transition(transform);

    &:hover {
      transform: rotate(-3deg) scale(1.05);
    }
  }

  &__title {
    @include display($display-md);
    max-width: 20ch;
  }

  &__actions {
    @include flex(row, center, center, 0.8rem);
    flex-wrap: wrap;
  }

  &__arc {
    position: absolute;
    right: -110px;
    top: 50%;
    width: 280px;
    height: 280px;
    border: 3px solid transparent;
    border-top-color: rgba($blush-deep, 0.4);
    border-left-color: rgba($blush-deep, 0.4);
    border-radius: 50%;
    transform: rotate(120deg);
  }
}
</style>
