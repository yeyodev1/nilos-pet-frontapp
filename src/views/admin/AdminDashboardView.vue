<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import { adminService, type AdminStats } from '@/services/admin.service'
import type { ApiError } from '@/types'

const stats = ref<AdminStats | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    stats.value = await adminService.getStats()
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
})

const cards = computed(() => {
  if (!stats.value) return []
  const s = stats.value
  return [
    {
      icon: 'fa-solid fa-box-open',
      value: s.products,
      label: 'Productos',
      sub: `${s.published} publicados en la tienda`,
      to: '/admin/productos',
    },
    {
      icon: 'fa-solid fa-tag',
      value: s.unpriced,
      label: 'Sin precio',
      sub: 'productos por ponerles precio',
      to: '/admin/productos?priced=0',
      alert: s.unpriced > 0,
    },
    {
      icon: 'fa-solid fa-receipt',
      value: s.orders,
      label: 'Órdenes',
      sub: `${s.paidOrders} pagadas`,
      to: '/admin/ordenes',
    },
    {
      icon: 'fa-solid fa-calendar-check',
      value: s.bookings,
      label: 'Reservas',
      sub: `${s.pendingBookings} pendientes`,
      to: '/admin/reservas',
      alert: s.pendingBookings > 0,
    },
    {
      icon: 'fa-solid fa-file-waveform',
      value: s.examResults,
      label: 'Resultados',
      sub: 'exámenes subidos',
      to: '/admin/resultados',
    },
    {
      icon: 'fa-solid fa-users',
      value: s.customers,
      label: 'Clientes',
      sub: 'cuentas registradas',
      to: '/admin/clientes',
    },
  ]
})
</script>

<template>
  <div class="dash">
    <AdminPageHead title="Resumen" subtitle="Lo que está pasando en Nilos Pet, de un vistazo." />

    <div v-if="loading" class="dash__state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Cargando el resumen…</span>
    </div>

    <div v-else-if="error" class="dash__state dash__state--error">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ error }}</span>
    </div>

    <template v-else-if="stats">
      <div class="dash__alerts">
        <RouterLink v-if="stats.unpriced > 0" class="dash__alert" to="/admin/productos?priced=0">
          <i class="fa-solid fa-tag"></i>
          <span>
            <strong>{{ stats.unpriced }}</strong>
            {{ stats.unpriced === 1 ? 'producto sigue' : 'productos siguen' }} sin precio — ponles
            precio y publícalos
          </span>
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
        <RouterLink
          v-if="stats.pendingBookings > 0"
          class="dash__alert dash__alert--info"
          to="/admin/reservas?status=pending"
        >
          <i class="fa-solid fa-calendar-check"></i>
          <span>
            <strong>{{ stats.pendingBookings }}</strong>
            {{ stats.pendingBookings === 1 ? 'reserva pendiente' : 'reservas pendientes' }}
            por confirmar
          </span>
          <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

      <div class="dash__cards">
        <RouterLink
          v-for="card in cards"
          :key="card.label"
          class="dash__card"
          :class="{ 'dash__card--alert': card.alert }"
          :to="card.to"
        >
          <i class="dash__card-icon" :class="card.icon"></i>
          <span class="dash__card-value">{{ card.value }}</span>
          <span class="dash__card-label">{{ card.label }}</span>
          <span class="dash__card-sub">{{ card.sub }}</span>
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.dash {
  &__state {
    @include flex(column, center, center, 0.6rem);
    padding: 3.5rem 1rem;
    color: $ink-muted;
    font-size: $text-sm;

    i {
      font-size: 1.5rem;
    }

    &--error {
      color: $danger;
    }
  }

  &__alerts {
    @include flex(column, stretch, flex-start, 0.6rem);
    margin-bottom: 1.4rem;
  }

  &__alert {
    @include flex(row, center, flex-start, 0.8rem);
    background: $warning-bg;
    border: 1px solid rgba($warning, 0.45);
    border-radius: $radius-sm;
    padding: 0.8rem 1rem;
    font-size: $text-sm;
    color: $ink;
    @include transition(transform);

    > i:first-child {
      color: darken($warning, 18);
    }

    > i:last-child {
      margin-left: auto;
      color: $ink-muted;
      font-size: 0.8rem;
    }

    &:hover {
      transform: translateX(3px);
    }

    &--info {
      background: $info-bg;
      border-color: rgba($info, 0.45);

      > i:first-child {
        color: darken($info, 14);
      }
    }
  }

  &__cards {
    @include flex-cards(240px, 0.9rem);
  }

  &__card {
    @include card;
    @include flex(column, flex-start, flex-start, 0.15rem);
    padding: 1.2rem 1.3rem;
    @include transition(box-shadow);

    &:hover {
      box-shadow: $shadow-md;
    }

    &--alert {
      border-color: rgba($warning, 0.6);
      background: rgba($warning, 0.05);
    }

    &-icon {
      color: $accent;
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
    }

    &-value {
      font-family: $font-display;
      font-size: $display-sm;
      font-weight: 600;
      line-height: 1;
      font-variant-numeric: tabular-nums;
    }

    &-label {
      font-weight: 600;
      font-size: $text-sm;
      margin-top: 0.3rem;
    }

    &-sub {
      font-size: $text-xs;
      color: $ink-muted;
    }
  }
}
</style>
