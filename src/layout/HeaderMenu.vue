<script setup lang="ts">
// Panel de navegación en pantallas chicas; TheHeader decide cuándo se abre.
import { site } from '@/config/site'
import { useUserStore } from '@/stores/user'

defineProps<{ open: boolean }>()
const userStore = useUserStore()
</script>

<template>
  <Transition name="menu">
    <nav v-if="open" class="menu" aria-label="Menú móvil">
      <template v-for="link in site.nav" :key="link.to">
        <RouterLink :to="link.to" class="menu-link">{{ link.label }}</RouterLink>
        <RouterLink
          v-for="child in link.children"
          :key="child.label"
          :to="child.to"
          class="menu-link menu-link--child"
        >
          {{ child.label }}
        </RouterLink>
      </template>
      <RouterLink
        :to="userStore.isAuthenticated ? '/cuenta' : '/login'"
        class="menu-link menu-link--alt"
      >
        <i class="fa-solid fa-circle-user"></i>
        {{ userStore.isAuthenticated ? 'Mi cuenta' : 'Ingresar' }}
      </RouterLink>
    </nav>
  </Transition>
</template>

<style scoped lang="scss">
.menu {
  @include flex(column, stretch, flex-start, 0);
  position: fixed;
  inset: 0;
  top: 64px;
  background: $paper;
  padding: 1rem 1.25rem 2rem;
  z-index: 90;
  overflow-y: auto;

  @include from('lg') {
    display: none;
  }
}

.menu-link {
  @include display($text-xl, 500);
  color: $ink;
  padding-block: 0.85rem;
  border-top: 1px solid $line;
  @include transition(color);

  &:first-child {
    border-top: none;
  }

  &:hover,
  &.router-link-exact-active {
    color: $accent-deep;
  }

  &--child {
    font-family: $font-principal;
    font-size: $text-base;
    color: $ink-soft;
    border-top: none;
    padding: 0.3rem 0 0.3rem 1rem;

    &:last-of-type {
      padding-bottom: 0.9rem;
    }
  }

  &--alt {
    @include flex(row, center, flex-start, 0.9rem);
    font-size: $text-lg;
    color: $ink-soft;
    margin-top: 0.6rem;
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
