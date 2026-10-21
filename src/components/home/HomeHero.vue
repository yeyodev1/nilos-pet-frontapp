<script setup lang="ts">
import { computed, ref } from 'vue'
import { site } from '@/config/site'
import { gsap, useGsapReveal } from '@/composables/useGsapReveal'
import PawPrint from '@/components/ui/PawPrint.vue'
import HomeHeroScene from '@/components/home/HomeHeroScene.vue'

const root = ref<HTMLElement | null>(null)

// El titular se parte en palabras para animar la entrada palabra por palabra.
const words = computed(() =>
  site.hero.titleParts.flatMap((part) =>
    part.text
      .split(/\s+/)
      .filter(Boolean)
      .map((text) => ({ text, italic: 'italic' in part && part.italic })),
  ),
)

useGsapReveal(root, () => {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
  tl.from('.hero__eyebrow', { autoAlpha: 0, y: 14, duration: 0.6 }, 0.1)
    .from('.hero__word', { autoAlpha: 0, yPercent: 65, duration: 0.8, stagger: 0.05 }, 0.2)
    .from(
      '.hero__subtitle, .hero__actions, .hero__stats',
      {
        autoAlpha: 0,
        y: 18,
        duration: 0.7,
        stagger: 0.12,
      },
      0.65,
    )
    .from(
      '.hero__media',
      {
        autoAlpha: 0,
        scale: 0.88,
        rotation: -4,
        duration: 0.9,
        ease: 'back.out(1.5)',
      },
      0.4,
    )
    .from(
      '.scene__sticker',
      { scale: 0, rotation: -28, duration: 0.55, ease: 'back.out(2.2)' },
      1.1,
    )
})
</script>

<template>
  <section ref="root" class="hero">
    <span class="hero__blob" aria-hidden="true"></span>
    <span class="hero__arc hero__arc--one" aria-hidden="true"></span>
    <span class="hero__paw hero__paw--one" data-parallax="0.3" aria-hidden="true">
      <PawPrint />
    </span>
    <span class="hero__paw hero__paw--two" data-parallax="0.55" aria-hidden="true">
      <PawPrint />
    </span>

    <div class="hero__inner">
      <div class="hero__copy">
        <p class="hero__eyebrow">
          <PawPrint class="hero__eyebrow-paw" />
          {{ site.hero.eyebrow }}
        </p>
        <h1 class="hero__title">
          <template v-for="(word, index) in words" :key="index">
            <span class="hero__word" :class="{ cursiva: word.italic }">{{ word.text }}</span>
            {{ ' ' }}
          </template>
        </h1>
        <p class="hero__subtitle">{{ site.hero.subtitle }}</p>
        <div class="hero__actions">
          <RouterLink to="/tienda" class="btn btn--primary">
            {{ site.hero.ctaPrimary }} <i class="fa-solid fa-arrow-right"></i>
          </RouterLink>
          <RouterLink to="/resultados" class="btn btn--ghost">
            {{ site.hero.ctaSecondary }}
          </RouterLink>
        </div>

        <dl class="hero__stats">
          <div v-for="stat in site.hero.stats" :key="stat.label" class="hero__stat">
            <dt class="hero__stat-label">{{ stat.label }}</dt>
            <dd class="hero__stat-value" :data-count="stat.value" :data-count-suffix="stat.suffix">
              {{ stat.value }}{{ stat.suffix }}
            </dd>
          </div>
        </dl>
      </div>

      <HomeHeroScene class="hero__media" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;

  &__inner {
    @include container;
    @include flex(column, stretch, flex-start, 3rem);
    position: relative;
    padding-block: $space-lg $space-xl;

    @include from('lg') {
      flex-direction: row;
      align-items: center;
      gap: 3.5rem;
      padding-block: $space-xl $space-section;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1.4rem);
    flex: 1.2;
    position: relative;
    z-index: 2;
  }

  &__eyebrow {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.55rem);
    background: $surface;
    border: 1px solid $line;
    border-radius: $radius-pill;
    padding: 0.5rem 1rem;
  }

  &__eyebrow-paw {
    font-size: 0.95rem;
    color: $accent;
  }

  &__title {
    @include display(clamp(2.7rem, 8vw, 6rem), 500);
    line-height: 1.02;
    max-width: 13ch;
    text-wrap: initial;
  }

  &__word {
    display: inline-block;

    &.cursiva {
      font-weight: 400;
    }
  }

  &__subtitle {
    font-size: $text-lg;
    color: $ink-soft;
    max-width: 46ch;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
    margin-top: 0.3rem;
  }

  &__stats {
    @include flex(row, stretch, flex-start, 0);
    flex-wrap: wrap;
    margin-top: 1.1rem;
    border-top: 1px solid $line;
  }

  &__stat {
    @include flex(column-reverse, flex-start, flex-end, 0.1rem);
    padding: 1rem 1.6rem 0 0;

    & + & {
      padding-left: 1.6rem;
      border-left: 1px solid $line;
    }
  }

  &__stat-value {
    @include display(clamp(1.7rem, 3.4vw, 2.5rem), 600);
    color: $accent;
    font-variant-numeric: tabular-nums;
  }

  &__stat-label {
    @include eyebrow;
    color: $ink-muted;
  }

  &__media {
    flex: 0.9;
  }

  // ─── Decoración: blob, arcos y huellas ───
  &__blob {
    position: absolute;
    top: -18%;
    right: -22%;
    width: clamp(320px, 55vw, 760px);
    height: clamp(320px, 55vw, 760px);
    background: $blush-soft;
    border-radius: 58% 42% 55% 45% / 48% 55% 45% 52%;
    z-index: 0;
  }

  &__arc--one {
    position: absolute;
    width: 220px;
    height: 220px;
    left: -90px;
    bottom: 8%;
    border: 3px solid transparent;
    border-top-color: rgba($accent, 0.3);
    border-right-color: rgba($accent, 0.3);
    border-radius: 50%;
    transform: rotate(35deg);
    z-index: 0;
  }

  &__paw {
    position: absolute;
    color: rgba($accent, 0.16);
    z-index: 0;

    &--one {
      font-size: 4.4rem;
      top: 12%;
      right: 6%;
      transform: rotate(-18deg);
    }

    &--two {
      font-size: 2.6rem;
      bottom: 16%;
      left: 42%;
      transform: rotate(22deg);
      display: none;

      @include from('lg') {
        display: block;
      }
    }
  }
}
</style>
