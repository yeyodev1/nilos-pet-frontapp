<script setup lang="ts">
import { reactive, ref } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminPaginator from '@/components/admin/AdminPaginator.vue'
import AdminFormModal from '@/components/admin/AdminFormModal.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { adminService } from '@/services/admin.service'
import { useAdminList } from '@/composables/useAdminList'
import { useToastStore } from '@/stores/toast'
import { formatDate } from '@/utils/format'
import type { ApiError, ExamResult } from '@/types'

const toastStore = useToastStore()

const search = ref('')

const { items, loading, error, page, pages, total, refetchFromStart } = useAdminList<ExamResult>(
  (pageNumber) =>
    adminService.listExamResults({
      documentId: search.value.trim() || undefined,
      page: pageNumber,
    }),
  { debounced: [search] },
)

// ─── Subida: el dueño carga el PDF y el cliente lo consulta con su cédula ──

const formOpen = ref(false)
const saving = ref(false)
const file = ref<File | null>(null)

const form = reactive({
  documentId: '',
  petName: '',
  title: '',
  date: new Date().toISOString().slice(0, 10),
  notes: '',
})

function openForm() {
  form.documentId = ''
  form.petName = ''
  form.title = ''
  form.date = new Date().toISOString().slice(0, 10)
  form.notes = ''
  file.value = null
  formOpen.value = true
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  file.value = input.files?.[0] || null
}

async function submit() {
  if (!form.documentId.trim() || !form.title.trim()) {
    toastStore.error('La cédula y el título son obligatorios')
    return
  }
  if (!file.value) {
    toastStore.error('Adjunta el PDF o la imagen del resultado')
    return
  }
  saving.value = true
  try {
    await adminService.createExamResult({
      file: file.value,
      documentId: form.documentId.trim(),
      title: form.title.trim(),
      date: form.date,
      petName: form.petName.trim(),
      notes: form.notes.trim(),
    })
    toastStore.success('Resultado subido: el cliente ya puede consultarlo con su cédula')
    formOpen.value = false
    refetchFromStart()
  } catch (e) {
    toastStore.error((e as ApiError).message)
  } finally {
    saving.value = false
  }
}

// ─── Borrado con confirmación ──────────────────────────────────────────────

const pendingDelete = ref<ExamResult | null>(null)

async function confirmDelete() {
  if (!pendingDelete.value) return
  try {
    await adminService.deleteExamResult(pendingDelete.value._id)
    toastStore.success('Resultado eliminado')
    pendingDelete.value = null
    refetchFromStart()
  } catch (e) {
    toastStore.error((e as ApiError).message)
  }
}
</script>

<template>
  <div class="exams">
    <AdminPageHead
      title="Resultados de exámenes"
      subtitle="Sube el archivo y el cliente lo consulta en el sitio con su cédula."
    >
      <button class="btn btn--primary" type="button" @click="openForm">
        <i class="fa-solid fa-file-arrow-up"></i>
        Subir resultado
      </button>
    </AdminPageHead>

    <div class="exams__search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input
        v-model="search"
        type="search"
        inputmode="numeric"
        placeholder="Buscar por cédula…"
        aria-label="Buscar resultados por cédula"
      />
    </div>

    <AdminTable
      :loading="loading"
      :error="error"
      :count="items.length"
      :empty-text="
        search ? 'No hay resultados para esa cédula.' : 'Todavía no has subido resultados.'
      "
      empty-icon="fa-solid fa-file-waveform"
    >
      <article v-for="result in items" :key="result._id" class="atable__row">
        <div class="atable__main">
          <span class="atable__title">{{ result.title }}</span>
          <span class="atable__meta">
            <template v-if="result.petName">{{ result.petName }} · </template>
            Cédula {{ result.documentId }} · {{ formatDate(result.date) }}
          </span>
          <span v-if="result.notes" class="exams__notes">{{ result.notes }}</span>
        </div>
        <div class="atable__cell">
          <a
            class="atable__action"
            :href="result.fileUrl"
            target="_blank"
            rel="noopener"
            aria-label="Abrir archivo"
          >
            <i class="fa-solid fa-file-arrow-down"></i>
          </a>
          <button
            class="atable__action atable__action--danger"
            type="button"
            aria-label="Eliminar"
            @click="pendingDelete = result"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </article>
    </AdminTable>

    <AdminPaginator v-model:page="page" :pages="pages" :total="total" />

    <AdminFormModal
      :open="formOpen"
      title="Subir resultado"
      :saving="saving"
      submit-label="Subir"
      @close="formOpen = false"
      @submit="submit"
    >
      <div class="exams__form">
        <div class="exams__pair">
          <div>
            <label for="ex-doc">Cédula del cliente</label>
            <input id="ex-doc" v-model="form.documentId" type="text" inputmode="numeric" required />
          </div>
          <div>
            <label for="ex-pet">Mascota</label>
            <input id="ex-pet" v-model="form.petName" type="text" placeholder="Ej.: Lily" />
          </div>
        </div>
        <div>
          <label for="ex-title">Título del examen</label>
          <input
            id="ex-title"
            v-model="form.title"
            type="text"
            required
            placeholder="Ej.: Hemograma completo"
          />
        </div>
        <div class="exams__pair">
          <div>
            <label for="ex-date">Fecha</label>
            <input id="ex-date" v-model="form.date" type="date" required />
          </div>
          <div>
            <label for="ex-file">Archivo (PDF o imagen)</label>
            <input
              id="ex-file"
              type="file"
              accept="application/pdf,image/*"
              @change="onFileChange"
            />
          </div>
        </div>
        <div>
          <label for="ex-notes">Notas para el cliente</label>
          <textarea id="ex-notes" v-model="form.notes" rows="2"></textarea>
        </div>
      </div>
    </AdminFormModal>

    <BaseModal
      :open="pendingDelete !== null"
      title="¿Eliminar resultado?"
      :message="`«${pendingDelete?.title}» dejará de estar disponible para la cédula ${pendingDelete?.documentId}.`"
      confirm-label="Sí, eliminar"
      danger
      @confirm="confirmDelete"
      @cancel="pendingDelete = null"
    />
  </div>
</template>

<style scoped lang="scss">
.exams {
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

  &__notes {
    display: block;
    font-size: $text-xs;
    color: $ink-soft;
    margin-top: 0.15rem;
  }

  &__form {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__pair {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('sm') {
      flex-direction: row;

      > * {
        flex: 1;
        min-width: 0;
      }
    }
  }
}
</style>
