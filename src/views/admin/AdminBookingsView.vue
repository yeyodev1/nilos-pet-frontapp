<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminPaginator from '@/components/admin/AdminPaginator.vue'
import StatusPill from '@/components/admin/StatusPill.vue'
import { bookingStatusMeta, formatDateTime } from '@/components/admin/adminFormat'
import { adminService } from '@/services/admin.service'
import { useAdminList } from '@/composables/useAdminList'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Booking, BookingStatus } from '@/types'

const route = useRoute()
const toastStore = useToastStore()

const statusFilters = [
  { value: '', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'done', label: 'Realizadas' },
  { value: 'canceled', label: 'Canceladas' },
]

const status = ref((route.query.status as string) || '')

const { items, loading, error, page, pages, total } = useAdminList<Booking>(
  (pageNumber) =>
    adminService.listBookings({ status: status.value || undefined, page: pageNumber }),
  { filters: [status] },
)

function serviceName(booking: Booking): string {
  return typeof booking.product === 'object' ? booking.product.name : 'Servicio'
}

function branchName(booking: Booking): string {
  return typeof booking.branch === 'object' ? booking.branch.name : ''
}

/** Cambio de estado directo en la fila, con reversa si el API falla. */
async function changeStatus(booking: Booking, event: Event) {
  const select = event.target as HTMLSelectElement
  const next = select.value as BookingStatus
  const previous = booking.status
  booking.status = next
  try {
    await adminService.updateBookingStatus(booking._id, next)
    toastStore.success(`Reserva ${bookingStatusMeta[next].label.toLowerCase()}`)
  } catch (e) {
    booking.status = previous
    select.value = previous
    toastStore.error((e as ApiError).message)
  }
}
</script>

<template>
  <div class="bookings">
    <AdminPageHead
      title="Reservas"
      subtitle="Confirma, marca como realizadas o cancela directo en cada fila."
    />

    <div class="bookings__filters" role="group" aria-label="Filtrar por estado">
      <button
        v-for="filter in statusFilters"
        :key="filter.value"
        class="bookings__chip"
        :class="{ 'bookings__chip--on': status === filter.value }"
        type="button"
        @click="status = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <AdminTable
      :loading="loading"
      :error="error"
      :count="items.length"
      empty-text="No hay reservas con ese estado."
      empty-icon="fa-solid fa-calendar-check"
    >
      <article
        v-for="booking in items"
        :key="booking._id"
        class="atable__row"
        :class="{ 'atable__row--alert': booking.status === 'pending' }"
      >
        <div class="atable__main">
          <span class="atable__title">{{ serviceName(booking) }}</span>
          <span class="atable__meta">
            <i class="fa-solid fa-calendar-day bookings__meta-icon"></i>
            {{ formatDateTime(booking.preferredAt) }}
            <template v-if="branchName(booking)"> · {{ branchName(booking) }}</template>
          </span>
          <span class="atable__meta">
            {{ booking.customer.name }} · {{ booking.customer.phone }}
          </span>
          <span v-if="booking.notes" class="bookings__notes">“{{ booking.notes }}”</span>
        </div>
        <div class="atable__cell">
          <StatusPill
            :label="bookingStatusMeta[booking.status]?.label || booking.status"
            :tone="bookingStatusMeta[booking.status]?.tone"
          />
          <select
            class="bookings__status"
            :value="booking.status"
            :aria-label="`Cambiar estado de la reserva de ${booking.customer.name}`"
            @change="changeStatus(booking, $event)"
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="done">Realizada</option>
            <option value="canceled">Cancelada</option>
          </select>
        </div>
      </article>
    </AdminTable>

    <AdminPaginator v-model:page="page" :pages="pages" :total="total" />
  </div>
</template>

<style scoped lang="scss">
.bookings {
  &__filters {
    @include flex(row, center, flex-start, 0.45rem);
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  &__chip {
    font-size: $text-sm;
    font-weight: 600;
    padding: 0.45rem 1rem;
    border-radius: $radius-pill;
    border: 1px solid $line;
    background: $surface;
    color: $ink-soft;
    @include transition;
    @include focus-ring;

    &:hover {
      border-color: $accent;
      color: $accent;
    }

    &--on {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }

  &__meta-icon {
    color: $accent;
    font-size: 0.72rem;
    margin-right: 0.25rem;
  }

  &__notes {
    display: block;
    font-size: $text-xs;
    color: $ink-soft;
    font-style: italic;
    margin-top: 0.15rem;
  }

  &__status {
    width: auto;
    padding-block: 0.45rem;
    font-size: $text-sm;
  }
}
</style>
