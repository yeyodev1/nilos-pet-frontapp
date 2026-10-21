<script setup lang="ts">
// La huella del favicon como SVG inline: el motivo flotante de la marca.
// El tamaño se controla con font-size del contenedor y el color con color.
</script>

<template>
  <svg class="paw" viewBox="0 0 64 64" fill="currentColor" aria-hidden="true">
    <ellipse cx="22" cy="24" rx="5" ry="6.5" transform="rotate(-18 22 24)" />
    <ellipse cx="42" cy="24" rx="5" ry="6.5" transform="rotate(18 42 24)" />
    <ellipse cx="13.5" cy="35" rx="4.2" ry="5.5" transform="rotate(-38 13.5 35)" />
    <ellipse cx="50.5" cy="35" rx="4.2" ry="5.5" transform="rotate(38 50.5 35)" />
    <path
      d="M32 32c6.5 0 12 5.2 12 11.2 0 4.4-3.4 7.3-7.1 6.3-2.1-.5-3.4-1-4.9-1s-2.8.5-4.9 1c-3.7 1-7.1-1.9-7.1-6.3C20 37.2 25.5 32 32 32z"
    />
  </svg>
</template>

<style scoped lang="scss">
.paw {
  display: block;
  width: 1em;
  height: 1em;
}
</style>
