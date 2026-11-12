<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import { formatDate } from '@/utils/format'
import type { ApiError, Review } from '@/types'

const toast = useToastStore()
const items = ref<Review[]>([])
const loading = ref(true)
const error = ref('')

async function load() {
  loading.value = true
  try {
    items.value = await adminService.listReviews()
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function remove(review: Review) {
  try {
    await adminService.deleteReview(review._id)
    toast.success('Reseña eliminada')
    await load()
  } catch (e) {
    toast.error((e as ApiError).message)
  }
}
</script>

<template>
  <div>
    <AdminPageHead
      title="Reseñas"
      subtitle="Los clientes con cuenta las publican desde el inicio y salen al instante. Elimina aquí las que no correspondan."
    />

    <AdminTable
      :loading="loading"
      :error="error"
      :count="items.length"
      empty-text="Todavía no hay reseñas."
      empty-icon="fa-solid fa-star"
    >
      <article v-for="review in items" :key="review._id" class="atable__row">
        <div class="atable__main">
          <span class="atable__title">{{ review.name }} · {{ review.rating }}/5</span>
          <span class="atable__meta">{{ formatDate(review.updatedAt) }}</span>
          <span>{{ review.text }}</span>
        </div>
        <div class="atable__cell">
          <button
            class="atable__action atable__action--danger"
            type="button"
            aria-label="Eliminar reseña"
            @click="remove(review)"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </article>
    </AdminTable>
  </div>
</template>
