<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { useServiceBooking } from '@/composables/useServiceBooking'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps<{ product: Product }>()

const {
  branches,
  loadingBranches,
  branchId,
  scheduledFor,
  minAt,
  selectedBranch,
  ready,
  addToCartAndPay,
  modalOpen,
  sending,
  customer,
  submitBooking,
} = useServiceBooking(() => props.product)

const canPay = computed(() => props.product.price > 0)

const modalMessage = computed(() =>
  selectedBranch.value
    ? `Déjanos tus datos y te confirmamos la cita en ${selectedBranch.value.name}.`
    : 'Déjanos tus datos y te confirmamos la cita.',
)
</script>

<template>
  <div class="booking">
    <p class="booking__eyebrow">Reserva tu cita</p>

    <template v-if="loadingBranches">
      <p class="booking__hint"><i class="fa-solid fa-spinner fa-spin"></i> Cargando sucursales…</p>
    </template>

    <template v-else-if="branches.length === 0">
      <p class="booking__hint">
        <i class="fa-solid fa-circle-info"></i>
        Aún no hay sucursales disponibles para reservar en línea.
      </p>
    </template>

    <template v-else>
      <div class="booking__field">
        <label for="booking-branch">Sucursal</label>
        <select id="booking-branch" v-model="branchId">
          <option value="" disabled>Elige una sucursal</option>
          <option v-for="branch in branches" :key="branch._id" :value="branch._id">
            {{ branch.name }} — {{ branch.city }}
          </option>
        </select>
        <p v-if="selectedBranch?.address" class="booking__address">
          <i class="fa-solid fa-location-dot"></i> {{ selectedBranch.address }}
        </p>
      </div>

      <div class="booking__field">
        <label for="booking-date">Fecha y hora preferida</label>
        <input id="booking-date" v-model="scheduledFor" type="datetime-local" :min="minAt" />
        <p class="booking__address">Agenda desde mañana; la sucursal confirma la hora exacta.</p>
      </div>

      <div class="booking__actions">
        <button v-if="canPay" class="btn btn--primary" :disabled="!ready" @click="addToCartAndPay">
          <i class="fa-solid fa-credit-card"></i> Reservar y pagar
        </button>
        <button class="btn btn--ghost" :disabled="!ready" @click="modalOpen = true">
          Solo reservar
        </button>
      </div>
    </template>

    <BaseModal
      :open="modalOpen"
      title="Solo reservar"
      :message="modalMessage"
      :confirm-label="sending ? 'Enviando…' : 'Enviar reserva'"
      @confirm="submitBooking"
      @cancel="modalOpen = false"
    >
      <div class="booking__form">
        <div class="booking__field">
          <label for="booking-name">Nombre</label>
          <input id="booking-name" v-model="customer.name" type="text" autocomplete="name" />
        </div>
        <div class="booking__field">
          <label for="booking-email">Correo</label>
          <input id="booking-email" v-model="customer.email" type="email" autocomplete="email" />
        </div>
        <div class="booking__field">
          <label for="booking-phone">Teléfono</label>
          <input id="booking-phone" v-model="customer.phone" type="tel" autocomplete="tel" />
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped lang="scss">
.booking {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  background: $sand;
  border-color: transparent;
  padding: 1.5rem 1.4rem;

  &__eyebrow {
    @include eyebrow;
  }

  &__hint {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__field {
    text-align: left;
    width: 100%;
  }

  &__address {
    @include flex(row, center, flex-start, 0.4rem);
    font-size: $text-xs;
    color: $ink-muted;
    margin-top: 0.4rem;
  }

  &__actions {
    @include flex(column, stretch, flex-start, 0.6rem);
    margin-top: 0.2rem;

    @include from('sm') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__form {
    @include flex(column, stretch, flex-start, 0.8rem);
    width: 100%;
    margin-top: 0.4rem;
  }
}
</style>
