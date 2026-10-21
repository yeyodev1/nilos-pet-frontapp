<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product } from '@/types'

const props = defineProps<{ product: Product }>()

const emit = defineEmits<{
  savePrice: [cents: number]
  toggle: [field: 'isPublished' | 'isFeatured']
  edit: []
  remove: []
}>()

// El precio se edita inline: el input vive en dólares y el API habla centavos.
function toDollars(cents: number): string {
  return cents > 0 ? (cents / 100).toFixed(2) : ''
}

const priceText = ref(toDollars(props.product.price))
watch(
  () => props.product.price,
  (cents) => {
    priceText.value = toDollars(cents)
  },
)

const dirty = computed(() => priceText.value.trim() !== toDollars(props.product.price))

/** Guarda al salir del input o con el botón de check. */
function commitPrice() {
  if (!dirty.value) return
  const raw = priceText.value.trim().replace(',', '.')
  const dollars = Number(raw)
  if (raw === '' || !Number.isFinite(dollars) || dollars < 0) {
    // Entrada inválida: se vuelve al valor real sin tocar el API.
    priceText.value = toDollars(props.product.price)
    return
  }
  emit('savePrice', Math.round(dollars * 100))
}

const thumb = computed(() => props.product.images[0]?.url || '')

const categoryName = computed(() => {
  const category = props.product.category
  return category && typeof category === 'object' ? category.name : ''
})
</script>

<template>
  <article class="atable__row prow" :class="{ 'atable__row--alert': product.price === 0 }">
    <div class="atable__main prow__id">
      <img v-if="thumb" class="prow__thumb" :src="thumb" :alt="product.name" loading="lazy" />
      <span v-else class="prow__thumb prow__thumb--empty"><i class="fa-solid fa-paw"></i></span>
      <div class="prow__text">
        <span class="atable__title">{{ product.name }}</span>
        <span class="atable__meta">
          {{ product.code }}
          <template v-if="categoryName"> · {{ categoryName }}</template>
          · {{ product.type === 'service' ? 'Servicio' : 'Físico' }}
        </span>
      </div>
    </div>

    <div class="atable__cell prow__price">
      <span class="atable__label">Precio</span>
      <div class="prow__price-box" :class="{ 'prow__price-box--empty': product.price === 0 }">
        <span class="prow__currency">$</span>
        <input
          v-model="priceText"
          class="prow__price-input"
          type="text"
          inputmode="decimal"
          placeholder="0.00"
          :aria-label="`Precio de ${product.name} en dólares`"
          @blur="commitPrice"
          @keydown.enter.prevent="($event.target as HTMLInputElement).blur()"
        />
        <button
          v-if="dirty"
          class="prow__price-save"
          type="button"
          aria-label="Guardar precio"
          @mousedown.prevent
          @click="commitPrice"
        >
          <i class="fa-solid fa-check"></i>
        </button>
      </div>
    </div>

    <div class="atable__cell prow__flags">
      <button
        class="prow__switch"
        :class="{ 'prow__switch--on': product.isPublished }"
        type="button"
        :aria-pressed="product.isPublished"
        @click="emit('toggle', 'isPublished')"
      >
        <span class="prow__switch-dot"></span>
        {{ product.isPublished ? 'Publicado' : 'Oculto' }}
      </button>
      <button
        class="prow__star"
        :class="{ 'prow__star--on': product.isFeatured }"
        type="button"
        :aria-pressed="product.isFeatured"
        :aria-label="product.isFeatured ? 'Quitar de destacados' : 'Destacar'"
        :title="product.isFeatured ? 'Destacado' : 'Destacar'"
        @click="emit('toggle', 'isFeatured')"
      >
        <i :class="product.isFeatured ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
      </button>
    </div>

    <div class="atable__cell prow__actions">
      <button class="atable__action" type="button" aria-label="Editar" @click="emit('edit')">
        <i class="fa-solid fa-pen"></i>
      </button>
      <button
        class="atable__action atable__action--danger"
        type="button"
        aria-label="Eliminar"
        @click="emit('remove')"
      >
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  </article>
</template>

<style scoped lang="scss">
.prow {
  &__id {
    @include flex(row, center, flex-start, 0.8rem);
  }

  &__thumb {
    width: 44px;
    height: 44px;
    flex: none;
    object-fit: cover;
    border-radius: $radius-sm;
    border: 1px solid $line;

    &--empty {
      @include flex(row, center, center);
      background: $sand;
      color: $ink-muted;
      font-size: 1rem;
    }
  }

  &__text {
    @include flex(column, stretch, center, 0.1rem);
    min-width: 0;
  }

  &__price-box {
    @include flex(row, center, flex-start, 0.3rem);
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    padding-inline: 0.6rem 0.3rem;
    width: 9.5rem;
    @include transition(border-color);

    &:focus-within {
      border-color: $accent;
      box-shadow: 0 0 0 3px rgba($accent, 0.12);
    }

    &--empty {
      border-color: rgba($warning, 0.7);
      background: $warning-bg;
    }
  }

  &__currency {
    font-size: $text-sm;
    color: $ink-muted;
  }

  &__price-input {
    border: none;
    background: transparent;
    border-radius: 0;
    padding: 0.45rem 0;
    width: 100%;
    font-variant-numeric: tabular-nums;

    &:focus {
      box-shadow: none;
    }
  }

  &__price-save {
    @include flex(row, center, center);
    flex: none;
    width: 1.8rem;
    height: 1.8rem;
    border-radius: $radius-sm;
    background: $success;
    color: $surface;
    font-size: 0.75rem;
    @include focus-ring($success);
  }

  &__switch {
    @include flex(row, center, flex-start, 0.45rem);
    font-size: $text-xs;
    font-weight: 600;
    color: $ink-muted;
    border: 1px solid $line;
    border-radius: $radius-pill;
    padding: 0.3rem 0.75rem 0.3rem 0.35rem;
    background: $surface;
    @include transition;
    @include focus-ring;

    &-dot {
      width: 0.95rem;
      height: 0.95rem;
      border-radius: 50%;
      background: $line;
      @include transition(background);
    }

    &--on {
      color: darken($success, 18);
      border-color: rgba($success, 0.4);
      background: $success-bg;

      .prow__switch-dot {
        background: $success;
      }
    }
  }

  &__star {
    @include flex(row, center, center);
    width: 2.15rem;
    height: 2.15rem;
    border-radius: $radius-sm;
    color: $ink-muted;
    font-size: 0.95rem;
    @include transition(color);
    @include focus-ring;

    &--on {
      color: $warning;
    }

    &:hover {
      color: $warning;
    }
  }

  &__actions {
    @include from('md') {
      margin-left: 0.2rem;
    }
  }
}
</style>
