<script setup lang="ts">
import { site } from '@/config/site'
import logo from '@/assets/logo.png'
</script>

<template>
  <section class="home-cta">
    <div class="home-cta__inner">
      <img class="home-cta__logo" :src="logo" :alt="site.name" width="72" height="72" />
      <h2 class="home-cta__title">{{ site.tagline }}</h2>
      <div class="home-cta__actions">
        <RouterLink to="/tienda" class="btn btn--primary">{{ site.hero.ctaPrimary }}</RouterLink>
        <RouterLink to="/servicios" class="btn btn--ghost">Ver servicios</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-cta {
  &__inner {
    @include container(760px);
    @include flex(column, center, center, 1.4rem);
    text-align: center;
    padding-block: $space-section;
  }

  &__logo {
    width: 72px;
    height: 72px;
    border-radius: $radius-md;
    box-shadow: $shadow-sm;
  }

  &__title {
    @include display($display-md);
    max-width: 18ch;
  }

  &__actions {
    @include flex(row, center, center, 0.8rem);
    flex-wrap: wrap;
  }
}
</style>
