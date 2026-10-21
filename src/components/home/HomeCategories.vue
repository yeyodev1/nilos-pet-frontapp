<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useGsapReveal } from '@/composables/useGsapReveal'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import PawPrint from '@/components/ui/PawPrint.vue'
import type { Category } from '@/types'

const root = ref<HTMLElement | null>(null)
const categories = ref<Category[]>([])

const { init, refresh } = useGsapReveal(root)

// Si el API no responde, la sección simplemente no existe.
onMounted(async () => {
  try {
    categories.value = await catalogService.getCategories()
  } catch {
    categories.value = []
  } finally {
    await nextTick()
    init()
    refresh()
  }
})
</script>

<template>
  <section v-if="categories.length" ref="root" class="cats">
    <div class="cats__inner">
      <header class="cats__head" data-reveal>
        <p class="cats__eyebrow">{{ site.categoriesSection.eyebrow }}</p>
        <h2 class="cats__title">
          <DisplayParts :parts="site.categoriesSection.titleParts" />
        </h2>
      </header>

      <ol class="cats__list">
        <li
          v-for="(cat, index) in categories"
          :key="cat._id"
          class="cats__item"
          data-reveal
          :data-reveal-delay="(index % 2) * 0.08"
        >
          <RouterLink :to="`/tienda?category=${cat.slug}`" class="cats__link">
            <span class="cats__number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="cats__name">{{ cat.name }}</span>
            <span class="cats__arrow" aria-hidden="true">
              <i class="fa-solid fa-arrow-right"></i>
            </span>
          </RouterLink>
        </li>
      </ol>

      <div class="cats__foot" data-reveal>
        <PawPrint class="cats__foot-paw" />
        <RouterLink to="/tienda" class="btn btn--dark">
          {{ site.categoriesSection.cta }} <i class="fa-solid fa-arrow-right"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cats {
  border-top: 1px solid $line;

  &__inner {
    @include container;
    padding-block: $space-xl;

    @include from('md') {
      padding-block: $space-section;
    }
  }

  &__head {
    margin-bottom: $space-lg;
  }

  &__eyebrow {
    @include eyebrow;
    margin-bottom: 0.7rem;
  }

  &__title {
    @include display($display-md);
    max-width: 18ch;
  }

  &__list {
    @include flex(row, stretch, flex-start, 0);
    flex-wrap: wrap;
    list-style: none;
    border-top: 1px solid $line;
  }

  &__item {
    flex: 1 1 100%;
    border-bottom: 1px solid $line;

    @include from('md') {
      flex-basis: 50%;
    }
  }

  &__link {
    @include flex(row, baseline, flex-start, 1rem);
    padding: 1.05rem 0.6rem;
    border-radius: $radius-sm;
    @include transition;

    @include from('md') {
      padding-inline: 1rem;
    }

    &:hover {
      background: $blush-soft;
      transform: translateX(6px);

      .cats__name {
        font-style: italic;
        color: $accent-deep;
      }

      .cats__arrow {
        opacity: 1;
        transform: translateX(0);
      }

      .cats__number {
        color: $accent;
      }
    }
  }

  &__number {
    @include eyebrow;
    color: $ink-muted;
    font-variant-numeric: tabular-nums;
    @include transition(color);
  }

  &__name {
    @include display(clamp(1.25rem, 2.4vw, 1.75rem), 500);
    color: $ink;
    @include transition(color);
  }

  &__arrow {
    margin-left: auto;
    color: $accent;
    opacity: 0;
    transform: translateX(-8px);
    @include transition;
  }

  &__foot {
    @include flex(row, center, flex-start, 1.2rem);
    margin-top: $space-lg;
  }

  &__foot-paw {
    font-size: 1.8rem;
    color: $blush;
    transform: rotate(-12deg);
  }
}
</style>
