<script setup lang="ts">
// Los servicios desfilan con foto en la home para invitar a reservar.
import { onMounted, ref } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useAutoCarousel } from '@/composables/useAutoCarousel'
import { formatMoney } from '@/utils/format'
import { finalPrice, productCategoryName } from '@/utils/catalog'
import type { Product } from '@/types'

const copy = site.servicesBand.carousel
const services = ref<Product[]>([])
const track = ref<HTMLElement | null>(null)
const { playing, hold, next, prev } = useAutoCarousel(track)

onMounted(async () => {
  const { items } = await catalogService
    .listProducts({ type: 'service', limit: 100 })
    .catch(() => ({ items: [] as Product[] }))
  services.value = items.filter((item) => item.images.length)
})
</script>

<template>
  <section
    v-if="services.length"
    class="carousel"
    aria-roledescription="carrusel"
    :aria-label="copy.label"
    @mouseenter="hold = true"
    @mouseleave="hold = false"
    @focusin="hold = true"
    @focusout="hold = false"
  >
    <div class="carousel__controls">
      <button type="button" :aria-label="copy.prev" @click="prev">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
      </button>
      <button
        type="button"
        :aria-label="playing ? copy.pause : copy.play"
        @click="playing = !playing"
      >
        <i :class="playing ? 'fa-solid fa-pause' : 'fa-solid fa-play'" aria-hidden="true"></i>
      </button>
      <button type="button" :aria-label="copy.next" @click="next">
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>

    <div ref="track" class="carousel__track" tabindex="0" role="group" :aria-label="copy.label">
      <RouterLink
        v-for="(service, index) in services"
        :key="service._id"
        to="/servicios"
        class="carousel__card"
        role="group"
        aria-roledescription="diapositiva"
        :aria-label="`${index + 1} de ${services.length}: ${service.name}`"
      >
        <img :src="service.images[0]?.url" :alt="service.name" loading="lazy" />
        <span class="carousel__tag">{{ productCategoryName(service) }}</span>
        <span class="carousel__body">
          <strong>{{ service.name }}</strong>
          <small v-if="service.price > 0">
            {{ service.priceFrom ? copy.from : '' }} {{ formatMoney(finalPrice(service) / 100) }}
          </small>
          <span class="carousel__cta">{{ copy.cta }} <i class="fa-solid fa-arrow-right"></i></span>
        </span>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped lang="scss">
.carousel {
  position: relative;
  padding-bottom: $space-md;

  &__controls {
    @include container;
    @include flex(row, center, flex-end, 0.5rem);
    margin-bottom: 1rem;

    button {
      @include flex(row, center, center);
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 50%;
      border: 1.5px solid rgba($paper, 0.55);
      color: $paper;
      touch-action: manipulation;
      @include transition(background color);
      @include focus-ring($paper);

      &:hover {
        background: $paper;
        color: $accent;
      }
    }
  }

  &__track {
    @include flex(row, stretch, flex-start, 1.1rem);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    scrollbar-width: none;
    padding: 0.5rem max(1.25rem, calc((100vw - 1160px) / 2 + 2rem)) 1rem;
    scroll-padding-inline: max(1.25rem, calc((100vw - 1160px) / 2 + 2rem));
    @include focus-ring($paper);

    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }

  &__card {
    position: relative;
    flex: 0 0 min(78vw, 300px);
    scroll-snap-align: start;
    border-radius: $radius-md;
    overflow: hidden;
    background: $paper;
    color: $ink;
    box-shadow: $shadow-lg;
    @include transition(transform);
    @include focus-ring($paper);

    &:nth-child(odd) {
      rotate: -1deg;
    }

    &:nth-child(even) {
      rotate: 1deg;
    }

    &:hover {
      rotate: 0deg;
      transform: translateY(-4px);

      img {
        scale: 1.05;
      }
    }

    img {
      width: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
      @include transition(scale);
    }
  }

  &__tag {
    @include eyebrow;
    position: absolute;
    top: 0.8rem;
    left: 0.8rem;
    font-size: 0.6rem;
    background: $paper;
    padding: 0.3rem 0.7rem;
    border-radius: $radius-pill;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.2rem);
    padding: 1rem 1.1rem 1.2rem;

    strong {
      @include display($text-xl, 500);
    }

    small {
      font-weight: 600;
      color: $accent;
    }
  }

  &__cta {
    @include flex(row, center, flex-start, 0.4rem);
    margin-top: 0.4rem;
    font-size: $text-xs;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $accent-deep;
  }
}
</style>
