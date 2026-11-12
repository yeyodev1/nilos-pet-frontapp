<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { site } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import DisplayParts from '@/components/ui/DisplayParts.vue'
import type { ApiError, Review } from '@/types'

const copy = site.reviews
const userStore = useUserStore()
const toast = useToastStore()

const reviews = ref<Review[]>([])
const rating = ref(5)
const text = ref('')
const sending = ref(false)

async function load() {
  reviews.value = await catalogService.getReviews().catch(() => [])
}

onMounted(() => {
  load()
  // Con token guardado, la sesión se restaura para mostrar el formulario.
  if (userStore.hasToken) userStore.restore()
})

async function submit() {
  sending.value = true
  try {
    await catalogService.sendReview({ rating: rating.value, text: text.value.trim() })
    text.value = ''
    toast.success('¡Gracias! Tu reseña ya está publicada.')
    await load()
  } catch (e) {
    toast.error((e as ApiError).message)
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <section class="reviews">
    <header class="reviews__head">
      <p class="reviews__eyebrow">{{ copy.eyebrow }}</p>
      <h2 class="reviews__title"><DisplayParts :parts="copy.titleParts" /></h2>
    </header>

    <div v-if="reviews.length" class="reviews__list">
      <figure v-for="review in reviews" :key="review._id" class="reviews__card">
        <span class="reviews__stars" :aria-label="`${review.rating} de 5 estrellas`">
          <i
            v-for="n in 5"
            :key="n"
            :class="n <= review.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"
          ></i>
        </span>
        <blockquote>{{ review.text }}</blockquote>
        <figcaption>{{ review.name }}</figcaption>
      </figure>
    </div>
    <p v-else class="reviews__empty">{{ copy.empty }}</p>

    <form v-if="userStore.isAuthenticated" class="reviews__form" @submit.prevent="submit">
      <h3>{{ copy.formTitle }}</h3>
      <div class="reviews__pick" role="radiogroup" aria-label="Calificación">
        <button
          v-for="n in 5"
          :key="n"
          type="button"
          role="radio"
          :aria-checked="rating === n"
          :aria-label="`${n} estrellas`"
          @click="rating = n"
        >
          <i :class="n <= rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
        </button>
      </div>
      <textarea
        v-model="text"
        rows="3"
        required
        minlength="10"
        maxlength="600"
        :placeholder="copy.placeholder"
        aria-label="Tu reseña"
      ></textarea>
      <button class="btn btn--primary" type="submit" :disabled="sending">Publicar reseña</button>
    </form>
    <RouterLink v-else class="btn btn--ghost reviews__login" to="/login?next=/">
      <i class="fa-solid fa-pen"></i> {{ copy.loginCta }}
    </RouterLink>
  </section>
</template>

<style scoped lang="scss">
.reviews {
  @include container;
  @include flex(column, center, flex-start, $space-md);
  padding-block: $space-section;

  &__head {
    text-align: center;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
    margin-top: 0.6rem;
  }

  &__list {
    @include flex-cards(260px, 1.2rem);
    width: 100%;
  }

  &__card {
    @include card;
    @include flex(column, flex-start, flex-start, 0.7rem);
    padding: 1.5rem 1.4rem;
    max-width: 420px;

    &:nth-child(odd) {
      background: $sand;
      transform: rotate(-0.8deg);
    }

    &:nth-child(even) {
      background: $blush-soft;
      transform: rotate(0.8deg);
    }

    blockquote {
      @include display($text-lg, 400);
      font-style: italic;
      line-height: 1.4;
    }

    figcaption {
      margin-top: auto;
      font-size: $text-sm;
      font-weight: 600;
      color: $accent-deep;
    }
  }

  &__stars,
  &__pick {
    @include flex(row, center, flex-start, 0.2rem);
    color: $warning;
  }

  &__pick button {
    font-size: 1.5rem;
    color: $warning;
  }

  &__empty {
    color: $ink-soft;
  }

  &__form {
    @include card;
    @include flex(column, stretch, flex-start, 0.8rem);
    width: 100%;
    max-width: 560px;
    padding: 1.5rem;

    h3 {
      @include display($text-xl, 600);
    }
  }
}
</style>
