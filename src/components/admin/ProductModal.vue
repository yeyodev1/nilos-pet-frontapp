<script setup lang="ts">
import { ref, toRef } from 'vue'
import AdminFormModal from './AdminFormModal.vue'
import { useAdminProductForm } from '@/composables/useAdminProductForm'
import type { Category, Product } from '@/types'

const props = defineProps<{
  open: boolean
  product: Product | null
  categories: Category[]
}>()

const emit = defineEmits<{ close: []; saved: [] }>()

const {
  form,
  isEdit,
  images,
  saving,
  uploading,
  pendingFile,
  previewUrl,
  save,
  pickFile,
  uploadImage,
  removeImage,
} = useAdminProductForm(toRef(props, 'open'), toRef(props, 'product'), () => emit('saved'))

async function onSubmit() {
  if (await save()) emit('close')
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  pickFile(input.files?.[0] || null)
  input.value = ''
}

// Borrar una imagen pide un segundo clic sobre el mismo botón: confirmación
// destructiva sin apilar otro modal encima del formulario.
const armedImage = ref('')

function onRemoveImage(publicId: string) {
  if (armedImage.value === publicId) {
    armedImage.value = ''
    removeImage(publicId)
  } else {
    armedImage.value = publicId
  }
}
</script>

<template>
  <AdminFormModal
    :open="open"
    :title="isEdit ? 'Editar producto' : 'Nuevo producto'"
    :saving="saving"
    :submit-label="isEdit ? 'Guardar cambios' : 'Crear producto'"
    wide
    @close="emit('close')"
    @submit="onSubmit"
  >
    <div class="pform">
      <div class="pform__field">
        <label for="pform-name">Nombre</label>
        <input id="pform-name" v-model="form.name" type="text" required />
      </div>

      <div class="pform__pair">
        <div class="pform__field">
          <label for="pform-type">Tipo</label>
          <select id="pform-type" v-model="form.type">
            <option value="physical">Producto físico</option>
            <option value="service">Servicio</option>
          </select>
        </div>
        <div class="pform__field">
          <label for="pform-category">Categoría</label>
          <select id="pform-category" v-model="form.category">
            <option value="">Sin categoría</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="pform__pair">
        <div class="pform__field">
          <label for="pform-price">Precio (dólares)</label>
          <input
            id="pform-price"
            v-model="form.price"
            type="text"
            inputmode="decimal"
            placeholder="0.00"
          />
        </div>
        <label v-if="form.type === 'service'" class="pform__check">
          <input v-model="form.bookable" type="checkbox" />
          <span>Se reserva en sucursal</span>
        </label>
      </div>

      <div class="pform__field">
        <label for="pform-description">Descripción</label>
        <textarea id="pform-description" v-model="form.description" rows="3"></textarea>
      </div>

      <div v-if="isEdit" class="pform__flags">
        <label class="pform__check">
          <input v-model="form.isPublished" type="checkbox" />
          <span>Publicado en la tienda</span>
        </label>
        <label class="pform__check">
          <input v-model="form.isFeatured" type="checkbox" />
          <span>Destacado</span>
        </label>
      </div>

      <section class="pform__images">
        <h4 class="pform__images-title">Imágenes</h4>
        <p v-if="!isEdit" class="pform__hint">
          Primero crea el producto; el modal quedará abierto para subir sus imágenes.
        </p>
        <template v-else>
          <div v-if="images.length" class="pform__gallery">
            <figure v-for="image in images" :key="image.publicId" class="pform__shot">
              <img :src="image.url" alt="" loading="lazy" />
              <button
                type="button"
                class="pform__shot-remove"
                :class="{ 'pform__shot-remove--armed': armedImage === image.publicId }"
                :aria-label="
                  armedImage === image.publicId ? 'Confirmar borrado' : 'Eliminar imagen'
                "
                :title="armedImage === image.publicId ? 'Clic de nuevo para confirmar' : 'Eliminar'"
                @click="onRemoveImage(image.publicId)"
              >
                <i
                  :class="armedImage === image.publicId ? 'fa-solid fa-check' : 'fa-solid fa-xmark'"
                ></i>
              </button>
            </figure>
          </div>

          <div class="pform__upload">
            <label class="pform__file btn btn--ghost">
              <i class="fa-solid fa-image"></i>
              {{ pendingFile ? 'Cambiar imagen' : 'Elegir imagen' }}
              <input type="file" accept="image/*" class="visually-hidden" @change="onFileChange" />
            </label>
            <template v-if="previewUrl">
              <img class="pform__preview" :src="previewUrl" alt="Vista previa" />
              <button
                type="button"
                class="btn btn--primary pform__upload-btn"
                :disabled="uploading"
                @click="uploadImage"
              >
                <i v-if="uploading" class="fa-solid fa-spinner fa-spin"></i>
                <i v-else class="fa-solid fa-cloud-arrow-up"></i>
                Subir
              </button>
            </template>
          </div>
        </template>
      </section>
    </div>
  </AdminFormModal>
</template>

<style scoped lang="scss">
.pform {
  @include flex(column, stretch, flex-start, 1rem);

  &__pair {
    @include flex(column, stretch, flex-start, 1rem);

    @include from('sm') {
      flex-direction: row;
      align-items: flex-end;

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
    padding-block: 0.55rem;

    input {
      width: auto;
      accent-color: $accent;
    }
  }

  &__flags {
    @include flex(row, center, flex-start, 1.4rem);
    flex-wrap: wrap;
  }

  &__images {
    border-top: 1px solid $line;
    padding-top: 1rem;

    &-title {
      font-family: $font-principal;
      font-size: $text-sm;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }
  }

  &__hint {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__gallery {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-bottom: 0.9rem;
  }

  &__shot {
    position: relative;

    img {
      width: 74px;
      height: 74px;
      object-fit: cover;
      border-radius: $radius-sm;
      border: 1px solid $line;
    }

    &-remove {
      position: absolute;
      top: -0.45rem;
      right: -0.45rem;
      @include flex(row, center, center);
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      background: $ink;
      color: $surface;
      font-size: 0.7rem;
      @include transition(background);

      &--armed {
        background: $danger;
      }
    }
  }

  &__upload {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
  }

  &__file {
    cursor: pointer;
    margin-bottom: 0;
  }

  &__preview {
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: $radius-sm;
    border: 1px dashed $accent;
  }

  &__upload-btn {
    padding-block: 0.65rem;
  }
}
</style>
