<script setup lang="ts">
// Pinta un titular compuesto por partes, con las palabras de acento en
// cursiva (.cursiva vive en global.scss). El copy llega desde site.ts.
defineProps<{ parts: ReadonlyArray<{ text: string; italic?: boolean }> }>()
</script>

<template>
  <template v-for="(part, index) in parts" :key="index">
    <em v-if="part.italic" class="cursiva">{{ part.text }}</em>
    <template v-else>{{ part.text }}</template>
  </template>
</template>
