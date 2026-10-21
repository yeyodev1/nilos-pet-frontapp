<script setup lang="ts">
import { site } from '@/config/site'
</script>

<template>
  <section class="results-teaser">
    <div class="results-teaser__inner">
      <span class="results-teaser__icon" aria-hidden="true">
        <i class="fa-solid fa-file-waveform"></i>
      </span>
      <p class="results-teaser__eyebrow">Resultados en línea</p>
      <h2 class="results-teaser__title">{{ site.examResults.title }}</h2>
      <p class="results-teaser__text">{{ site.examResults.subtitle }}</p>
      <RouterLink to="/resultados" class="btn btn--primary">
        {{ site.hero.ctaSecondary }} <i class="fa-solid fa-arrow-right"></i>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.results-teaser {
  background: $ink;
  color: $paper;

  &__inner {
    @include container(820px);
    @include flex(column, center, center, 1rem);
    text-align: center;
    padding-block: $space-section;
  }

  &__icon {
    @include flex(row, center, center);
    width: 3.4rem;
    height: 3.4rem;
    border-radius: 50%;
    background: rgba($paper, 0.08);
    color: $accent-soft;
    font-size: 1.3rem;
    margin-bottom: 0.4rem;
  }

  &__eyebrow {
    @include eyebrow;
    color: $accent-soft;
  }

  &__title {
    @include display($display-md);
    color: $paper;
  }

  &__text {
    color: rgba($paper, 0.7);
    max-width: 46ch;
    margin-bottom: 0.8rem;
  }
}
</style>
