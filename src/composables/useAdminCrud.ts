import { onMounted, ref, type Ref } from 'vue'
import { useToastStore } from '@/stores/toast'
import type { ApiError } from '@/types'

interface CrudApi<T, I> {
  list: () => Promise<T[]>
  create: (input: I) => Promise<T>
  update: (id: string, input: Partial<I>) => Promise<T>
  remove: (id: string) => Promise<void>
}

interface CrudMessages {
  created: string
  updated: string
  deleted: string
}

/**
 * CRUD de catálogos chicos sin paginación (categorías, sucursales):
 * carga la lista, maneja el modal de crear/editar y la confirmación de borrado.
 * El formulario (sus campos) vive en la vista; acá solo el flujo.
 */
export function useAdminCrud<T extends { _id: string }, I>(
  api: CrudApi<T, I>,
  messages: CrudMessages,
) {
  const toastStore = useToastStore()

  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(true)
  const error = ref('')
  const saving = ref(false)
  const modalOpen = ref(false)
  const editing = ref<T | null>(null) as Ref<T | null>
  const pendingDelete = ref<T | null>(null) as Ref<T | null>

  async function load() {
    loading.value = true
    error.value = ''
    try {
      items.value = await api.list()
    } catch (e) {
      error.value = (e as ApiError).message
      toastStore.error(error.value)
    } finally {
      loading.value = false
    }
  }

  function openCreate() {
    editing.value = null
    modalOpen.value = true
  }

  function openEdit(item: T) {
    editing.value = item
    modalOpen.value = true
  }

  function closeModal() {
    modalOpen.value = false
    editing.value = null
  }

  async function save(input: I) {
    saving.value = true
    try {
      if (editing.value) {
        await api.update(editing.value._id, input)
        toastStore.success(messages.updated)
      } else {
        await api.create(input)
        toastStore.success(messages.created)
      }
      closeModal()
      await load()
    } catch (e) {
      toastStore.error((e as ApiError).message)
    } finally {
      saving.value = false
    }
  }

  function askDelete(item: T) {
    pendingDelete.value = item
  }

  function cancelDelete() {
    pendingDelete.value = null
  }

  async function confirmDelete() {
    if (!pendingDelete.value) return
    try {
      await api.remove(pendingDelete.value._id)
      toastStore.success(messages.deleted)
      pendingDelete.value = null
      await load()
    } catch (e) {
      toastStore.error((e as ApiError).message)
    }
  }

  onMounted(load)

  return {
    items,
    loading,
    error,
    saving,
    modalOpen,
    editing,
    pendingDelete,
    load,
    openCreate,
    openEdit,
    closeModal,
    save,
    askDelete,
    cancelDelete,
    confirmDelete,
  }
}
