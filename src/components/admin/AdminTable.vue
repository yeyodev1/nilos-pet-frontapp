<script setup lang="ts">
// Cascarón de toda lista del admin: tarjeta, estados de carga/vacío/error y el
// patrón de fila flexbox (fila en desktop, columna apilada en móvil). Las vistas
// ponen sus filas en el slot con las clases .atable__row / .atable__main /
// .atable__cell y, si una celda necesita rótulo en móvil, .atable__label.
defineProps<{
  loading: boolean
  error?: string
  count: number
  emptyText: string
  emptyIcon?: string
}>()
</script>

<template>
  <section class="atable">
    <div v-if="loading" class="atable__state">
      <i class="fa-solid fa-spinner fa-spin"></i>
      <span>Cargando…</span>
    </div>

    <div v-else-if="error" class="atable__state atable__state--error">
      <i class="fa-solid fa-circle-exclamation"></i>
      <span>{{ error }}</span>
    </div>

    <div v-else-if="count === 0" class="atable__state">
      <i :class="emptyIcon || 'fa-solid fa-inbox'"></i>
      <span>{{ emptyText }}</span>
      <slot name="empty-action" />
    </div>

    <template v-else>
      <slot />
    </template>
  </section>
</template>

<style scoped lang="scss">
.atable {
  @include card;
  overflow: hidden;

  &__state {
    @include flex(column, center, center, 0.6rem);
    padding: 3rem 1.5rem;
    color: $ink-muted;
    font-size: $text-sm;
    text-align: center;

    i {
      font-size: 1.5rem;
      color: $ink-muted;
    }

    &--error {
      color: $danger;

      i {
        color: $danger;
      }
    }
  }

  // Las filas las pintan las vistas: el patrón vive acá para no repetirlo.
  :deep(.atable__row) {
    @include flex(column, stretch, flex-start, 0.65rem);
    padding: 0.95rem 1.1rem;
    @include transition(background);

    & + .atable__row {
      border-top: 1px solid $line;
    }

    &:hover {
      background: rgba($sand, 0.45);
    }

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 1.1rem;
    }
  }

  :deep(.atable__row--alert) {
    box-shadow: inset 3px 0 0 $warning;
  }

  // La celda principal (nombre + datos secundarios) empuja al resto.
  :deep(.atable__main) {
    flex: 1 1 auto;
    min-width: 0;
  }

  :deep(.atable__cell) {
    @include flex(row, center, flex-start, 0.55rem);
    flex-wrap: wrap;
    min-width: 0;
  }

  // Rótulo que solo aparece en móvil, cuando la fila se apila.
  :deep(.atable__label) {
    font-size: $text-xs;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: $ink-muted;

    @include from('md') {
      display: none;
    }
  }

  :deep(.atable__title) {
    font-family: $font-principal;
    font-size: $text-sm;
    font-weight: 600;
    color: $ink;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :deep(.atable__meta) {
    font-size: $text-xs;
    color: $ink-muted;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // Botón de acción chico (editar, borrar, ver) usado en todas las filas.
  :deep(.atable__action) {
    @include flex(row, center, center, 0.4rem);
    height: 2.15rem;
    min-width: 2.15rem;
    padding-inline: 0.6rem;
    border: 1px solid $line;
    border-radius: $radius-sm;
    background: $surface;
    color: $ink-soft;
    font-size: 0.8rem;
    @include transition(border-color);
    @include focus-ring;

    &:hover {
      border-color: $accent;
      color: $accent;
    }

    &--danger:hover {
      border-color: $danger;
      color: $danger;
    }
  }
}
</style>
