<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import type { Product } from '@/types'
import ProductCard from '@/components/catalog/ProductCard.vue'

const products = ref<Product[]>([])
const loaded = ref(false)

// Si el catálogo aún está vacío (o el API no responde), la sección no existe.
onMounted(async () => {
  try {
    const data = await catalogService.listProducts({ featured: true, limit: 4 })
    products.value = data.items
  } catch {
    products.value = []
  } finally {
    loaded.value = true
  }
})
</script>

<template>
  <section v-if="loaded && products.length > 0" class="featured">
    <div class="featured__inner">
      <div class="featured__head">
        <div>
          <p class="featured__eyebrow">Destacados</p>
          <h2 class="featured__title">Los favoritos de la tienda</h2>
        </div>
        <RouterLink to="/tienda" class="featured__link">
          Ver toda la tienda <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

      <div class="featured__list">
        <ProductCard v-for="product in products" :key="product._id" :product="product" />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.featured {
  background: $sand;

  &__inner {
    @include container;
    padding-block: $space-xl;

    @include from('md') {
      padding-block: $space-section;
    }
  }

  &__head {
    @include flex(row, flex-end, space-between, 1.5rem);
    flex-wrap: wrap;
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.5rem;
  }

  &__title {
    @include display($display-sm, 500);
  }

  &__link {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;
    @include transition(gap);

    &:hover {
      gap: 0.8rem;
    }
  }

  &__list {
    @include flex-cards(250px, 1.5rem);
  }
}
</style>
