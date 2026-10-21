<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useGsapReveal } from '@/composables/useGsapReveal'
import type { Product } from '@/types'
import ProductCard from '@/components/catalog/ProductCard.vue'
import DisplayParts from '@/components/ui/DisplayParts.vue'

const root = ref<HTMLElement | null>(null)
const products = ref<Product[]>([])
const loaded = ref(false)

const { init, refresh } = useGsapReveal(root)

// Si el catálogo aún está vacío (o el API no responde), la sección no existe.
onMounted(async () => {
  try {
    const data = await catalogService.listProducts({ featured: true, limit: 4 })
    products.value = data.items
  } catch {
    products.value = []
  } finally {
    loaded.value = true
    await nextTick()
    init()
    refresh()
  }
})
</script>

<template>
  <section v-if="loaded && products.length > 0" ref="root" class="featured">
    <div class="featured__inner">
      <div class="featured__head" data-reveal>
        <div>
          <p class="featured__eyebrow">{{ site.featuredSection.eyebrow }}</p>
          <h2 class="featured__title">
            <DisplayParts :parts="site.featuredSection.titleParts" />
          </h2>
        </div>
        <RouterLink to="/tienda" class="featured__link">
          {{ site.featuredSection.cta }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>

      <div class="featured__list">
        <div
          v-for="(product, index) in products"
          :key="product._id"
          class="featured__cell"
          data-reveal
          :data-reveal-delay="index * 0.08"
        >
          <ProductCard :product="product" :tone-seed="index" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.featured {
  border-top: 1px solid $line;

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
    margin-bottom: 0.6rem;
  }

  &__title {
    @include display($display-md);
  }

  &__link {
    @include flex(row, center, flex-start, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $accent-deep;

    .fa-arrow-right {
      @include transition(transform);
    }

    &:hover .fa-arrow-right {
      transform: translateX(4px);
    }
  }

  &__list {
    @include flex-cards(230px, 1.5rem);
  }

  &__cell {
    @include flex(column, stretch, flex-start);

    > * {
      flex: 1;
    }
  }
}
</style>
