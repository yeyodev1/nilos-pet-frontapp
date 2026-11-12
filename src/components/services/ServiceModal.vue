<script setup lang="ts">
// Ventana flotante de un servicio (o de varios exámenes): sucursal primero y
// después el botón que corresponda — reservar, pagar o WhatsApp.
import { computed } from 'vue'
import type { Product } from '@/types'
import { useBodyScroll } from '@/composables/useBodyScroll'
import ServiceBooking from '@/components/catalog/ServiceBooking.vue'

const props = defineProps<{ products: Product[]; title: string }>()
const emit = defineEmits<{ close: [] }>()

useBodyScroll(computed(() => props.products.length > 0))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="products.length" class="smodal" @click.self="emit('close')">
        <div class="smodal__box" role="dialog" aria-modal="true" :aria-label="title">
          <header class="smodal__head">
            <h3 class="smodal__title">{{ title }}</h3>
            <button class="smodal__close" aria-label="Cerrar" @click="emit('close')">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </header>
          <!-- :key: cada servicio abre un formulario limpio. -->
          <ServiceBooking
            :key="products.map((p) => p._id).join()"
            class="smodal__body"
            :products="products"
            @done="emit('close')"
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.smodal {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: $overlay;
  backdrop-filter: blur(3px);
  @include flex(row, flex-end, center);

  @include from('md') {
    align-items: center;
    padding: 1.5rem;
  }

  &__box {
    @include card;
    width: 100%;
    max-width: 620px;
    max-height: 92dvh;
    overflow-y: auto;
    border-radius: $radius-md $radius-md 0 0;
    box-shadow: $shadow-lg;

    @include from('md') {
      border-radius: $radius-md;
    }
  }

  &__head {
    @include flex(row, center, space-between, 1rem);
    position: sticky;
    top: 0;
    z-index: 1;
    background: $surface;
    padding: 1.1rem 1.4rem;
    border-bottom: 1px solid $line;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__close {
    width: 2.2rem;
    height: 2.2rem;
    color: $ink-muted;
    @include focus-ring;
  }

  &__body {
    padding: 1.3rem 1.4rem 1.6rem;
  }
}
</style>
