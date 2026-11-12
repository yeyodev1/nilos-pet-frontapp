<script setup lang="ts">
import { ref } from 'vue'
import { about } from '@/config/about'
import { whatsappLink } from '@/config/site'
import { useGsapReveal } from '@/composables/useGsapReveal'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import PawPrint from '@/components/ui/PawPrint.vue'
import AboutCards from '@/components/about/AboutCards.vue'
import photo from '@/assets/spa-canino.jpg'

const root = ref<HTMLElement | null>(null)
useGsapReveal(root)

const tab = ref(0)
</script>

<template>
  <div ref="root" class="about">
    <section class="about__hero">
      <div class="about__hero-copy">
        <p class="about__eyebrow">{{ about.hero.eyebrow }}</p>
        <h1 class="about__title"><DisplayParts :parts="about.hero.titleParts" /></h1>
        <p class="about__lead">{{ about.hero.text }}</p>
        <dl class="about__stats">
          <div v-for="stat in about.hero.stats" :key="stat.label">
            <dt>{{ stat.value }}</dt>
            <dd>{{ stat.label }}</dd>
          </div>
        </dl>
      </div>
      <figure class="about__photo">
        <img :src="photo" alt="Un golden retriever feliz durante su baño en Nilos Pet" />
        <figcaption>
          <i class="fa-solid fa-hand-holding-heart"></i>
          <span>
            <strong>{{ about.hero.badge.title }}</strong>
            {{ about.hero.badge.text }}
          </span>
        </figcaption>
        <span class="about__paw" aria-hidden="true"><PawPrint /></span>
      </figure>
    </section>

    <section id="historia" class="about__history" data-reveal>
      <p class="about__eyebrow">{{ about.history.eyebrow }}</p>
      <h2 class="about__heading">{{ about.history.title }}</h2>
      <p v-for="paragraph in about.history.paragraphs" :key="paragraph">{{ paragraph }}</p>
      <blockquote>{{ about.history.quote }}</blockquote>
    </section>

    <section id="mision" class="about__purpose" data-reveal>
      <p class="about__eyebrow">{{ about.purpose.eyebrow }}</p>
      <h2 class="about__heading">{{ about.purpose.title }}</h2>
      <div class="about__tabs" role="tablist">
        <button
          v-for="(item, index) in about.purpose.tabs"
          :key="item.label"
          role="tab"
          :aria-selected="tab === index"
          :class="{ on: tab === index }"
          @click="tab = index"
        >
          {{ item.label }}
        </button>
      </div>
      <Transition name="fade" mode="out-in">
        <div :key="tab" class="about__purpose-card" role="tabpanel">
          <p class="about__eyebrow">{{ about.purpose.tabs[tab]?.lead }}</p>
          <p>{{ about.purpose.tabs[tab]?.text }}</p>
        </div>
      </Transition>
    </section>

    <AboutCards id="principios" dark v-bind="about.principles" />
    <AboutCards id="diferenciales" v-bind="about.differentials" />

    <section class="about__cta" data-reveal>
      <h2 class="about__heading">{{ about.cta.title }}</h2>
      <p>{{ about.cta.text }}</p>
      <div class="about__cta-actions">
        <a
          class="btn btn--primary"
          :href="whatsappLink('Hola, quiero agendar una consulta')"
          target="_blank"
          rel="noopener"
        >
          <i class="fa-brands fa-whatsapp"></i> Escribir por WhatsApp
        </a>
        <RouterLink class="btn btn--ghost" to="/sucursales">Ver sucursales</RouterLink>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.about {
  overflow-x: clip;

  &__eyebrow {
    @include eyebrow;
  }

  &__heading {
    @include display($display-md);
    margin-block: 0.6rem 1.2rem;
  }

  &__hero {
    @include container;
    @include flex(column, stretch, flex-start, $space-lg);
    padding-block: $space-xl;

    @include from('lg') {
      flex-direction: row;
      align-items: center;

      > * {
        flex: 1;
      }
    }
  }

  &__title {
    @include display($display-lg);
    margin-block: 0.8rem 1.2rem;
  }

  &__lead {
    color: $ink-soft;
    max-width: 54ch;
  }

  &__stats {
    @include flex(row, flex-start, flex-start, 2rem);
    flex-wrap: wrap;
    margin-top: $space-md;
    padding-top: $space-md;
    border-top: 1px solid $line;

    dt {
      @include display($display-sm, 600);
      color: $accent;
    }

    dd {
      font-size: $text-xs;
      color: $ink-soft;
    }
  }

  &__photo {
    position: relative;
    max-width: 480px;
    margin-inline: auto;
    transform: rotate(2deg);

    img {
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      border-radius: $radius-lg;
      border: 8px solid $surface;
      box-shadow: $shadow-lg;
    }

    figcaption {
      @include card;
      @include flex(row, center, flex-start, 0.8rem);
      position: absolute;
      left: -0.8rem;
      right: 2rem;
      bottom: 1.4rem;
      padding: 0.8rem 1rem;
      font-size: $text-xs;
      color: $ink-soft;
      box-shadow: $shadow-md;
      transform: rotate(-3deg);

      i {
        font-size: 1.4rem;
        color: $accent;
      }

      strong {
        display: block;
        font-size: $text-sm;
        color: $ink;
      }
    }
  }

  &__paw {
    position: absolute;
    top: -2.2rem;
    right: -1.6rem;
    font-size: 6rem;
    color: $blush;
    animation: flotar 6s ease-in-out infinite;
  }

  &__history,
  &__purpose,
  &__cta {
    @include container(820px);
    padding-block: $space-xl;

    > p {
      color: $ink-soft;
      margin-bottom: 1rem;
    }
  }

  &__history blockquote {
    @include display($text-xl, 400);
    font-style: italic;
    color: $accent;
    border-left: 3px solid $blush;
    padding-left: 1.2rem;
    margin-top: $space-md;
  }

  &__tabs {
    @include flex(row, center, flex-start, 0.5rem);
    flex-wrap: wrap;
    margin-bottom: 1rem;

    button {
      font-size: $text-sm;
      font-weight: 600;
      padding: 0.55rem 1.2rem;
      border: 1px solid $line;
      border-radius: $radius-pill;
      @include transition;

      &.on {
        background: $accent;
        border-color: $accent;
        color: $surface;
      }
    }
  }

  &__purpose-card {
    background: $sand;
    border-radius: $radius-md;
    padding: 1.6rem 1.8rem;

    p:last-child {
      @include display($text-lg, 400);
      line-height: 1.5;
      margin-top: 0.6rem;
    }
  }

  &__cta {
    text-align: center;

    &-actions {
      @include flex(row, center, center, 0.7rem);
      flex-wrap: wrap;
      margin-top: $space-md;
    }
  }
}
</style>
