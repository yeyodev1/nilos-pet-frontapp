<script setup lang="ts">
import { site } from '@/config/site'

// El segundo pilar ES la sección de servicios: se reutiliza su copy.
const pillar = site.pillars[1]
</script>

<template>
  <section class="services-teaser">
    <div class="services-teaser__inner">
      <div class="services-teaser__copy">
        <p class="services-teaser__eyebrow">Servicios</p>
        <h2 class="services-teaser__title">{{ pillar.title }}</h2>
        <p class="services-teaser__text">{{ pillar.text }}</p>
        <RouterLink to="/servicios" class="btn btn--dark">
          Ver servicios <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

      <ul class="services-teaser__steps">
        <li>
          <span class="services-teaser__step-number">01</span>
          <span>Elige el servicio</span>
        </li>
        <li>
          <span class="services-teaser__step-number">02</span>
          <span>Reserva en tu sucursal</span>
        </li>
        <li>
          <span class="services-teaser__step-number">03</span>
          <span>Paga en línea o en el local</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.services-teaser {
  border-top: 1px solid $line;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: $space-xl;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
      padding-block: $space-section;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1rem);
    flex: 1.2;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
    max-width: 16ch;
  }

  &__text {
    color: $ink-soft;
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
      border-bottom: 1px solid $line;

      &:first-child {
        border-top: 1px solid $line;
      }
    }
  }

  &__step-number {
    @include eyebrow;
    color: $ink-muted;
  }
}
</style>
