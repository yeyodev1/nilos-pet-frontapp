<script setup lang="ts">
import { ref } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminPaginator from '@/components/admin/AdminPaginator.vue'
import { adminService, type AdminCustomer } from '@/services/admin.service'
import { useAdminList } from '@/composables/useAdminList'
import { formatDate } from '@/utils/format'

const search = ref('')

const { items, loading, error, page, pages, total } = useAdminList<AdminCustomer>(
  (pageNumber) =>
    adminService.listCustomers({ search: search.value.trim() || undefined, page: pageNumber }),
  { debounced: [search] },
)
</script>

<template>
  <div class="customers">
    <AdminPageHead
      title="Clientes"
      subtitle="Las cuentas registradas en la tienda de Nilos Pet."
    />

    <div class="customers__search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input
        v-model="search"
        type="search"
        placeholder="Buscar por nombre, correo o teléfono…"
        aria-label="Buscar clientes"
      />
    </div>

    <AdminTable
      :loading="loading"
      :error="error"
      :count="items.length"
      :empty-text="search ? 'Ningún cliente coincide con la búsqueda.' : 'Todavía no hay clientes registrados.'"
      empty-icon="fa-solid fa-users"
    >
      <article v-for="customer in items" :key="customer.id" class="atable__row">
        <div class="atable__main customers__id">
          <span class="customers__avatar" aria-hidden="true">
            {{ customer.name.trim().charAt(0).toUpperCase() || '?' }}
          </span>
          <div class="customers__text">
            <span class="atable__title">{{ customer.name }}</span>
            <span class="atable__meta">
              {{ customer.email }}
              <template v-if="customer.phone"> · {{ customer.phone }}</template>
            </span>
          </div>
        </div>
        <div class="atable__cell">
          <span v-if="customer.createdAt" class="customers__since">
            Cliente desde {{ formatDate(customer.createdAt) }}
          </span>
        </div>
      </article>
    </AdminTable>

    <AdminPaginator v-model:page="page" :pages="pages" :total="total" />
  </div>
</template>

<style scoped lang="scss">
.customers {
  &__search {
    @include flex(row, center, flex-start, 0.5rem);
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    padding-left: 0.8rem;
    margin-bottom: 1rem;
    max-width: 420px;
    @include transition(border-color);

    &:focus-within {
      border-color: $accent;
      box-shadow: 0 0 0 3px rgba($accent, 0.12);
    }

    i {
      color: $ink-muted;
      font-size: 0.85rem;
    }

    input {
      border: none;
      background: transparent;
      padding-left: 0;

      &:focus {
        box-shadow: none;
      }
    }
  }

  &__id {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__text {
    @include flex(column, stretch, center, 0.1rem);
    min-width: 0;
  }

  &__avatar {
    @include flex(row, center, center);
    flex: none;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: $accent-soft;
    color: $accent-deep;
    font-weight: 700;
    font-size: $text-sm;
  }

  &__since {
    font-size: $text-xs;
    color: $ink-muted;
    white-space: nowrap;
  }
}
</style>
