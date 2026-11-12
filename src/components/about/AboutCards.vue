<script setup lang="ts">
// Banda de tarjetas de "Quiénes somos": principios (oscura) y diferenciales (clara).
defineProps<{
  eyebrow: string
  title: string
  text: string
  items: readonly { icon: string; title: string; text: string; tag?: string }[]
  dark?: boolean
}>()
</script>

<template>
  <section class="cards" :class="{ 'cards--dark': dark }">
    <div class="cards__inner">
      <header class="cards__head" data-reveal>
        <p class="cards__eyebrow">{{ eyebrow }}</p>
        <h2 class="cards__title">{{ title }}</h2>
        <p>{{ text }}</p>
      </header>
      <div class="cards__list">
        <article
          v-for="(item, index) in items"
          :key="item.title"
          class="cards__card"
          data-reveal
          :data-reveal-delay="index * 0.07"
        >
          <span class="cards__icon"><i :class="item.icon"></i></span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <small v-if="item.tag"><i class="fa-solid fa-check"></i> {{ item.tag }}</small>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.cards {
  padding-block: $space-section;
  scroll-margin-top: 70px;

  &__inner {
    @include container;
  }

  &__head {
    text-align: center;
    max-width: 640px;
    margin: 0 auto $space-lg;
    color: $ink-soft;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
    color: $ink;
    margin-block: 0.6rem 0.8rem;
  }

  &__list {
    @include flex-cards(240px, 1.2rem);
  }

  &__card {
    @include card;
    @include flex(column, flex-start, flex-start, 0.6rem);
    padding: 1.6rem 1.4rem;
    @include transition(transform box-shadow);

    &:hover {
      transform: translateY(-5px) rotate(-0.6deg);
      box-shadow: $shadow-md;
    }

    h3 {
      @include display($text-lg, 600);
    }

    p {
      font-size: $text-sm;
      color: $ink-soft;
    }

    small {
      margin-top: auto;
      padding-top: 0.6rem;
      font-size: $text-xs;
      font-weight: 600;
      color: $accent;
    }
  }

  &__icon {
    @include flex(row, center, center);
    width: 2.8rem;
    height: 2.8rem;
    border-radius: $radius-sm;
    background: $blush-soft;
    color: $accent;
    font-size: 1.1rem;
  }

  &--dark {
    background: $accent;

    .cards__head,
    .cards__eyebrow {
      color: $blush;
    }

    .cards__title {
      color: $paper;
    }

    .cards__card {
      background: rgba($paper, 0.07);
      border-color: rgba($paper, 0.16);

      h3 {
        color: $paper;
      }

      p {
        color: rgba($paper, 0.78);
      }
    }

    .cards__icon {
      background: rgba($paper, 0.12);
      color: $blush;
    }
  }
}
</style>
