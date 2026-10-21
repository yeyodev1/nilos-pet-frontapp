<script setup lang="ts">
import { site } from '@/config/site'
import PawPrint from '@/components/ui/PawPrint.vue'
import nilos from '@/assets/logo-nilos.webp'
</script>

<template>
  <!-- Nilos saluda desde un panel vino: la ilustración es transparente y se
       asoma por el borde inferior, como pegada a la ventana. -->
  <div class="scene">
    <span class="scene__arc" aria-hidden="true"></span>
    <div class="scene__panel">
      <img :src="nilos" alt="Nilos, la mascota de Nilos Pet, saludando con la pata" />
      <span class="scene__sticker" aria-hidden="true">
        <strong>{{ site.hero.stickerTop }}</strong>
        <span>{{ site.hero.stickerBottom }}</span>
      </span>
    </div>
    <span class="scene__paw" data-float aria-hidden="true">
      <PawPrint />
    </span>
  </div>
</template>

<style scoped lang="scss">
.scene {
  position: relative;
  z-index: 1;

  &__panel {
    position: relative;
    @include flex(row, flex-end, center);
    background: $accent;
    border-radius: $radius-lg;
    padding: clamp(2rem, 5vw, 3.2rem) clamp(1.2rem, 3.5vw, 2.4rem) 0;
    overflow: hidden;

    img {
      width: 100%;
      max-width: 430px;
      height: auto;
      // El recorte inferior de la ilustración queda al ras del panel.
      margin-bottom: -2px;
      @include transition(transform);
    }

    &:hover {
      img {
        transform: translateY(-4px) rotate(-1deg);
      }

      .scene__sticker {
        transform: rotate(-6deg) scale(1.08);
      }
    }
  }

  &__sticker {
    @include flex(column, center, center);
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 5.6rem;
    height: 5.6rem;
    border-radius: 50%;
    background: $blush;
    color: $accent-deep;
    transform: rotate(8deg);
    text-align: center;
    line-height: 1.15;
    box-shadow: $shadow-sm;
    @include transition(transform);

    strong {
      font-family: $font-display;
      font-size: 1.05rem;
      font-weight: 600;
    }

    span {
      font-size: 0.62rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
    }

    @include from('md') {
      width: 6.4rem;
      height: 6.4rem;
    }
  }

  &__arc {
    position: absolute;
    width: 180px;
    height: 180px;
    right: -50px;
    bottom: -60px;
    border: 3px solid transparent;
    border-top-color: $blush;
    border-left-color: $blush;
    border-radius: 50%;
    transform: rotate(-20deg);
    z-index: 2;
  }

  &__paw {
    position: absolute;
    font-size: 3rem;
    color: $blush;
    left: -1.2rem;
    bottom: -1.4rem;
    transform: rotate(-14deg);
    z-index: 2;
  }
}
</style>
