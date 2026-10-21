<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { site, whatsappLink } from '@/config/site'
import nilos from '@/assets/logo-nilos.webp'

const year = new Date().getFullYear()

// La columna de contacto solo existe si hay algún dato confirmado.
const hasContact = computed(() => Boolean(site.email || site.whatsapp))

// El wordmark entra en outline y se rellena al llegar al viewport.
const wordmark = ref<HTMLElement | null>(null)
const filled = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!wordmark.value || !('IntersectionObserver' in window)) {
    filled.value = true
    return
  }
  observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        filled.value = true
        observer?.disconnect()
      }
    },
    { threshold: 0.4 },
  )
  observer.observe(wordmark.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__identity">
          <img class="footer__logo" :src="nilos" alt="" width="52" height="45" />
          <span class="footer__name">{{ site.name }}</span>
        </div>
        <p class="footer__tagline">{{ site.tagline }}</p>
      </div>

      <div class="footer__col">
        <h4 class="footer__heading">Navegación</h4>
        <RouterLink v-for="link in site.nav" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
      </div>

      <div v-if="hasContact" class="footer__col">
        <h4 class="footer__heading">Contacto</h4>
        <a v-if="site.email" :href="`mailto:${site.email}`">
          <i class="fa-solid fa-envelope"></i> {{ site.email }}
        </a>
        <a v-if="site.whatsapp" :href="whatsappLink()" target="_blank" rel="noopener">
          <i class="fa-brands fa-whatsapp"></i> WhatsApp
        </a>
      </div>
    </div>

    <div class="footer__bar">
      <span>© {{ year }} — {{ site.footerNote }}</span>
      <span class="footer__credit">
        Hecho por <a href="https://bakano.ec" target="_blank" rel="noopener">Bakano</a>
      </span>
    </div>

    <p
      ref="wordmark"
      class="footer__wordmark"
      :class="{ 'footer__wordmark--filled': filled }"
      aria-hidden="true"
    >
      {{ site.wordmark }}
    </p>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $ink;
  color: rgba($paper, 0.85);
  margin-top: auto;
  overflow: hidden;

  &__inner {
    @include container;
    @include flex-cards(220px, 2.5rem);
    padding-block: $space-xl 2rem;
  }

  &__brand {
    flex: 2 1 260px;
  }

  &__identity {
    @include flex(row, center, flex-start, 0.8rem);
    margin-bottom: 0.8rem;
  }

  &__logo {
    width: 52px;
    height: auto;
  }

  &__name {
    @include display($text-xl, 600);
    color: $paper;
  }

  &__tagline {
    font-size: $text-sm;
    color: rgba($paper, 0.65);
    max-width: 34ch;
  }

  &__col {
    @include flex(column, flex-start, flex-start, 0.55rem);
    font-size: $text-sm;

    a {
      @include flex(row, center, flex-start, 0.5rem);
      color: rgba($paper, 0.75);
      @include transition(color);

      &:hover {
        color: $blush;
      }
    }
  }

  &__heading {
    @include eyebrow;
    color: $blush;
    margin-bottom: 0.4rem;
  }

  &__bar {
    @include container;
    @include flex(row, center, space-between, 1rem);
    flex-wrap: wrap;
    padding-block: 1.2rem;
    border-top: 1px solid rgba($paper, 0.1);
    font-size: $text-xs;
    color: rgba($paper, 0.55);
  }

  &__credit a {
    color: rgba($paper, 0.8);
  }

  // El cierre de cada página: la marca a todo lo ancho, de contorno a relleno.
  &__wordmark {
    font-family: $font-display;
    font-size: clamp(3.2rem, 14.5vw, 12.5rem);
    font-weight: 600;
    line-height: 0.9;
    letter-spacing: -0.02em;
    text-align: center;
    white-space: nowrap;
    user-select: none;
    color: transparent;
    -webkit-text-stroke: 1.5px rgba($blush, 0.55);
    transition: color 1.1s $ease;
    padding-top: 1.5rem;
    margin-bottom: -0.08em;

    &--filled,
    &:hover {
      color: $blush;
    }

    @include reduced-motion {
      transition: none;
      color: $blush;
    }
  }
}
</style>
