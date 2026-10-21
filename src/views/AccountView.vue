<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { useMyOrders } from '@/composables/useMyOrders'
import OrderCard from '@/components/account/OrderCard.vue'

const router = useRouter()
const userStore = useUserStore()
const toast = useToastStore()
const { orders, loading, error, page, pages, load, isProcessing } = useMyOrders()

onMounted(() => load())

function logout() {
  userStore.clear()
  toast.info('Sesión cerrada')
  router.replace('/')
}
</script>

<template>
  <section class="account">
    <header class="account__head">
      <div>
        <p class="account__eyebrow">Mi cuenta</p>
        <h1 class="account__title">{{ userStore.user?.name || userStore.user?.email }}</h1>
      </div>
      <button class="btn btn--ghost account__logout" @click="logout">
        <i class="fa-solid fa-right-from-bracket"></i> Cerrar sesión
      </button>
    </header>

    <dl class="account__data">
      <div>
        <dt>Correo</dt>
        <dd>{{ userStore.user?.email }}</dd>
      </div>
      <div v-if="userStore.user?.phone">
        <dt>Teléfono</dt>
        <dd>{{ userStore.user?.phone }}</dd>
      </div>
      <div>
        <dt>Tipo de cuenta</dt>
        <dd>{{ userStore.isAdmin ? 'Administrador' : 'Cliente' }}</dd>
      </div>
    </dl>

    <section class="account__orders">
      <h2 class="account__subtitle">Mis pedidos</h2>

      <p v-if="loading" class="account__state">
        <i class="fa-solid fa-spinner fa-spin"></i> Cargando tus pedidos…
      </p>

      <p v-else-if="error" class="account__state account__state--error">
        <i class="fa-solid fa-circle-exclamation"></i> {{ error }}
      </p>

      <div v-else-if="!orders.length" class="account__empty">
        <i class="fa-solid fa-bag-shopping"></i>
        <p>Todavía no tienes pedidos. Cuando compres en la tienda, los verás aquí.</p>
        <RouterLink class="btn btn--primary" to="/tienda">Ir a la tienda</RouterLink>
      </div>

      <template v-else>
        <div class="account__list">
          <OrderCard v-for="order in orders" :key="order._id" :order="order" :processing="isProcessing(order)" />
        </div>

        <nav v-if="pages > 1" class="account__pager" aria-label="Páginas de pedidos">
          <button class="btn btn--ghost" :disabled="page <= 1" @click="load(page - 1)">
            <i class="fa-solid fa-chevron-left"></i> Anteriores
          </button>
          <span>Página {{ page }} de {{ pages }}</span>
          <button class="btn btn--ghost" :disabled="page >= pages" @click="load(page + 1)">
            Siguientes <i class="fa-solid fa-chevron-right"></i>
          </button>
        </nav>
      </template>
    </section>
  </section>
</template>

<style scoped lang="scss">
.account {
  @include container(840px);
  @include flex(column, stretch, flex-start, $space-md);
  padding-block: $space-lg $space-section;

  &__head {
    @include flex(row, flex-end, space-between, 1rem);
    flex-wrap: wrap;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-sm, 600);
    margin-top: 0.3rem;
    overflow-wrap: anywhere;
  }

  &__logout {
    flex-shrink: 0;
  }

  &__data {
    @include card;
    @include flex-cards(180px, 1rem);
    padding: 1.4rem 1.6rem;

    dt {
      @include eyebrow;
      font-size: 0.62rem;
      color: $ink-muted;
    }

    dd {
      font-size: $text-base;
      margin-top: 0.2rem;
      overflow-wrap: anywhere;
    }
  }

  &__subtitle {
    @include display($text-xl, 600);
    margin-bottom: 1rem;
  }

  &__state {
    @include flex(row, center, flex-start, 0.5rem);
    color: $ink-soft;
    font-size: $text-sm;

    &--error {
      color: $danger;
    }
  }

  &__empty {
    @include card;
    @include flex(column, center, center, 0.7rem);
    text-align: center;
    padding: $space-lg 1.5rem;

    i {
      font-size: 1.7rem;
      color: $accent-soft;
    }

    p {
      font-size: $text-sm;
      color: $ink-soft;
      max-width: 44ch;
    }

    .btn {
      margin-top: 0.5rem;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 0.8rem);
  }

  &__pager {
    @include flex(row, center, space-between, 0.8rem);
    flex-wrap: wrap;
    margin-top: $space-md;

    span {
      font-size: $text-xs;
      color: $ink-muted;
    }

    .btn {
      padding: 0.6rem 1.2rem;
      font-size: 0.78rem;
    }
  }
}
</style>
