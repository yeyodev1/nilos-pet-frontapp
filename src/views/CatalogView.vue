<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import ProductCard from '@/components/catalog/ProductCard.vue'
import ProductCardSkeleton from '@/components/catalog/ProductCardSkeleton.vue'
import CategoryFilter from '@/components/catalog/CategoryFilter.vue'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import PawPrint from '@/components/ui/PawPrint.vue'

const route = useRoute()
const router = useRouter()

const { categories, products, loading, error, search, category, page, pages, total, reload } =
  useCatalog({
    search: typeof route.query.q === 'string' ? route.query.q : '',
    category: typeof route.query.category === 'string' ? route.query.category : '',
  })

// Los filtros viven también en la URL: compartir el enlace conserva la búsqueda.
watch([search, category], ([q, cat]) => {
  const query: Record<string, string> = {}
  if (q.trim()) query.q = q.trim()
  if (cat) query.category = cat
  router.replace({ query })
})

// Y al revés: navegar con "atrás" restaura los filtros.
watch(
  () => route.query,
  (query) => {
    const q = typeof query.q === 'string' ? query.q : ''
    const cat = typeof query.category === 'string' ? query.category : ''
    if (q !== search.value.trim()) search.value = q
    if (cat !== category.value) category.value = cat
  },
)

const hasFilters = computed(() => Boolean(search.value.trim() || category.value))

function clearFilters() {
  search.value = ''
  category.value = ''
}
</script>

<template>
  <div class="catalog">
    <header class="catalog__head">
      <span class="catalog__paw" aria-hidden="true"><PawPrint /></span>
      <p class="catalog__eyebrow">{{ site.catalog.eyebrow }}</p>
      <h1 class="catalog__title">
        <DisplayParts :parts="site.catalog.titleParts" />
      </h1>
      <p v-if="!loading && !error" class="catalog__tally">
        <strong>{{ total }}</strong> {{ total === 1 ? 'producto' : 'productos' }}
        <template v-if="category || search.trim()"> con tus filtros</template>
        <template v-else> esperándote</template>
      </p>

      <div class="catalog__search">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input
          v-model="search"
          type="search"
          :placeholder="site.catalog.searchPlaceholder"
          aria-label="Buscar productos"
        />
      </div>

      <CategoryFilter v-if="categories.length" v-model="category" :categories="categories" />
    </header>

    <section class="catalog__results" aria-live="polite">
      <div v-if="loading" class="catalog__list">
        <ProductCardSkeleton v-for="n in 6" :key="n" :tone="n % 2 === 0 ? 'blush' : 'sand'" />
      </div>

      <div v-else-if="error" class="catalog__state">
        <span class="catalog__state-icon"><i class="fa-solid fa-plug-circle-exclamation"></i></span>
        <h2 class="catalog__state-title">No pudimos cargar la tienda</h2>
        <p class="catalog__state-text">{{ error }}</p>
        <button class="btn btn--ghost" @click="reload">Reintentar</button>
      </div>

      <div v-else-if="products.length === 0 && hasFilters" class="catalog__state">
        <span class="catalog__state-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
        <h2 class="catalog__state-title">Sin resultados</h2>
        <p class="catalog__state-text">No encontramos productos con esos filtros.</p>
        <button class="btn btn--ghost" @click="clearFilters">Limpiar filtros</button>
      </div>

      <div v-else-if="products.length === 0" class="catalog__state">
        <span class="catalog__state-icon"><i class="fa-solid fa-paw"></i></span>
        <h2 class="catalog__state-title">Catálogo en preparación</h2>
        <p class="catalog__state-text">
          Estamos subiendo los productos de la tienda. Vuelve pronto.
        </p>
        <RouterLink to="/servicios" class="btn btn--ghost">Ver servicios</RouterLink>
      </div>

      <template v-else>
        <div class="catalog__list">
          <ProductCard
            v-for="(product, index) in products"
            :key="product._id"
            :product="product"
            :tone-seed="index"
          />
        </div>

        <nav v-if="pages > 1" class="catalog__pagination" aria-label="Paginación">
          <button class="catalog__page-btn" :disabled="page <= 1" @click="page--">
            <i class="fa-solid fa-arrow-left"></i> Anterior
          </button>
          <span class="catalog__page-info">Página {{ page }} de {{ pages }}</span>
          <button class="catalog__page-btn" :disabled="page >= pages" @click="page++">
            Siguiente <i class="fa-solid fa-arrow-right"></i>
          </button>
        </nav>
      </template>
    </section>
  </div>
</template>

<style scoped lang="scss">
.catalog {
  @include container;
  padding-block: $space-lg $space-section;
  // La huella decorativa asoma por el borde: que no cree scroll horizontal.
  overflow-x: clip;

  &__head {
    @include flex(column, stretch, flex-start, 1rem);
    position: relative;
    margin-bottom: $space-lg;
  }

  &__paw {
    position: absolute;
    top: -1.5rem;
    right: 0;
    font-size: 7.5rem;
    color: rgba($blush, 0.45);
    transform: rotate(16deg);
    pointer-events: none;

    @include from('md') {
      right: 4%;
      font-size: 9rem;
    }
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2.4rem, 6.5vw, 4.6rem));
    max-width: 20ch;
  }

  &__tally {
    font-size: $text-lg;
    color: $ink-soft;

    strong {
      font-family: $font-display;
      font-style: italic;
      font-size: 1.35em;
      font-weight: 600;
      color: $accent;
    }
  }

  &__search {
    position: relative;
    max-width: 480px;
    margin-top: 0.4rem;

    i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.85rem;
    }

    input {
      padding-left: 2.6rem;
      border-radius: $radius-pill;
    }
  }

  &__list {
    @include flex-cards(250px, 1.5rem);

    // Que una fila corta no estire una tarjeta a todo el ancho.
    > * {
      max-width: 420px;
    }
  }

  &__state {
    @include flex(column, center, center, 0.7rem);
    text-align: center;
    padding-block: $space-xl;

    &-icon {
      @include flex(row, center, center);
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      background: $sand;
      color: $accent;
      font-size: 1.3rem;
      margin-bottom: 0.4rem;
    }

    &-title {
      @include display($display-sm, 500);
    }

    &-text {
      color: $ink-soft;
      max-width: 44ch;
      margin-bottom: 0.6rem;
    }
  }

  &__pagination {
    @include flex(row, center, center, 1.2rem);
    flex-wrap: wrap;
    margin-top: $space-lg;
  }

  &__page-btn {
    @include flex(row, center, center, 0.5rem);
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    border: 1px solid $line;
    border-radius: $radius-pill;
    padding: 0.55rem 1.2rem;
    @include transition;

    &:hover:not(:disabled) {
      border-color: $accent;
      color: $accent-deep;
    }

    &:disabled {
      opacity: 0.4;
      cursor: default;
    }
  }

  &__page-info {
    font-size: $text-sm;
    color: $ink-muted;
  }
}
</style>
