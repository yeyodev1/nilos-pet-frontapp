<script lang="ts">
/** Línea normalizada: tanto CartLine como OrderItem se mapean a esto. */
export interface SummaryLine {
  key: string
  name: string
  qty: number
  /** Centavos por unidad. */
  price: number
  branchName?: string
  scheduledFor?: string | null
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import { formatMoney } from '@/utils/format'
import { formatDateTime } from '@/utils/datetime'

const props = withDefaults(
  defineProps<{
    lines: SummaryLine[]
    /** Centavos. */
    total: number
    title?: string
    /** En el carrito las líneas ya se ven al lado: ahí solo interesa el total. */
    showLines?: boolean
  }>(),
  { title: 'Resumen del pedido', showLines: true },
)

const count = computed(() => props.lines.reduce((sum, line) => sum + line.qty, 0))
</script>

<template>
  <aside class="summary">
    <h2 class="summary__title">{{ title }}</h2>

    <ul v-if="showLines" class="summary__lines">
      <li v-for="line in lines" :key="line.key" class="summary__line">
        <div class="summary__info">
          <span class="summary__name">{{ line.name }}</span>
          <span v-if="line.branchName" class="summary__booking">
            <i class="fa-solid fa-location-dot"></i>
            {{ line.branchName }}
            <template v-if="line.scheduledFor"> · {{ formatDateTime(line.scheduledFor) }}</template>
          </span>
          <span v-if="line.qty > 1" class="summary__qty">{{ line.qty }} × {{ formatMoney(line.price / 100) }}</span>
        </div>
        <span class="summary__amount">{{ formatMoney((line.price * line.qty) / 100) }}</span>
      </li>
    </ul>

    <p v-else class="summary__count">
      {{ count }} {{ count === 1 ? 'artículo' : 'artículos' }}
    </p>

    <div class="summary__total">
      <span>Total</span>
      <strong>{{ formatMoney(total / 100) }}</strong>
    </div>

    <slot />
  </aside>
</template>

<style scoped lang="scss">
.summary {
  @include card;
  @include flex(column, stretch, flex-start, 0.9rem);
  padding: 1.6rem 1.5rem;
  box-shadow: $shadow-sm;
  height: fit-content;

  &__title {
    @include display($text-lg, 600);
  }

  &__lines {
    @include flex(column, stretch, flex-start, 0.75rem);
    list-style: none;
  }

  &__line {
    @include flex(row, flex-start, space-between, 1rem);
    padding-bottom: 0.75rem;
    border-bottom: 1px dashed $line;

    &:last-child {
      border-bottom: 0;
      padding-bottom: 0;
    }
  }

  &__info {
    @include flex(column, flex-start, flex-start, 0.15rem);
    min-width: 0;
  }

  &__name {
    font-size: $text-sm;
    font-weight: 500;
  }

  &__booking {
    font-size: $text-xs;
    color: $ink-soft;

    i {
      color: $accent;
      margin-right: 0.25rem;
    }
  }

  &__qty {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__amount {
    font-size: $text-sm;
    font-weight: 600;
    white-space: nowrap;
  }

  &__count {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__total {
    @include flex(row, baseline, space-between);
    padding-top: 0.9rem;
    border-top: 1px solid $line;

    span {
      @include eyebrow;
      font-size: 0.68rem;
    }

    strong {
      @include display($text-xl, 600);
    }
  }
}
</style>
