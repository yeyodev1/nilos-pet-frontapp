<script setup lang="ts">
// Banner de promociones: lo carga el admin (jpg, png, gif o tiff). Sin banners
// la sección no existe. Con varios, rota solo.
import { onMounted, onUnmounted, ref } from 'vue'
import { catalogService } from '@/services/catalog.service'
import type { Banner } from '@/types'

const banners = ref<Banner[]>([])
const current = ref(0)
let timer: number | undefined

onMounted(async () => {
  banners.value = await catalogService.getBanners().catch(() => [])
  if (banners.value.length > 1) {
    timer = window.setInterval(() => {
      current.value = (current.value + 1) % banners.value.length
    }, 6000)
  }
})

onUnmounted(() => window.clearInterval(timer))
</script>

<template>
  <section v-if="banners.length" class="banner" aria-label="Promociones">
    <Transition name="fade" mode="out-in">
      <component
        :is="banners[current]?.link ? 'a' : 'div'"
        :key="current"
        class="banner__slide"
        :href="banners[current]?.link || undefined"
      >
        <img :src="banners[current]?.image.url" :alt="banners[current]?.title || 'Promoción'" />
      </component>
    </Transition>
    <div v-if="banners.length > 1" class="banner__dots">
      <button
        v-for="(item, index) in banners"
        :key="item._id"
        :class="{ on: index === current }"
        :aria-label="`Ver promoción ${index + 1}`"
        @click="current = index"
      ></button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.banner {
  @include container(1280px);
  padding-top: 1.2rem;

  &__slide {
    display: block;
    border-radius: $radius-md;
    overflow: hidden;
    box-shadow: $shadow-md;
    background: $sand;
  }

  img {
    width: 100%;
    max-height: 420px;
    object-fit: cover;
  }

  &__dots {
    @include flex(row, center, center, 0.4rem);
    margin-top: 0.7rem;

    button {
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 50%;
      background: $line;
      @include transition(background);

      &.on {
        background: $accent;
      }
    }
  }
}
</style>
