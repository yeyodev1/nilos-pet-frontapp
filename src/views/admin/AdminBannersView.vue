<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import { adminService } from '@/services/admin.service'
import { useToastStore } from '@/stores/toast'
import type { ApiError, Banner } from '@/types'

const toast = useToastStore()
const items = ref<Banner[]>([])
const loading = ref(true)
const error = ref('')
const saving = ref(false)
const file = ref<File | null>(null)
const title = ref('')
const link = ref('')

// Vercel corta las subidas de más de ~4 MB antes de llegar al backend.
const MAX_BYTES = 4 * 1024 * 1024

async function load() {
  loading.value = true
  try {
    items.value = await adminService.listBanners()
  } catch (e) {
    error.value = (e as ApiError).message
  } finally {
    loading.value = false
  }
}

onMounted(load)

function pick(event: Event) {
  const picked = (event.target as HTMLInputElement).files?.[0] || null
  if (picked && picked.size > MAX_BYTES) {
    toast.error('El archivo pesa más de 4 MB. Redúcelo y vuelve a intentar.')
    file.value = null
    return
  }
  file.value = picked
}

async function create() {
  if (!file.value) return
  saving.value = true
  try {
    await adminService.createBanner({ file: file.value, title: title.value, link: link.value })
    toast.success('Banner publicado en el inicio')
    file.value = null
    title.value = ''
    link.value = ''
    await load()
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    saving.value = false
  }
}

async function remove(banner: Banner) {
  try {
    await adminService.deleteBanner(banner._id)
    toast.success('Banner eliminado')
    await load()
  } catch (e) {
    toast.error((e as ApiError).message)
  }
}
</script>

<template>
  <div class="banners">
    <AdminPageHead
      title="Banners"
      subtitle="Publicidad, promociones y descuentos que rotan arriba del inicio. JPG, PNG, GIF o TIFF de hasta 4 MB; ideal 1600 × 500 px."
    />

    <form class="banners__form" @submit.prevent="create">
      <div>
        <label for="bn-file">Imagen</label>
        <input
          id="bn-file"
          :key="items.length"
          type="file"
          accept="image/*,.tif,.tiff"
          required
          @change="pick"
        />
      </div>
      <div>
        <label for="bn-title">Descripción (texto alternativo)</label>
        <input id="bn-title" v-model="title" type="text" placeholder="Ej.: 20% en spa canino" />
      </div>
      <div>
        <label for="bn-link">Enlace al hacer clic (opcional)</label>
        <input id="bn-link" v-model="link" type="text" placeholder="/servicios" />
      </div>
      <button class="btn btn--primary" type="submit" :disabled="!file || saving">
        <i :class="saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-cloud-arrow-up'"></i>
        Publicar
      </button>
    </form>

    <AdminTable
      :loading="loading"
      :error="error"
      :count="items.length"
      empty-text="No hay banners publicados."
      empty-icon="fa-solid fa-rectangle-ad"
    >
      <article v-for="banner in items" :key="banner._id" class="atable__row">
        <div class="atable__main">
          <img class="banners__thumb" :src="banner.image.url" :alt="banner.title" />
          <span class="atable__title">{{ banner.title || 'Sin descripción' }}</span>
          <span v-if="banner.link" class="atable__meta">{{ banner.link }}</span>
        </div>
        <div class="atable__cell">
          <button
            class="atable__action atable__action--danger"
            type="button"
            aria-label="Eliminar banner"
            @click="remove(banner)"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </article>
    </AdminTable>
  </div>
</template>

<style scoped lang="scss">
.banners {
  &__form {
    @include card;
    @include flex-cards(220px, 1rem);
    align-items: flex-end;
    padding: 1.2rem;
    margin-bottom: $space-md;

    button {
      flex: 0 0 auto;
    }
  }

  &__thumb {
    width: 100%;
    max-width: 320px;
    border-radius: $radius-sm;
    margin-bottom: 0.4rem;
  }
}
</style>
