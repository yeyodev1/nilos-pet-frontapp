<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <header class="page-head">
    <div class="page-head__text">
      <h1 class="page-head__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-head__subtitle">{{ subtitle }}</p>
    </div>
    <div class="page-head__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped lang="scss">
.page-head {
  @include flex(column, stretch, flex-start, 0.9rem);
  margin-bottom: 1.4rem;

  @include from('md') {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  &__title {
    @include display($display-sm, 560);
  }

  &__subtitle {
    font-size: $text-sm;
    color: $ink-soft;
    margin-top: 0.3rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;

    &:empty {
      display: none;
    }
  }
}
</style>
