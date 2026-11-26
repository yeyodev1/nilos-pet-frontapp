<script setup lang="ts">
import { ref } from 'vue'
import { site } from '@/config/site'
import { useServicesPicker } from '@/composables/useServicesPicker'
import { formatMoney } from '@/utils/format'
import { finalPrice } from '@/utils/catalog'
import ServiceModal from '@/components/services/ServiceModal.vue'
import GroupFilter from '@/components/services/GroupFilter.vue'
import PageHero from '@/components/ui/PageHero.vue'
import heroImage from '@/assets/hero-examenes.webp'

const copy = site.examsPage
const {
  loading,
  error,
  reload,
  group,
  groups,
  subgroup,
  subgroups,
  visible,
  toggle,
  selectedIds,
  selected,
  totalCents,
  hasUnpriced,
} = useServicesPicker('exam', site.examGroups)

const ordering = ref(false)

function closeOrder() {
  ordering.value = false
}
</script>

<template>
  <div>
    <PageHero
      :eyebrow="copy.eyebrow"
      :title-parts="copy.titleParts"
      :subtitle="copy.subtitle"
      :image="heroImage"
      :alt="copy.imageAlt"
      :sticker="copy.sticker"
    >
      <RouterLink to="/resultados" class="btn btn--primary">
        <i class="fa-solid fa-file-waveform"></i> {{ copy.resultsCta }}
      </RouterLink>
    </PageHero>
    <div class="exams">
      <GroupFilter v-model="group" :groups="groups" :all-label="copy.all" />
      <GroupFilter
        v-if="subgroups.length"
        v-model="subgroup"
        class="exams__subgroups"
        :groups="subgroups"
        :all-label="copy.allSubgroups"
      />

      <p v-if="loading" class="exams__state"><i class="fa-solid fa-spinner fa-spin"></i></p>
      <div v-else-if="error" class="exams__state">
        <p>{{ error }}</p>
        <button class="btn btn--ghost" @click="reload">Reintentar</button>
      </div>

      <ul v-else class="exams__list">
        <li v-for="exam in visible" :key="exam._id">
          <label class="exams__row" :class="{ 'exams__row--on': selectedIds.has(exam._id) }">
            <input
              type="checkbox"
              class="visually-hidden"
              :checked="selectedIds.has(exam._id)"
              @change="toggle(exam._id)"
            />
            <span class="exams__check" aria-hidden="true"><i class="fa-solid fa-check"></i></span>
            <span class="exams__name">{{ exam.name }}</span>
            <span class="exams__price" :class="{ 'exams__price--ask': exam.price === 0 }">
              {{ exam.price > 0 ? formatMoney(finalPrice(exam) / 100) : 'Precio en sucursal' }}
            </span>
          </label>
        </li>
      </ul>

      <Transition name="rise">
        <div v-if="selected.length" class="exams__summary">
          <div>
            <span class="exams__summary-count">
              {{ selected.length }} {{ selected.length === 1 ? 'examen' : 'exámenes' }}
            </span>
            <strong class="exams__summary-total">{{ formatMoney(totalCents / 100) }}</strong>
            <small v-if="hasUnpriced">{{ copy.unpricedNote }}</small>
          </div>
          <button class="btn btn--paper" @click="ordering = true">
            Continuar <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </Transition>

      <ServiceModal
        :products="ordering ? selected : []"
        title="Toma de muestra"
        @close="closeOrder"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.exams {
  @include container(860px);
  padding-block: $space-lg 9rem;

  &__subgroups {
    margin-top: -0.6rem;

    :deep(button) {
      font-size: $text-xs;
      padding: 0.35rem 0.9rem;
      background: $blush-soft;
      border-color: transparent;

      &.on {
        background: $accent-deep;
      }
    }
  }

  &__state {
    @include flex(column, center, center, 0.8rem);
    padding-block: $space-xl;
    color: $ink-soft;
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.5rem);
    list-style: none;
  }

  &__row {
    @include card;
    @include flex(row, center, flex-start, 0.9rem);
    padding: 0.9rem 1.1rem;
    margin: 0;
    cursor: pointer;
    color: $ink;
    @include transition;

    &:hover {
      border-color: rgba($accent, 0.4);
    }

    &--on {
      border-color: $accent;
      background: $accent-soft;
    }
  }

  &__check {
    @include flex(row, center, center);
    width: 1.4rem;
    height: 1.4rem;
    flex-shrink: 0;
    border: 2px solid $line;
    border-radius: 6px;
    font-size: 0.65rem;
    color: transparent;

    .exams__row--on & {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }

  &__name {
    flex: 1;
    font-size: $text-base;
    font-weight: 500;
  }

  &__price {
    font-weight: 600;
    color: $accent-deep;
    white-space: nowrap;

    &--ask {
      font-size: $text-xs;
      font-weight: 500;
      color: $ink-muted;
    }
  }

  &__summary {
    position: fixed;
    bottom: 1.2rem;
    left: 1.25rem;
    right: 1.25rem;
    z-index: 80;
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    max-width: 640px;
    margin-inline: auto;
    background: $ink;
    color: $paper;
    border-radius: $radius-md;
    padding: 1rem 1.3rem;
    box-shadow: $shadow-lg;

    > div {
      @include flex(column, flex-start, flex-start, 0.1rem);
    }

    small {
      font-size: $text-xs;
      color: rgba($paper, 0.65);
    }

    &-count {
      @include eyebrow;
      color: $blush;
    }

    &-total {
      @include display($text-xl, 600);
    }
  }
}
</style>
