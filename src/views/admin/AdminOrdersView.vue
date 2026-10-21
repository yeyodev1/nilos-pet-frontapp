<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminPaginator from '@/components/admin/AdminPaginator.vue'
import AdminFormModal from '@/components/admin/AdminFormModal.vue'
import StatusPill from '@/components/admin/StatusPill.vue'
import OrderDetail from '@/components/admin/OrderDetail.vue'
import { formatDateTime, orderStatusMeta } from '@/components/admin/adminFormat'
import { adminService, type AdminOrder } from '@/services/admin.service'
import { useAdminList } from '@/composables/useAdminList'
import { useToastStore } from '@/stores/toast'
import { formatMoney } from '@/utils/format'
import type { ApiError, Order } from '@/types'

const route = useRoute()
const toastStore = useToastStore()

const statusFilters = [
  { value: '', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'paid', label: 'Pagadas' },
  { value: 'canceled', label: 'Canceladas' },
  { value: 'failed', label: 'Fallidas' },
]

const status = ref((route.query.status as string) || '')

const { items, loading, error, page, pages, total } = useAdminList<Order>(
  (pageNumber) => adminService.listOrders({ status: status.value || undefined, page: pageNumber }),
  { filters: [status] },
)

// El detalle se pide aparte: la lista viene sin populate.
const detail = ref<AdminOrder | null>(null)
const detailOpen = ref(false)
const detailLoading = ref(false)

async function openDetail(order: Order) {
  detailOpen.value = true
  detailLoading.value = true
  detail.value = null
  try {
    detail.value = await adminService.getOrder(order._id)
  } catch (e) {
    toastStore.error((e as ApiError).message)
    detailOpen.value = false
  } finally {
    detailLoading.value = false
  }
}
</script>

<template>
  <div class="orders">
    <AdminPageHead title="Órdenes" subtitle="Las compras de la tienda y su estado de pago." />

    <div class="orders__filters" role="group" aria-label="Filtrar por estado">
      <button
        v-for="filter in statusFilters"
        :key="filter.value"
        class="orders__chip"
        :class="{ 'orders__chip--on': status === filter.value }"
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
      empty-text="No hay órdenes con ese estado."
      empty-icon="fa-solid fa-receipt"
    >
      <article v-for="order in items" :key="order._id" class="atable__row">
        <div class="atable__main">
          <span class="atable__title">#{{ order.number }} — {{ order.customer.name }}</span>
          <span class="atable__meta">
            {{ formatDateTime(order.createdAt) }} · {{ order.items.length }}
            {{ order.items.length === 1 ? 'ítem' : 'ítems' }} ·
            {{ order.fulfillment === 'delivery' ? 'Envío' : 'Retiro' }}
          </span>
        </div>
        <div class="atable__cell">
          <span class="orders__total">{{ formatMoney(order.total / 100) }}</span>
          <StatusPill
            :label="orderStatusMeta[order.status]?.label || order.status"
            :tone="orderStatusMeta[order.status]?.tone"
          />
          <button
            class="atable__action"
            type="button"
            aria-label="Ver detalle"
            @click="openDetail(order)"
          >
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </article>
    </AdminTable>

    <AdminPaginator v-model:page="page" :pages="pages" :total="total" />

    <AdminFormModal
      :open="detailOpen"
      :title="detail ? `Orden #${detail.number}` : 'Orden'"
      readonly
      @close="detailOpen = false"
      @submit="detailOpen = false"
    >
      <div v-if="detailLoading" class="orders__detail-state">
        <i class="fa-solid fa-spinner fa-spin"></i>
        <span>Cargando la orden…</span>
      </div>
      <OrderDetail v-else-if="detail" :order="detail" />
    </AdminFormModal>
  </div>
</template>

<style scoped lang="scss">
.orders {
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

  &__total {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }

  &__detail-state {
    @include flex(column, center, center, 0.6rem);
    padding: 2.5rem 1rem;
    color: $ink-muted;
    font-size: $text-sm;
  }
}
</style>
