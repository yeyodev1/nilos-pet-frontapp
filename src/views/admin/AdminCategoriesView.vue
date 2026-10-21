<script setup lang="ts">
import { reactive } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminFormModal from '@/components/admin/AdminFormModal.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { adminService, type CategoryInput } from '@/services/admin.service'
import type { Category } from '@/types'

const crud = useAdminCrud<Category, CategoryInput>(
  {
    list: () => adminService.listCategories(),
    create: (input) => adminService.createCategory(input),
    update: (id, input) => adminService.updateCategory(id, input),
    remove: (id) => adminService.deleteCategory(id),
  },
  {
    created: 'Categoría creada',
    updated: 'Categoría guardada',
    deleted: 'Categoría eliminada',
  },
)

const form = reactive({ name: '', order: 0 })

function startCreate() {
  form.name = ''
  form.order = crud.items.value.length + 1
  crud.openCreate()
}

function startEdit(category: Category) {
  form.name = category.name
  form.order = category.order
  crud.openEdit(category)
}

function submit() {
  if (!form.name.trim()) return
  crud.save({ name: form.name.trim(), order: Number(form.order) || 0 })
}
</script>

<template>
  <div class="categories">
    <AdminPageHead
      title="Categorías"
      subtitle="Ordenan la tienda: el número define en qué posición aparecen."
    >
      <button class="btn btn--primary" type="button" @click="startCreate">
        <i class="fa-solid fa-plus"></i>
        Nueva categoría
      </button>
    </AdminPageHead>

    <AdminTable
      :loading="crud.loading.value"
      :error="crud.error.value"
      :count="crud.items.value.length"
      empty-text="Todavía no hay categorías. Crea la primera."
      empty-icon="fa-solid fa-tags"
    >
      <article v-for="category in crud.items.value" :key="category._id" class="atable__row">
        <div class="atable__main categories__name">
          <span class="categories__order">{{ category.order }}</span>
          <span class="atable__title">{{ category.name }}</span>
        </div>
        <div class="atable__cell">
          <button
            class="atable__action"
            type="button"
            aria-label="Editar"
            @click="startEdit(category)"
          >
            <i class="fa-solid fa-pen"></i>
          </button>
          <button
            class="atable__action atable__action--danger"
            type="button"
            aria-label="Eliminar"
            @click="crud.askDelete(category)"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </article>
    </AdminTable>

    <AdminFormModal
      :open="crud.modalOpen.value"
      :title="crud.editing.value ? 'Editar categoría' : 'Nueva categoría'"
      :saving="crud.saving.value"
      @close="crud.closeModal"
      @submit="submit"
    >
      <div class="categories__form">
        <div>
          <label for="cat-name">Nombre</label>
          <input id="cat-name" v-model="form.name" type="text" required />
        </div>
        <div>
          <label for="cat-order">Orden</label>
          <input id="cat-order" v-model.number="form.order" type="number" min="0" />
        </div>
      </div>
    </AdminFormModal>

    <BaseModal
      :open="crud.pendingDelete.value !== null"
      title="¿Eliminar categoría?"
      :message="`Los productos de «${crud.pendingDelete.value?.name}» quedarán sin categoría.`"
      confirm-label="Sí, eliminar"
      danger
      @confirm="crud.confirmDelete"
      @cancel="crud.cancelDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.categories {
  &__name {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__order {
    @include flex(row, center, center);
    flex: none;
    width: 2rem;
    height: 2rem;
    border-radius: $radius-sm;
    background: $sand;
    color: $ink-soft;
    font-size: $text-xs;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('sm') {
      flex-direction: row;

      > :first-child {
        flex: 2;
      }

      > :last-child {
        flex: 1;
      }
    }
  }
}
</style>
