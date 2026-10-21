<script setup lang="ts">
import type { PillTone } from './adminFormat'

defineProps<{
  label: string
  tone?: PillTone
}>()
</script>

<template>
  <span class="pill" :class="`pill--${tone || 'muted'}`">{{ label }}</span>
</template>

<style scoped lang="scss">
.pill {
  display: inline-flex;
  align-items: center;
  font-size: $text-xs;
  font-weight: 600;
  letter-spacing: 0.03em;
  padding: 0.22rem 0.7rem;
  border-radius: $radius-pill;
  white-space: nowrap;

  &--success {
    background: $success-bg;
    color: darken($success, 18);
  }

  &--warning {
    background: $warning-bg;
    color: darken($warning, 22);
  }

  &--info {
    background: $info-bg;
    color: darken($info, 18);
  }

  &--danger {
    background: $danger-bg;
    color: darken($danger, 12);
  }

  &--muted {
    background: $sand;
    color: $ink-soft;
  }
}
</style>
