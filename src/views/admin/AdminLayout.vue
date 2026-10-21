<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import logoNilos from '@/assets/logo-nilos.webp'

// La navegación del admin está atada a las rutas de este layout, no al copy
// del sitio público, por eso vive acá y no en site.ts.
const sections = [
  { label: 'Resumen', to: '/admin', icon: 'fa-solid fa-chart-line', exact: true },
  { label: 'Productos', to: '/admin/productos', icon: 'fa-solid fa-box-open' },
  { label: 'Categorías', to: '/admin/categorias', icon: 'fa-solid fa-tags' },
  { label: 'Sucursales', to: '/admin/sucursales', icon: 'fa-solid fa-location-dot' },
  { label: 'Órdenes', to: '/admin/ordenes', icon: 'fa-solid fa-receipt' },
  { label: 'Reservas', to: '/admin/reservas', icon: 'fa-solid fa-calendar-check' },
  { label: 'Resultados', to: '/admin/resultados', icon: 'fa-solid fa-file-waveform' },
  { label: 'Clientes', to: '/admin/clientes', icon: 'fa-solid fa-users' },
]

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

const menuOpen = ref(false)

watch(
  () => route.path,
  () => {
    menuOpen.value = false
  },
)

function logout() {
  userStore.clear()
  toastStore.info('Sesión cerrada')
  router.push('/')
}
</script>

<template>
  <div class="admin">
    <header class="admin__topbar">
      <button
        class="admin__burger"
        type="button"
        aria-label="Abrir menú"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        <i :class="menuOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'"></i>
      </button>
      <span class="admin__brand">
        <img class="admin__brand-logo" :src="logoNilos" alt="" />
        Nilos Pet <em>admin</em>
      </span>
      <RouterLink class="admin__site-link" to="/" aria-label="Ver el sitio">
        <i class="fa-solid fa-arrow-up-right-from-square"></i>
      </RouterLink>
    </header>

    <Transition name="fade">
      <div v-if="menuOpen" class="admin__scrim" @click="menuOpen = false"></div>
    </Transition>

    <aside class="admin__sidebar" :class="{ 'admin__sidebar--open': menuOpen }">
      <span class="admin__brand admin__brand--side">
        <img class="admin__brand-logo" :src="logoNilos" alt="" />
        Nilos Pet <em>admin</em>
      </span>

      <nav class="admin__nav" aria-label="Secciones del panel">
        <RouterLink
          v-for="section in sections"
          :key="section.to"
          class="admin__link"
          :to="section.to"
          :class="{
            'admin__link--active': section.exact
              ? route.path === section.to
              : route.path.startsWith(section.to),
          }"
        >
          <i :class="section.icon"></i>
          {{ section.label }}
        </RouterLink>
      </nav>

      <div class="admin__side-foot">
        <RouterLink class="admin__link" to="/">
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
          Ver el sitio
        </RouterLink>
        <button class="admin__link admin__link--logout" type="button" @click="logout">
          <i class="fa-solid fa-right-from-bracket"></i>
          Cerrar sesión
        </button>
      </div>
    </aside>

    <main class="admin__main">
      <router-view />
    </main>
  </div>
</template>

<style scoped lang="scss">
.admin {
  @include flex(column, stretch, flex-start);
  min-height: 100dvh;
  background: $paper;

  @include from('lg') {
    flex-direction: row;
  }

  &__topbar {
    @include flex(row, center, space-between, 0.8rem);
    position: sticky;
    top: 0;
    z-index: 110;
    background: $surface;
    border-bottom: 1px solid $line;
    padding: 0.7rem 1rem;

    @include from('lg') {
      display: none;
    }
  }

  &__burger {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    border-radius: $radius-sm;
    color: $ink;
    font-size: 1.05rem;
    @include focus-ring;
  }

  &__brand {
    @include flex(row, center, flex-start, 0.55rem);
    font-family: $font-display;
    font-size: 1.05rem;
    font-weight: 600;
    color: $ink;

    em {
      font-style: normal;
      font-family: $font-principal;
      font-size: $text-xs;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: $accent;
      margin-left: 0.35rem;
    }

    &--side {
      padding: 0.4rem 0.9rem 1.1rem;
    }
  }

  &__brand-logo {
    width: 34px;
    height: auto;
    flex-shrink: 0;
  }

  &__site-link {
    @include flex(row, center, center);
    width: 2.4rem;
    height: 2.4rem;
    color: $ink-soft;
    @include focus-ring;
  }

  &__scrim {
    position: fixed;
    inset: 0;
    background: $overlay;
    z-index: 115;

    @include from('lg') {
      display: none;
    }
  }

  &__sidebar {
    @include flex(column, stretch, flex-start);
    position: fixed;
    inset: 0 auto 0 0;
    width: min(280px, 84vw);
    background: $surface;
    border-right: 1px solid $line;
    padding: 1.1rem 0.8rem;
    z-index: 120;
    transform: translateX(-102%);
    @include transition(transform);
    overflow-y: auto;

    &--open {
      transform: translateX(0);
      box-shadow: $shadow-lg;
    }

    @include from('lg') {
      position: sticky;
      top: 0;
      height: 100dvh;
      flex: none;
      width: 240px;
      transform: none;
      box-shadow: none;
    }
  }

  &__nav {
    @include flex(column, stretch, flex-start, 0.15rem);
    flex: 1;
  }

  &__link {
    @include flex(row, center, flex-start, 0.75rem);
    padding: 0.65rem 0.9rem;
    border-radius: $radius-sm;
    font-size: $text-sm;
    font-weight: 500;
    color: $ink-soft;
    text-align: left;
    width: 100%;
    @include transition(background);
    @include focus-ring;

    i {
      width: 1.25rem;
      text-align: center;
      font-size: 0.85rem;
      color: $ink-muted;
    }

    &:hover {
      background: $sand;
      color: $ink;
    }

    &--active {
      background: $accent;
      color: $surface;
      font-weight: 600;

      i {
        color: rgba($surface, 0.85);
      }

      &:hover {
        background: $accent-deep;
        color: $surface;
      }
    }

    &--logout:hover {
      color: $danger;

      i {
        color: $danger;
      }
    }
  }

  &__side-foot {
    @include flex(column, stretch, flex-start, 0.15rem);
    border-top: 1px solid $line;
    padding-top: 0.7rem;
    margin-top: 0.7rem;
  }

  &__main {
    flex: 1;
    min-width: 0;
    padding: 1.3rem 1.25rem 3.5rem;

    @include from('md') {
      padding: 1.8rem 2rem 4rem;
    }

    @include from('lg') {
      padding: 2.2rem 2.6rem 4rem;
    }
  }
}
</style>
