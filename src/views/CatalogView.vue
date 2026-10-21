<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { site } from '@/config/site'
import { useCatalog } from '@/composables/useCatalog'
import ProductCard from '@/components/catalog/ProductCard.vue'
import ProductCardSkeleton from '@/components/catalog/ProductCardSkeleton.vue'
import CategoryFilter from '@/components/catalog/CategoryFilter.vue'

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
      <p class="catalog__eyebrow">Tienda</p>
      <h1 class="catalog__title">{{ site.tagline }}</h1>

      <div class="catalog__search">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input
          v-model="search"
          type="search"
          placeholder="Busca alimento, medicinas, accesorios…"
          aria-label="Buscar productos"
        />
      </div>

      <CategoryFilter v-if="categories.length" v-model="category" :categories="categories" />
    </header>

    <section class="catalog__results" aria-live="polite">
      <div v-if="loading" class="catalog__list">
        <ProductCardSkeleton v-for="n in 6" :key="n" />
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
        <p class="catalog__count">{{ total }} {{ total === 1 ? 'producto' : 'productos' }}</p>
        <div class="catalog__list">
          <ProductCard v-for="product in products" :key="product._id" :product="product" />
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

  &__head {
    @include flex(column, stretch, flex-start, 1.2rem);
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
    max-width: 20ch;
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

  &__count {
    @include eyebrow;
    color: $ink-muted;
    margin-bottom: 1.2rem;
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
