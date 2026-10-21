<script setup lang="ts">
import { computed } from 'vue'
import StatusPill from './StatusPill.vue'
import { formatDateTime, orderStatusMeta } from './adminFormat'
import { formatMoney } from '@/utils/format'
import type { AdminOrder } from '@/services/admin.service'

const props = defineProps<{ order: AdminOrder }>()

const branchName = computed(() => {
  const branch = props.order.branch
  return branch && typeof branch === 'object' ? branch.name : ''
})

const payphone = computed(() => props.order.payphone || null)
</script>

<template>
  <div class="odetail">
    <header class="odetail__head">
      <div>
        <span class="odetail__number">Orden #{{ order.number }}</span>
        <span class="odetail__date">{{ formatDateTime(order.createdAt) }}</span>
      </div>
      <StatusPill
        :label="orderStatusMeta[order.status]?.label || order.status"
        :tone="orderStatusMeta[order.status]?.tone"
      />
    </header>

    <section class="odetail__block">
      <h4 class="odetail__subtitle">Comprador</h4>
      <ul class="odetail__facts">
        <li><i class="fa-solid fa-user"></i>{{ order.customer.name }}</li>
        <li><i class="fa-solid fa-envelope"></i>{{ order.customer.email }}</li>
        <li><i class="fa-solid fa-phone"></i>{{ order.customer.phone }}</li>
        <li><i class="fa-solid fa-id-card"></i>{{ order.customer.documentId }}</li>
      </ul>
    </section>

    <section class="odetail__block">
      <h4 class="odetail__subtitle">Entrega</h4>
      <p class="odetail__text">
        <template v-if="order.fulfillment === 'delivery'">
          Envío a domicilio<template v-if="order.deliveryAddress">: {{ order.deliveryAddress }}</template>
        </template>
        <template v-else>
          Retiro en sucursal<template v-if="branchName">: {{ branchName }}</template>
        </template>
      </p>
    </section>

    <section class="odetail__block">
      <h4 class="odetail__subtitle">Ítems</h4>
      <ul class="odetail__items">
        <li v-for="(item, index) in order.items" :key="index" class="odetail__item">
          <span class="odetail__item-name">
            {{ item.name }}
            <small>× {{ item.qty }}</small>
          </span>
          <span class="odetail__item-price">{{ formatMoney((item.price * item.qty) / 100) }}</span>
        </li>
      </ul>
      <p class="odetail__total">
        <span>Total</span>
        <strong>{{ formatMoney(order.total / 100) }}</strong>
      </p>
    </section>

    <section class="odetail__block">
      <h4 class="odetail__subtitle">Pago (Payphone)</h4>
      <ul v-if="payphone" class="odetail__facts">
        <li v-if="payphone.transactionStatus">
          <i class="fa-solid fa-credit-card"></i>Estado: {{ payphone.transactionStatus }}
        </li>
        <li v-if="payphone.transactionId">
          <i class="fa-solid fa-hashtag"></i>Transacción: {{ payphone.transactionId }}
        </li>
        <li v-if="payphone.authorizationCode">
          <i class="fa-solid fa-check-double"></i>Autorización: {{ payphone.authorizationCode }}
        </li>
        <li v-if="payphone.message"><i class="fa-solid fa-comment"></i>{{ payphone.message }}</li>
      </ul>
      <p v-else class="odetail__text odetail__text--muted">Sin respuesta de Payphone registrada.</p>
    </section>
  </div>
</template>

<style scoped lang="scss">
.odetail {
  @include flex(column, stretch, flex-start, 1.1rem);

  &__head {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
  }

  &__number {
    display: block;
    font-weight: 600;
    font-size: $text-lg;
    font-family: $font-display;
  }

  &__date {
    font-size: $text-xs;
    color: $ink-muted;
  }

  &__subtitle {
    font-family: $font-principal;
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: $ink-muted;
    margin-bottom: 0.45rem;
  }

  &__block {
    border-top: 1px solid $line;
    padding-top: 0.9rem;
  }

  &__facts {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.3rem);
    font-size: $text-sm;

    i {
      width: 1.4rem;
      color: $accent;
      font-size: 0.8rem;
    }
  }

  &__text {
    font-size: $text-sm;

    &--muted {
      color: $ink-muted;
    }
  }

  &__items {
    list-style: none;
    @include flex(column, stretch, flex-start, 0.4rem);
  }

  &__item {
    @include flex(row, baseline, space-between, 1rem);
    font-size: $text-sm;

    &-name small {
      color: $ink-muted;
    }

    &-price {
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }
  }

  &__total {
    @include flex(row, baseline, space-between, 1rem);
    border-top: 1px dashed $line;
    margin-top: 0.6rem;
    padding-top: 0.6rem;
    font-size: $text-base;

    strong {
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
