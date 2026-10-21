<script setup lang="ts">
// BaseModal está pensado para confirmaciones (caja angosta, texto centrado);
// los formularios del admin necesitan ancho, cabecera y submit con loading.
import { toRef } from 'vue'
import { useBodyScroll } from '@/composables/useBodyScroll'

const props = defineProps<{
  open: boolean
  title: string
  saving?: boolean
  submitLabel?: string
  /** Solo lectura: sin submit, botón único de cerrar (detalle de orden). */
  readonly?: boolean
  wide?: boolean
}>()

const emit = defineEmits<{ close: []; submit: [] }>()

useBodyScroll(toRef(props, 'open'))
</script>

<template>
  <Teleport to="body">
    <Transition name="fmodal">
      <div v-if="open" class="fmodal" @click.self="emit('close')">
        <form
          class="fmodal__box"
          :class="{ 'fmodal__box--wide': wide }"
          role="dialog"
          aria-modal="true"
          :aria-label="title"
          @submit.prevent="emit('submit')"
        >
          <header class="fmodal__head">
            <h3 class="fmodal__title">{{ title }}</h3>
            <button type="button" class="fmodal__close" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>

          <div class="fmodal__body">
            <slot />
          </div>

          <footer class="fmodal__foot">
            <button type="button" class="btn btn--ghost" @click="emit('close')">
              {{ readonly ? 'Cerrar' : 'Cancelar' }}
            </button>
            <button v-if="!readonly" type="submit" class="btn btn--primary" :disabled="saving">
              <i v-if="saving" class="fa-solid fa-spinner fa-spin"></i>
              {{ submitLabel || 'Guardar' }}
            </button>
          </footer>
        </form>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.fmodal {
  position: fixed;
  inset: 0;
  background: $overlay;
  backdrop-filter: blur(3px);
  @include flex(row, flex-end, center);
  z-index: 200;

  @include from('md') {
    align-items: center;
    padding: 1.5rem;
  }

  &__box {
    @include card;
    @include flex(column, stretch, flex-start);
    width: 100%;
    max-width: 560px;
    max-height: 92dvh;
    border-radius: $radius-md $radius-md 0 0;
    box-shadow: $shadow-lg;

    @include from('md') {
      border-radius: $radius-md;
      max-height: 86dvh;
    }

    &--wide {
      max-width: 720px;
    }
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    padding: 1.1rem 1.4rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__close {
    @include flex(row, center, center);
    width: 2.2rem;
    height: 2.2rem;
    border-radius: $radius-sm;
    color: $ink-muted;
    @include transition(color);
    @include focus-ring;

    &:hover {
      color: $ink;
    }
  }

  &__body {
    padding: 1.2rem 1.4rem;
    overflow-y: auto;
    flex: 1;
  }

  &__foot {
    @include flex(row, center, flex-end, 0.6rem);
    flex-wrap: wrap;
    padding: 1rem 1.4rem;
    border-top: 1px solid $line;
    background: rgba($sand, 0.4);
  }
}

.fmodal-enter-active,
.fmodal-leave-active {
  transition: opacity 0.25s ease;

  .fmodal__box {
    transition: transform 0.3s $ease;
  }
}

.fmodal-enter-from,
.fmodal-leave-to {
  opacity: 0;

  .fmodal__box {
    transform: translateY(18px);
  }
}
</style>
