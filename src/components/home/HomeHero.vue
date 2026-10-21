<script setup lang="ts">
import { site } from '@/config/site'
import mascota from '@/assets/mascota.jpeg'
</script>

<template>
  <section class="hero">
    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">{{ site.hero.eyebrow }}</p>
        <h1 class="hero__title">{{ site.hero.title }}</h1>
        <p class="hero__subtitle">{{ site.hero.subtitle }}</p>
        <div class="hero__actions">
          <RouterLink to="/tienda" class="btn btn--primary">
            {{ site.hero.ctaPrimary }} <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
          <RouterLink to="/resultados" class="btn btn--ghost">
            {{ site.hero.ctaSecondary }}
          </RouterLink>
        </div>
      </div>

      <!-- La ilustración viene con fondo negro: vive en un panel oscuro propio. -->
      <div class="hero__media">
        <img :src="mascota" alt="Nilos, la mascota de Nilos Pet" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 2.5rem);
    padding-block: $space-xl $space-section;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
      padding-block: $space-section;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.3rem);
    flex: 1.15;
    animation: subir 0.7s $ease both;

    @include reduced-motion {
      animation: none;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-lg);
    max-width: 14ch;
  }

  &__subtitle {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 48ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
    margin-top: 0.5rem;
  }

  &__media {
    // Fondo negro sólido: el JPEG de la mascota se funde sin bordes visibles.
    @include flex(row, center, center);
    flex: 0.85;
    background: #000;
    border-radius: $radius-lg;
    padding: clamp(1.2rem, 4vw, 2.5rem);
    overflow: hidden;
    animation: subir 0.7s $ease 0.12s both;

    @include reduced-motion {
      animation: none;
    }

    img {
      width: 100%;
      max-width: 440px;
      height: auto;
    }
  }
}

@keyframes subir {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
