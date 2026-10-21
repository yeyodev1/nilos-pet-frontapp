<script setup lang="ts">
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminPaginator from '@/components/admin/AdminPaginator.vue'
import ProductRow from '@/components/admin/ProductRow.vue'
import ProductModal from '@/components/admin/ProductModal.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useAdminProducts } from '@/composables/useAdminProducts'

const {
  items,
  loading,
  error,
  page,
  pages,
  total,
  reload,
  categories,
  search,
  category,
  type,
  published,
  unpriced,
  savePrice,
  toggleField,
  pendingDelete,
  confirmDelete,
  modalOpen,
  editing,
  openCreate,
  openEdit,
  closeModal,
} = useAdminProducts()
</script>

<template>
  <div class="products">
    <AdminPageHead
      title="Productos"
      subtitle="Edita el precio directo en la lista y publica con un clic."
    >
      <button class="btn btn--primary" type="button" @click="openCreate">
        <i class="fa-solid fa-plus"></i>
        Nuevo producto
      </button>
    </AdminPageHead>

    <div class="products__filters">
      <div class="products__search">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input
          v-model="search"
          type="search"
          placeholder="Buscar por nombre o código…"
          aria-label="Buscar productos"
        />
      </div>

      <button
        class="products__chip"
        :class="{ 'products__chip--on': unpriced }"
        type="button"
        :aria-pressed="unpriced"
        @click="unpriced = !unpriced"
      >
        <i class="fa-solid fa-tag"></i>
        Sin precio
      </button>

      <select v-model="category" class="products__select" aria-label="Filtrar por categoría">
        <option value="">Todas las categorías</option>
        <option v-for="cat in categories" :key="cat._id" :value="cat._id">{{ cat.name }}</option>
      </select>

      <select v-model="type" class="products__select" aria-label="Filtrar por tipo">
        <option value="">Físicos y servicios</option>
        <option value="physical">Solo físicos</option>
        <option value="service">Solo servicios</option>
      </select>

      <select v-model="published" class="products__select" aria-label="Filtrar por publicación">
        <option value="">Publicados y ocultos</option>
        <option value="1">Solo publicados</option>
        <option value="0">Solo ocultos</option>
      </select>
    </div>

    <AdminTable
      :loading="loading"
      :error="error"
      :count="items.length"
      :empty-text="
        unpriced
          ? 'No queda ningún producto sin precio. ¡Buen trabajo!'
          : 'No hay productos con esos filtros.'
      "
      empty-icon="fa-solid fa-box-open"
    >
      <ProductRow
        v-for="product in items"
        :key="product._id"
        :product="product"
        @save-price="(cents) => savePrice(product, cents)"
        @toggle="(field) => toggleField(product, field)"
        @edit="openEdit(product)"
        @remove="pendingDelete = product"
      />
    </AdminTable>

    <AdminPaginator v-model:page="page" :pages="pages" :total="total" />

    <ProductModal
      :open="modalOpen"
      :product="editing"
      :categories="categories"
      @close="closeModal"
      @saved="reload"
    />

    <BaseModal
      :open="pendingDelete !== null"
      title="¿Eliminar producto?"
      :message="`«${pendingDelete?.name}» desaparecerá de la tienda. Esta acción no se puede deshacer.`"
      confirm-label="Sí, eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>

<style scoped lang="scss">
.products {
  &__filters {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }

  &__search {
    @include flex(row, center, flex-start, 0.5rem);
    flex: 1 1 100%;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    padding-left: 0.8rem;
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

    @include from('md') {
      flex: 1 1 260px;
    }
  }

  &__chip {
    @include flex(row, center, center, 0.45rem);
    font-size: $text-sm;
    font-weight: 600;
    padding: 0.55rem 1rem;
    border-radius: $radius-pill;
    border: 1px solid rgba($warning, 0.65);
    background: $warning-bg;
    color: darken($warning, 24);
    @include transition;
    @include focus-ring($warning);

    &--on {
      background: darken($warning, 8);
      border-color: darken($warning, 8);
      color: $surface;
    }
  }

  &__select {
    flex: 1 1 10rem;
    width: auto;
    padding-block: 0.55rem;

    @include from('md') {
      flex: 0 1 auto;
    }
  }
}
</style>
