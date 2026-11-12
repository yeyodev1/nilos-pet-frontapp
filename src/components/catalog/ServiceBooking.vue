<script setup lang="ts">
import type { Product } from '@/types'
import { useServiceBooking } from '@/composables/useServiceBooking'

const props = defineProps<{ products: Product[] }>()
const emit = defineEmits<{ done: [] }>()

const {
  branches,
  loadingBranches,
  branchId,
  date,
  endDate,
  minDate,
  customer,
  pet,
  bookable,
  payable,
  dateRange,
  selectedBranch,
  ready,
  sending,
  whatsappUrl,
  pay,
  book,
} = useServiceBooking(
  () => props.products,
  () => emit('done'),
)
</script>

<template>
  <div class="booking">
    <p v-if="loadingBranches" class="booking__hint">
      <i class="fa-solid fa-spinner fa-spin"></i> Cargando sucursales…
    </p>

    <template v-else>
      <fieldset class="booking__branches">
        <legend>Elige tu sucursal</legend>
        <label
          v-for="branch in branches"
          :key="branch._id"
          class="booking__branch"
          :class="{ 'booking__branch--on': branchId === branch._id }"
        >
          <input v-model="branchId" type="radio" class="visually-hidden" :value="branch._id" />
          <i class="fa-solid fa-location-dot"></i>
          <span>
            <strong>{{ branch.name }}</strong>
            <small>{{ branch.hours }}</small>
          </span>
        </label>
      </fieldset>

      <template v-if="bookable">
        <div class="booking__pair">
          <div>
            <label for="booking-date">{{
              dateRange ? 'Fecha de ingreso' : 'Fecha preferida'
            }}</label>
            <input id="booking-date" v-model="date" type="date" :min="minDate" />
          </div>
          <div v-if="dateRange">
            <label for="booking-end">Fecha de salida</label>
            <input id="booking-end" v-model="endDate" type="date" :min="date || minDate" />
          </div>
        </div>

        <div class="booking__pair">
          <div>
            <label for="booking-name">Nombre y apellido *</label>
            <input id="booking-name" v-model="customer.name" type="text" autocomplete="name" />
          </div>
          <div>
            <label for="booking-phone">Teléfono *</label>
            <input id="booking-phone" v-model="customer.phone" type="tel" autocomplete="tel" />
          </div>
        </div>
        <div>
          <label for="booking-email">Correo</label>
          <input id="booking-email" v-model="customer.email" type="email" autocomplete="email" />
        </div>
        <div class="booking__pair">
          <div>
            <label for="booking-pet">Nombre de la mascota *</label>
            <input id="booking-pet" v-model="pet.name" type="text" />
          </div>
          <div>
            <label for="booking-species">Especie *</label>
            <select id="booking-species" v-model="pet.species">
              <option value="" disabled>Elige</option>
              <option>Canino</option>
              <option>Felino</option>
              <option>Otro</option>
            </select>
          </div>
          <div>
            <label for="booking-breed">Raza *</label>
            <input id="booking-breed" v-model="pet.breed" type="text" />
          </div>
        </div>
      </template>

      <div class="booking__actions">
        <button v-if="payable" class="btn btn--primary" :disabled="!ready" @click="pay">
          <i class="fa-solid fa-credit-card"></i> Reservar y pagar en línea
        </button>
        <button
          v-if="bookable"
          class="btn"
          :class="payable ? 'btn--ghost' : 'btn--primary'"
          :disabled="!ready || sending"
          @click="book"
        >
          <i class="fa-solid fa-calendar-check"></i>
          {{ sending ? 'Enviando…' : payable ? 'Solo reservar' : 'Reservar' }}
        </button>
        <a
          v-if="!payable"
          class="btn booking__whatsapp"
          :class="{ 'booking__whatsapp--off': !selectedBranch }"
          :href="whatsappUrl"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp"></i> Consultar por WhatsApp
        </a>
      </div>
      <p v-if="!selectedBranch" class="booking__hint">Elige una sucursal para continuar.</p>
    </template>
  </div>
</template>

<style scoped lang="scss">
.booking {
  @include flex(column, stretch, flex-start, 1rem);
  text-align: left;

  &__hint {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__branches {
    @include flex-cards(220px, 0.6rem);
    border: none;

    legend {
      @include eyebrow;
      margin-bottom: 0.6rem;
    }
  }

  &__branch {
    @include card;
    @include flex(row, flex-start, flex-start, 0.6rem);
    padding: 0.8rem 0.9rem;
    margin: 0;
    cursor: pointer;
    color: $ink;
    @include transition;

    i {
      color: $accent;
      margin-top: 0.2rem;
    }

    strong {
      display: block;
      font-size: $text-sm;
    }

    small {
      font-size: $text-xs;
      color: $ink-muted;
    }

    &--on {
      border-color: $accent;
      background: $accent-soft;
    }

    &:has(:focus-visible) {
      outline: 2px solid $accent;
    }
  }

  &__pair {
    @include flex-cards(150px, 0.8rem);
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.3rem;
  }

  &__whatsapp {
    background: #1f9d57;
    color: $surface;

    &:hover {
      background: #17804a;
    }

    &--off {
      opacity: 0.45;
      pointer-events: none;
    }
  }
}
</style>
