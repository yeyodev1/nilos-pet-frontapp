<script setup lang="ts">
import { ref } from 'vue'
import { formatDate, formatMoney } from '@/utils/format'
import { formatDateTime } from '@/utils/datetime'
import { ORDER_STATUS } from '@/composables/useMyOrders'
import type { Order, OrderItem } from '@/types'

const props = defineProps<{
  order: Order
  /** Pending con menos de 10 minutos: el pago todavía puede confirmarse solo. */
  processing?: boolean
}>()

const expanded = ref(false)

const status = ORDER_STATUS[props.order.status] || { label: props.order.status, tone: 'muted' }

function branchName(item: OrderItem): string {
  return item.branch && typeof item.branch === 'object' ? item.branch.name : ''
}
</script>

<template>
  <article class="order" :class="{ 'order--open': expanded }">
    <button class="order__head" type="button" :aria-expanded="expanded" @click="expanded = !expanded">
      <div class="order__id">
        <span class="order__number">Pedido #{{ order.number }}</span>
        <span class="order__date">{{ formatDate(order.createdAt) }}</span>
      </div>

      <span class="order__pill" :class="`order__pill--${status.tone}`">{{ status.label }}</span>
      <span class="order__total">{{ formatMoney(order.total / 100) }}</span>
      <i class="fa-solid fa-chevron-down order__chevron"></i>
    </button>

    <p v-if="processing" class="order__processing">
      <i class="fa-solid fa-hourglass-half"></i>
      Pago en proceso: si acabas de pagar, el estado se actualizará en unos minutos.
    </p>

    <Transition name="rise">
      <ul v-if="expanded" class="order__items">
        <li v-for="(item, index) in order.items" :key="index" class="order__item">
          <div class="order__item-info">
            <span class="order__item-name">{{ item.name }}</span>
            <span v-if="item.scheduledFor" class="order__item-booking">
              <i class="fa-solid fa-location-dot"></i>
              {{ branchName(item) || 'Sucursal por confirmar' }} · {{ formatDateTime(item.scheduledFor) }}
            </span>
            <span v-if="item.qty > 1" class="order__item-qty">{{ item.qty }} × {{ formatMoney(item.price / 100) }}</span>
          </div>
          <span class="order__item-amount">{{ formatMoney((item.price * item.qty) / 100) }}</span>
        </li>
      </ul>
    </Transition>
  </article>
</template>

<style scoped lang="scss">
.order {
  @include card;
  overflow: hidden;
  @include transition(box-shadow);

  &--open,
  &:hover {
    box-shadow: $shadow-sm;
  }

  &__head {
    @include flex(row, center, flex-start, 0.8rem);
    flex-wrap: wrap;
    width: 100%;
    text-align: left;
    padding: 1rem 1.2rem;
  }

  &__id {
    @include flex(column, flex-start, flex-start, 0.05rem);
    margin-right: auto;
  }

  &__number {
    font-weight: 600;
    font-size: $text-sm;
  }

  &__date {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__pill {
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.25rem 0.7rem;
    border-radius: $radius-pill;

    &--success {
      color: $success;
      background: $success-bg;
    }

    &--warning {
      // $warning aclarado no contrasta sobre su propio fondo: tono fijo más oscuro
      color: #8a6420;
      background: $warning-bg;
    }

    &--danger {
      color: $danger;
      background: $danger-bg;
    }

    &--muted {
      color: $ink-muted;
      background: $sand;
    }
  }

  &__total {
    font-weight: 600;
    font-size: $text-sm;
    white-space: nowrap;
  }

  &__chevron {
    font-size: 0.7rem;
    color: $ink-muted;
    @include transition(transform);

    .order--open & {
      transform: rotate(180deg);
    }
  }

  &__processing {
    @include flex(row, flex-start, flex-start, 0.5rem);
    font-size: $text-xs;
    color: $ink-soft;
    background: $warning-bg;
    padding: 0.6rem 1.2rem;

    i {
      color: $warning;
      margin-top: 0.15rem;
    }
  }

  &__items {
    @include flex(column, stretch, flex-start, 0.6rem);
    list-style: none;
    border-top: 1px dashed $line;
    padding: 1rem 1.2rem;
    background: rgba($sand, 0.45);
  }

  &__item {
    @include flex(row, flex-start, space-between, 1rem);
  }

  &__item-info {
    @include flex(column, flex-start, flex-start, 0.1rem);
    min-width: 0;
  }

  &__item-name {
    font-size: $text-sm;
  }

  &__item-booking {
    font-size: $text-xs;
    color: $ink-soft;

    i {
      color: $accent;
      margin-right: 0.25rem;
    }
  }

  &__item-qty {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__item-amount {
    font-size: $text-sm;
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>
