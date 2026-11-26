<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import HeaderMenu from './HeaderMenu.vue'
import logo from '@/assets/logo-wordmark.png'

const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()

const mobileOpen = ref(false)

useBodyScroll(mobileOpen)

// Al navegar se cierra el menú móvil.
watch(
  () => route.fullPath,
  () => (mobileOpen.value = false),
)

/** Activo por ruta, sin contar el hash: "Historia" no debe quedar siempre marcado. */
function isActive(to: string): boolean {
  const path = to.split('#')[0] || '/'
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}
</script>

<template>
  <header class="header" :class="{ 'header--open': mobileOpen }">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand" :aria-label="`${site.name}, inicio`">
        <img class="header__logo" :src="logo" :alt="site.name" width="525" height="141" />
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <div v-for="link in site.nav" :key="link.to" class="header__item">
          <RouterLink
            :to="link.to"
            class="header__link"
            :class="{
              'header__link--active': isActive(link.to),
              'header__link--highlight': link.highlight,
            }"
          >
            {{ link.label }}
            <i v-if="link.children" class="fa-solid fa-chevron-down header__caret"></i>
          </RouterLink>
          <div v-if="link.children" class="header__sub">
            <RouterLink
              v-for="child in link.children"
              :key="child.label"
              :to="child.to"
              class="header__sub-link"
            >
              {{ child.label }}
            </RouterLink>
          </div>
        </div>
      </nav>

      <div class="header__actions">
        <RouterLink
          to="/carrito"
          class="header__icon-btn"
          :aria-label="`Carrito, ${cartStore.count} ${cartStore.count === 1 ? 'artículo' : 'artículos'}`"
        >
          <i class="fa-solid fa-bag-shopping"></i>
          <Transition name="fade">
            <span v-if="cartStore.count > 0" class="header__badge">{{ cartStore.count }}</span>
          </Transition>
        </RouterLink>

        <RouterLink
          v-if="userStore.isAuthenticated"
          to="/cuenta"
          class="header__icon-btn"
          aria-label="Mi cuenta"
        >
          <i class="fa-solid fa-circle-user"></i>
        </RouterLink>
        <RouterLink v-else to="/login" class="btn btn--paper header__cta">
          <i class="fa-solid fa-circle-user" aria-hidden="true"></i> Ingresar
        </RouterLink>

        <button
          class="header__burger"
          :aria-label="mobileOpen ? 'Cerrar menú' : 'Abrir menú'"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <i :class="mobileOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
        </button>
      </div>
    </div>

    <HeaderMenu :open="mobileOpen" />
  </header>
</template>

<style scoped lang="scss">
// Cabecera siempre en vino: el menú se lee sobre cualquier sección.
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: $accent;
  box-shadow: 0 6px 24px rgba($ink, 0.14);

  &__inner {
    @include container(1280px);
    @include flex(row, center, space-between, 1rem);
    padding-block: 0.6rem;
  }

  &__brand {
    flex-shrink: 0;
    @include focus-ring($paper);
  }

  &__logo {
    width: auto;
    height: 36px;
    @include transition(transform);

    @include from('sm') {
      height: 44px;
    }

    @include from('lg') {
      height: 50px;
    }
  }

  &__brand:hover .header__logo {
    transform: scale(1.04);
  }

  &__nav {
    display: none;

    @include from('lg') {
      @include flex(row, center, center, 1.25rem);
    }
  }

  &__item {
    position: relative;

    &:hover .header__sub,
    &:focus-within .header__sub {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }

  &__link {
    @include flex(row, center, flex-start, 0.35rem);
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    white-space: nowrap;
    color: rgba($paper, 0.82);
    padding: 0.7rem 0;
    border-bottom: 2px solid transparent;
    @include transition;
    @include focus-ring($paper);

    &:hover,
    &--active {
      color: $paper;
      border-color: $blush;
    }

    // Servicios en píldora rosa: es lo que más queremos que se clickee.
    &--highlight {
      background: $blush;
      color: $accent-deep;
      padding: 0.45rem 0.95rem;
      border-radius: $radius-pill;
      border-bottom: none;

      &:hover,
      &.header__link--active {
        background: $paper;
        color: $accent-deep;
      }
    }
  }

  &__caret {
    font-size: 0.55rem;
  }

  &__sub {
    @include flex(column, stretch, flex-start);
    position: absolute;
    top: 100%;
    left: -1rem;
    min-width: 13.5rem;
    background: $surface;
    border-radius: $radius-sm;
    box-shadow: $shadow-md;
    padding: 0.4rem;
    opacity: 0;
    visibility: hidden;
    transform: translateY(6px);
    @include transition(opacity transform visibility);
  }

  &__sub-link {
    font-size: $text-sm;
    font-weight: 500;
    color: $ink;
    padding: 0.55rem 0.8rem;
    border-radius: 7px;
    @include transition(background color);

    &:hover {
      background: $sand;
      color: $accent-deep;
    }
  }

  &__actions {
    @include flex(row, center, flex-end, 0.35rem);
  }

  &__icon-btn {
    position: relative;
    @include flex(row, center, center);
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    font-size: 1.05rem;
    color: $paper;
    @include transition;
    @include focus-ring($paper);

    &:hover {
      background: rgba($paper, 0.14);
    }
  }

  &__badge {
    position: absolute;
    top: 0.2rem;
    right: 0.1rem;
    min-width: 1.05rem;
    height: 1.05rem;
    @include flex(row, center, center);
    background: $blush;
    color: $accent-deep;
    font-size: 0.6rem;
    font-weight: 700;
    border-radius: $radius-pill;
    padding-inline: 0.25rem;
  }

  // Visible también en el celular: el cliente no lo encontraba dentro del menú.
  &__cta {
    padding: 0.45rem 0.8rem;
    font-size: $text-xs;
    gap: 0.35rem;

    @include from('lg') {
      padding: 0.55rem 1.2rem;
      margin-left: 0.4rem;
    }
  }

  &__burger {
    font-size: 1.25rem;
    color: $paper;
    width: 2.5rem;
    height: 2.5rem;
    @include flex(row, center, center);

    @include from('lg') {
      display: none;
    }
  }
}
</style>
