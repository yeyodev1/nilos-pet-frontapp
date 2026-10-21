<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'
import { useCartStore } from '@/stores/cart'
import { useBodyScroll } from '@/composables/useBodyScroll'
import nilos from '@/assets/logo-nilos.webp'

const route = useRoute()
const userStore = useUserStore()
const cartStore = useCartStore()

const mobileOpen = ref(false)
const scrolled = ref(false)

useBodyScroll(mobileOpen)

// El fondo del header aparece recién al hacer scroll.
function onScroll() {
  scrolled.value = window.scrollY > 12
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Al navegar se cierra el menú móvil.
watch(
  () => route.fullPath,
  () => (mobileOpen.value = false),
)
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled, 'header--open': mobileOpen }">
    <div class="header__inner">
      <RouterLink to="/" class="header__brand">
        <img class="header__logo" :src="nilos" alt="" width="46" height="40" />
        <span class="header__name">{{ site.name }}</span>
      </RouterLink>

      <nav class="header__nav" aria-label="Principal">
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to" class="header__link">
          {{ link.label }}
        </RouterLink>
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
        <RouterLink v-else to="/login" class="btn btn--primary header__cta">Ingresar</RouterLink>

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

    <Transition name="menu">
      <nav v-if="mobileOpen" class="header__menu" aria-label="Menú móvil">
        <RouterLink
          v-for="(link, index) in site.nav"
          :key="link.to"
          :to="link.to"
          class="header__menu-link"
        >
          <span class="header__menu-number">{{ String(index + 1).padStart(2, '0') }}</span>
          {{ link.label }}
        </RouterLink>
        <RouterLink
          :to="userStore.isAuthenticated ? '/cuenta' : '/login'"
          class="header__menu-link header__menu-link--alt"
        >
          <i class="fa-solid fa-circle-user"></i>
          {{ userStore.isAuthenticated ? 'Mi cuenta' : 'Ingresar' }}
        </RouterLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
  @include transition(background border-color box-shadow);

  &--scrolled,
  &--open {
    background: rgba($paper, 0.92);
    backdrop-filter: blur(12px);
    border-bottom-color: $line;
  }

  &--open {
    background: $paper;
    // Sin blur con el menú abierto: backdrop-filter crea un containing block
    // y rompería el position: fixed del panel móvil.
    backdrop-filter: none;
  }

  &__inner {
    @include container;
    @include flex(row, center, space-between, 1rem);
    padding-block: 0.7rem;
  }

  &__brand {
    @include flex(row, center, flex-start, 0.65rem);
  }

  &__logo {
    width: auto;
    height: 40px;
    @include transition(transform);
  }

  &__brand:hover .header__logo {
    transform: rotate(-5deg) scale(1.06);
  }

  &__name {
    @include display($text-lg, 600);
    color: $ink;
    white-space: nowrap;
  }

  &__nav {
    display: none;

    @include from('md') {
      @include flex(row, center, center, 1.75rem);
    }
  }

  &__link {
    @include eyebrow;
    color: $ink-soft;
    padding: 0.6rem 0;
    border-bottom: 1px solid transparent;
    @include transition;

    &:hover,
    &.router-link-active {
      color: $accent-deep;
      border-color: $accent;
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
    color: $ink;
    @include transition;
    @include focus-ring;

    &:hover {
      background: $sand;
      color: $accent-deep;
    }
  }

  &__badge {
    position: absolute;
    top: 0.2rem;
    right: 0.1rem;
    min-width: 1.05rem;
    height: 1.05rem;
    @include flex(row, center, center);
    background: $accent;
    color: $surface;
    font-size: 0.6rem;
    font-weight: 700;
    border-radius: $radius-pill;
    padding-inline: 0.25rem;
  }

  &__cta {
    display: none;
    padding: 0.55rem 1.2rem;
    font-size: $text-xs;
    margin-left: 0.4rem;

    @include from('md') {
      display: inline-flex;
    }
  }

  &__burger {
    font-size: 1.25rem;
    color: $ink;
    width: 2.5rem;
    height: 2.5rem;
    @include flex(row, center, center);

    @include from('md') {
      display: none;
    }
  }

  &__menu {
    @include flex(column, stretch, flex-start, 0);
    position: fixed;
    inset: 0;
    top: 57px;
    background: $paper;
    padding: 1.6rem 1.25rem;
    z-index: 90;
    overflow-y: auto;

    @include from('md') {
      display: none;
    }
  }

  &__menu-link {
    @include display($display-sm, 500);
    @include flex(row, baseline, flex-start, 0.9rem);
    color: $ink;
    padding-block: 1rem;
    border-bottom: 1px solid $line;
    @include transition(color);

    &:hover,
    &.router-link-active {
      color: $accent-deep;
    }

    &--alt {
      @include flex(row, center, flex-start, 0.9rem);
      font-size: $text-lg;
      color: $ink-soft;
      border-bottom: none;
      margin-top: 0.6rem;
    }
  }

  &__menu-number {
    @include eyebrow;
    color: $ink-muted;
  }
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.3s $ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
