<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useServicesPicker } from '@/composables/useServicesPicker'
import ServiceRow from '@/components/services/ServiceRow.vue'
import ServiceModal from '@/components/services/ServiceModal.vue'
import GroupFilter from '@/components/services/GroupFilter.vue'
import type { Product } from '@/types'

const copy = site.servicesPage
const { loading, error, reload, group, groups, visible } = useServicesPicker(
  'service',
  site.serviceGroups,
)

const open = ref<Product | null>(null)
</script>

<template>
  <div class="services">
    <header class="services__head">
      <p class="services__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="services__title">{{ copy.title }}</h1>
      <p class="services__subtitle">{{ copy.subtitle }}</p>
    </header>

    <ol class="services__flow">
      <li v-for="(step, index) in copy.flow" :key="step.label" class="services__flow-step">
        <span class="services__flow-number">{{ String(index + 1).padStart(2, '0') }}</span>
        <i :class="step.icon" aria-hidden="true"></i>
        <span>{{ step.label }}</span>
      </li>
    </ol>

    <GroupFilter v-model="group" :groups="groups" :all-label="copy.all" />

    <section class="services__list" aria-live="polite">
      <div v-if="loading" class="services__skeleton" aria-hidden="true">
        <div v-for="n in 4" :key="n" class="services__skeleton-row"></div>
      </div>

      <div v-else-if="error" class="services__state">
        <h2 class="services__state-title">No pudimos cargar los servicios</h2>
        <p class="services__state-text">{{ error }}</p>
        <button class="btn btn--ghost" @click="reload">Reintentar</button>
      </div>

      <ServiceRow
        v-for="service in visible"
        v-else
        :key="service._id"
        :service="service"
        @open="open = service"
      />
    </section>

    <ServiceModal :products="open ? [open] : []" :title="open?.name || ''" @close="open = null" />
  </div>
</template>

<style scoped lang="scss">
.services {
  @include container(960px);
  padding-block: $space-lg $space-xl;

  &__head {
    @include flex(column, flex-start, flex-start, 0.8rem);
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2.4rem, 6vw, 4.2rem));
  }

  &__subtitle {
    color: $ink-soft;
    max-width: 52ch;
  }

  &__flow {
    @include flex-cards(170px, 1rem);
    list-style: none;
    margin-bottom: $space-lg;

    // Tarjetas apenas ladeadas que se enderezan al hover: el gesto de la marca.
    &-step {
      @include card;
      @include flex(column, flex-start, flex-start, 0.4rem);
      border-color: transparent;
      box-shadow: $shadow-sm;
      padding: 1.1rem 1.2rem;
      font-size: $text-sm;
      font-weight: 500;
      @include transition(transform);

      &:nth-child(odd) {
        background: $sand;
        transform: rotate(-1.5deg);
      }

      &:nth-child(even) {
        background: $blush-soft;
        transform: rotate(1.5deg);
      }

      &:hover {
        transform: rotate(0deg) translateY(-3px);
      }

      @include reduced-motion {
        transform: none;

        &:hover {
          transform: none;
        }
      }

      i {
        color: $accent-deep;
      }
    }

    &-number {
      @include display(1.3rem, 600);
      font-style: italic;
      color: $blush-deep;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__skeleton {
    @include flex(column, stretch, flex-start, 0.8rem);

    &-row {
      height: 4.4rem;
      border-radius: $radius-md;
      background: $sand;
      animation: pulso 1.4s ease-in-out infinite;
    }
  }

  &__state {
    @include flex(column, center, center, 0.7rem);
    text-align: center;
    padding-block: $space-xl;

    &-icon {
      @include flex(row, center, center);
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      background: $sand;
      color: $accent;
      font-size: 1.3rem;
    }

    &-title {
      @include display($display-sm, 500);
    }

    &-text {
      color: $ink-soft;
      max-width: 44ch;
    }
  }
}

@keyframes pulso {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}
</style>
