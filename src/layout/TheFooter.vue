<script setup lang="ts">
import { computed } from 'vue'
import { site, whatsappLink } from '@/config/site'
import logo from '@/assets/logo.png'

const year = new Date().getFullYear()

// La columna de contacto solo existe si hay algún dato confirmado.
const hasContact = computed(() => Boolean(site.email || site.whatsapp))
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <div class="footer__identity">
          <img class="footer__logo" :src="logo" alt="" width="48" height="48" />
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
  </footer>
</template>

<style scoped lang="scss">
.footer {
  background: $ink;
  color: rgba($paper, 0.85);
  margin-top: auto;

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
    width: 48px;
    height: 48px;
    border-radius: 50%;
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
        color: $accent-soft;
      }
    }
  }

  &__heading {
    @include eyebrow;
    color: $accent-soft;
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
}
</style>
