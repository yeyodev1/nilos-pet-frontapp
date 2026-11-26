<script setup lang="ts">
// Píldoras de filtro por grupo: las comparten Servicios y Exámenes.
defineProps<{ groups: ReadonlyArray<{ slug: string; name: string }>; allLabel: string }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="group-filter" role="group" aria-label="Filtrar">
    <button :class="{ on: model === '' }" @click="model = ''">{{ allLabel }}</button>
    <button
      v-for="item in groups"
      :key="item.slug"
      :class="{ on: model === item.slug }"
      @click="model = item.slug"
    >
      {{ item.name }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.group-filter {
  @include flex(row, center, flex-start, 0.5rem);
  flex-wrap: wrap;
  margin-bottom: $space-md;

  button {
    font-size: $text-sm;
    font-weight: 600;
    padding: 0.5rem 1.1rem;
    border: 1px solid $line;
    border-radius: $radius-pill;
    background: $surface;
    color: $ink-soft;
    @include transition;

    &:hover {
      border-color: $accent;
    }

    &.on {
      background: $accent;
      border-color: $accent;
      color: $surface;
    }
  }
}
</style>
