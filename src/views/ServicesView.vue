<script setup lang="ts">
import { site } from '@/config/site'
import { useServicesPicker } from '@/composables/useServicesPicker'
import { formatMoney } from '@/utils/format'
import ServiceRow from '@/components/services/ServiceRow.vue'

// El segundo pilar es el copy oficial de servicios.
const pillar = site.pillars[1]

const {
  services,
  loading,
  error,
  reload,
  toggle,
  isSelected,
  selectedServices,
  totalCents,
  hasUnpricedSelected,
  infoMode,
  addSelectionToCart,
} = useServicesPicker()

const flow = [
  { icon: 'fa-solid fa-list-check', label: 'Elige tus servicios' },
  { icon: 'fa-solid fa-calendar-check', label: 'Reserva en tu sucursal' },
  { icon: 'fa-solid fa-credit-card', label: 'Paga en línea o en el local' },
  { icon: 'fa-solid fa-file-waveform', label: 'Resultados en línea' },
]
</script>

<template>
  <div class="services">
    <header class="services__head">
      <p class="services__eyebrow">Servicios</p>
      <h1 class="services__title">{{ pillar.title }}</h1>
      <p class="services__subtitle">{{ pillar.text }}</p>
    </header>

    <ol class="services__flow">
      <li v-for="(step, index) in flow" :key="step.label" class="services__flow-step">
        <span class="services__flow-number">{{ String(index + 1).padStart(2, '0') }}</span>
        <i :class="step.icon" aria-hidden="true"></i>
        <span>{{ step.label }}</span>
      </li>
    </ol>

    <section class="services__list" aria-live="polite">
      <div v-if="loading" class="services__skeleton" aria-hidden="true">
        <div v-for="n in 4" :key="n" class="services__skeleton-row"></div>
      </div>

      <div v-else-if="error" class="services__state">
        <h2 class="services__state-title">No pudimos cargar los servicios</h2>
        <p class="services__state-text">{{ error }}</p>
        <button class="btn btn--ghost" @click="reload">Reintentar</button>
      </div>

      <div v-else-if="services.length === 0" class="services__state">
        <span class="services__state-icon"><i class="fa-solid fa-stethoscope"></i></span>
        <h2 class="services__state-title">Catálogo en preparación</h2>
        <p class="services__state-text">
          Estamos cargando los servicios disponibles. Vuelve pronto.
        </p>
      </div>

      <!-- Sin precios en línea, la página informa y manda a reservar. -->
      <template v-else-if="infoMode">
        <ServiceRow v-for="service in services" :key="service._id" :service="service" mode="link" />
      </template>

      <template v-else>
        <ServiceRow
          v-for="service in services"
          :key="service._id"
          :service="service"
          mode="pick"
          :selected="isSelected(service._id)"
          @toggle="toggle(service._id)"
        />
      </template>
    </section>

    <Transition name="rise">
      <div v-if="selectedServices.length > 0" class="services__summary">
        <div class="services__summary-info">
          <span class="services__summary-count">
            {{ selectedServices.length }}
            {{ selectedServices.length === 1 ? 'servicio' : 'servicios' }}
          </span>
          <span class="services__summary-total">{{ formatMoney(totalCents / 100) }}</span>
          <span v-if="hasUnpricedSelected" class="services__summary-note">
            Los servicios sin precio se confirman en sucursal
          </span>
        </div>
        <button class="btn btn--primary" @click="addSelectionToCart">
          <i class="fa-solid fa-bag-shopping"></i> Agregar al carrito
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.services {
  @include container(880px);
  padding-block: $space-lg 9rem;

  &__head {
    @include flex(column, flex-start, flex-start, 0.8rem);
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
  }

  &__subtitle {
    color: $ink-soft;
    max-width: 52ch;
  }

  &__flow {
    @include flex-cards(170px, 0.8rem);
    list-style: none;
    margin-bottom: $space-lg;

    &-step {
      @include card;
      @include flex(column, flex-start, flex-start, 0.4rem);
      background: $sand;
      border-color: transparent;
      padding: 1rem 1.1rem;
      font-size: $text-sm;
      font-weight: 500;

      i {
        color: $accent-deep;
      }
    }

    &-number {
      @include eyebrow;
      font-size: 0.6rem;
      color: $ink-muted;
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

  &__summary {
    position: fixed;
    bottom: 1.2rem;
    left: 1.25rem;
    right: 1.25rem;
    z-index: 80;
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    background: $ink;
    color: $paper;
    border-radius: $radius-md;
    padding: 1rem 1.3rem;
    box-shadow: $shadow-lg;

    // Centrado con márgenes, no con transform: la transición "rise" ya usa
    // transform y lo pisaría durante la animación.
    @include from('md') {
      max-width: 640px;
      margin-inline: auto;
    }

    &-info {
      @include flex(column, flex-start, flex-start, 0.1rem);
    }

    &-count {
      @include eyebrow;
      color: $accent-soft;
    }

    &-total {
      @include display($text-xl, 600);
      color: $paper;
    }

    &-note {
      font-size: $text-xs;
      color: rgba($paper, 0.6);
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
