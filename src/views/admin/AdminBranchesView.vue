<script setup lang="ts">
import { reactive } from 'vue'
import AdminPageHead from '@/components/admin/AdminPageHead.vue'
import AdminTable from '@/components/admin/AdminTable.vue'
import AdminFormModal from '@/components/admin/AdminFormModal.vue'
import StatusPill from '@/components/admin/StatusPill.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { useAdminCrud } from '@/composables/useAdminCrud'
import { adminService, type BranchInput } from '@/services/admin.service'
import type { Branch } from '@/types'

const crud = useAdminCrud<Branch, BranchInput>(
  {
    list: () => adminService.listBranches(),
    create: (input) => adminService.createBranch(input),
    update: (id, input) => adminService.updateBranch(id, input),
    remove: (id) => adminService.deleteBranch(id),
  },
  {
    created: 'Sucursal creada',
    updated: 'Sucursal guardada',
    deleted: 'Sucursal desactivada',
  },
)

const form = reactive<BranchInput>({
  name: '',
  address: '',
  city: '',
  phone: '',
  mapsUrl: '',
  isActive: true,
})

function fillForm(branch?: Branch) {
  form.name = branch?.name || ''
  form.address = branch?.address || ''
  form.city = branch?.city || ''
  form.phone = branch?.phone || ''
  form.mapsUrl = branch?.mapsUrl || ''
  form.isActive = branch ? branch.isActive : true
}

function startCreate() {
  fillForm()
  crud.openCreate()
}

function startEdit(branch: Branch) {
  fillForm(branch)
  crud.openEdit(branch)
}

function submit() {
  if (!form.name.trim()) return
  crud.save({ ...form, name: form.name.trim() })
}
</script>

<template>
  <div class="branches">
    <AdminPageHead
      title="Sucursales"
      subtitle="Dónde se retiran los pedidos y se atienden las reservas."
    >
      <button class="btn btn--primary" type="button" @click="startCreate">
        <i class="fa-solid fa-plus"></i>
        Nueva sucursal
      </button>
    </AdminPageHead>

    <AdminTable
      :loading="crud.loading.value"
      :error="crud.error.value"
      :count="crud.items.value.length"
      empty-text="Todavía no hay sucursales registradas."
      empty-icon="fa-solid fa-location-dot"
    >
      <article v-for="branch in crud.items.value" :key="branch._id" class="atable__row">
        <div class="atable__main">
          <span class="atable__title">{{ branch.name }}</span>
          <span class="atable__meta">
            <template v-if="branch.address">{{ branch.address }}</template>
            <template v-if="branch.city"> · {{ branch.city }}</template>
            <template v-if="branch.phone"> · {{ branch.phone }}</template>
          </span>
        </div>
        <div class="atable__cell">
          <StatusPill
            :label="branch.isActive ? 'Activa' : 'Inactiva'"
            :tone="branch.isActive ? 'success' : 'muted'"
          />
          <a
            v-if="branch.mapsUrl"
            class="atable__action"
            :href="branch.mapsUrl"
            target="_blank"
            rel="noopener"
            aria-label="Ver en el mapa"
          >
            <i class="fa-solid fa-map-location-dot"></i>
          </a>
          <button
            class="atable__action"
            type="button"
            aria-label="Editar"
            @click="startEdit(branch)"
          >
            <i class="fa-solid fa-pen"></i>
          </button>
          <button
            v-if="branch.isActive"
            class="atable__action atable__action--danger"
            type="button"
            aria-label="Desactivar"
            @click="crud.askDelete(branch)"
          >
            <i class="fa-solid fa-ban"></i>
          </button>
        </div>
      </article>
    </AdminTable>

    <AdminFormModal
      :open="crud.modalOpen.value"
      :title="crud.editing.value ? 'Editar sucursal' : 'Nueva sucursal'"
      :saving="crud.saving.value"
      @close="crud.closeModal"
      @submit="submit"
    >
      <div class="branches__form">
        <div>
          <label for="br-name">Nombre</label>
          <input id="br-name" v-model="form.name" type="text" required placeholder="Ej.: Matriz" />
        </div>
        <div>
          <label for="br-address">Dirección</label>
          <input
            id="br-address"
            v-model="form.address"
            type="text"
            placeholder="Calle principal y secundaria"
          />
        </div>
        <div class="branches__pair">
          <div>
            <label for="br-city">Ciudad</label>
            <input id="br-city" v-model="form.city" type="text" placeholder="Ej.: Guayaquil" />
          </div>
          <div>
            <label for="br-phone">Teléfono</label>
            <input id="br-phone" v-model="form.phone" type="tel" placeholder="Ej.: 0999999999" />
          </div>
        </div>
        <div>
          <label for="br-maps">Link de Google Maps</label>
          <input id="br-maps" v-model="form.mapsUrl" type="url" placeholder="https://maps.app…" />
        </div>
        <label class="branches__check">
          <input v-model="form.isActive" type="checkbox" />
          <span>Sucursal activa (visible para los clientes)</span>
        </label>
      </div>
    </AdminFormModal>

    <BaseModal
      :open="crud.pendingDelete.value !== null"
      title="¿Desactivar sucursal?"
      :message="`«${crud.pendingDelete.value?.name}» dejará de mostrarse a los clientes. Puedes reactivarla editándola.`"
      confirm-label="Sí, desactivar"
      danger
      @confirm="crud.confirmDelete"
      @cancel="crud.cancelDelete"
    />
  </div>
</template>

<style scoped lang="scss">
.branches {
  &__form {
    @include flex(column, stretch, flex-start, 1rem);
  }

  &__pair {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('sm') {
      flex-direction: row;

      > * {
        flex: 1;
      }
    }
  }

  &__check {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    color: $ink;
    margin-bottom: 0;
    cursor: pointer;

    input {
      width: auto;
      accent-color: $accent;
    }
  }
}
</style>
