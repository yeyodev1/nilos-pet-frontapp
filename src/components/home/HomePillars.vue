<script setup lang="ts">
import { site } from '@/config/site'
</script>

<template>
  <section class="pillars">
    <div class="pillars__inner">
      <p class="pillars__eyebrow">Lo que hacemos</p>
      <div class="pillars__list">
        <article v-for="(pillar, index) in site.pillars" :key="pillar.title" class="pillar">
          <span class="pillar__number">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="pillar__icon" aria-hidden="true"><i :class="pillar.icon"></i></span>
          <h2 class="pillar__title">{{ pillar.title }}</h2>
          <p class="pillar__text">{{ pillar.text }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.pillars {
  border-top: 1px solid $line;

  &__inner {
    @include container;
    padding-block: $space-xl;

    @include from('md') {
      padding-block: $space-section;
    }
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: $space-lg;
  }

  &__list {
    @include flex-cards(260px, 2.5rem);
  }
}

.pillar {
  @include flex(column, flex-start, flex-start, 0.8rem);
  border-top: 1px solid $line;
  padding-top: 1.4rem;
  @include transition(border-color);

  &:hover {
    border-top-color: $accent;
  }

  &__number {
    @include display($text-xl, 400);
    color: $ink-muted;
    font-style: italic;
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.8rem;
    height: 2.8rem;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
    font-size: 1rem;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__text {
    font-size: $text-sm;
    color: $ink-soft;
    max-width: 38ch;
  }
}
</style>
