<script setup lang="ts">
import { site } from '@/config/site'
import { useExamResults } from '@/composables/useExamResults'
import { formatDate } from '@/utils/format'

const { documentId, results, status, errorMessage, isValid, showHint, sanitize, search } =
  useExamResults()
</script>

<template>
  <div class="exams">
    <header class="exams__head">
      <p class="exams__eyebrow">Resultados en línea</p>
      <h1 class="exams__title">{{ site.examResults.title }}</h1>
      <p class="exams__subtitle">{{ site.examResults.subtitle }}</p>
    </header>

    <form class="exams__form" @submit.prevent="search">
      <div class="exams__input">
        <i class="fa-solid fa-id-card" aria-hidden="true"></i>
        <input
          v-model="documentId"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          :placeholder="site.examResults.placeholder"
          aria-label="Número de cédula"
          @input="sanitize"
        />
      </div>
      <button class="btn btn--primary" type="submit" :disabled="!isValid || status === 'loading'">
        <i v-if="status === 'loading'" class="fa-solid fa-spinner fa-spin"></i>
        {{ status === 'loading' ? 'Buscando…' : 'Buscar' }}
      </button>
    </form>

    <Transition name="rise">
      <p v-if="showHint" class="exams__hint">La cédula debe tener entre 6 y 13 dígitos.</p>
    </Transition>

    <section class="exams__results" aria-live="polite">
      <div v-if="status === 'idle'" class="exams__state">
        <span class="exams__state-icon"><i class="fa-solid fa-file-waveform"></i></span>
        <p class="exams__state-text">
          Los resultados de los exámenes de tu mascota aparecerán aquí, listos para descargar.
        </p>
      </div>

      <div v-else-if="status === 'error'" class="exams__state">
        <span class="exams__state-icon exams__state-icon--error">
          <i class="fa-solid fa-plug-circle-exclamation"></i>
        </span>
        <p class="exams__state-text">{{ errorMessage }}</p>
        <button class="btn btn--ghost" @click="search">Reintentar</button>
      </div>

      <div v-else-if="status === 'done' && results.length === 0" class="exams__state">
        <span class="exams__state-icon"><i class="fa-solid fa-magnifying-glass"></i></span>
        <p class="exams__state-text">{{ site.examResults.empty }}</p>
      </div>

      <TransitionGroup v-else-if="status === 'done'" name="rise" tag="div" class="exams__list">
        <article v-for="result in results" :key="result._id" class="exam-card">
          <div class="exam-card__body">
            <p class="exam-card__pet"><i class="fa-solid fa-paw"></i> {{ result.petName }}</p>
            <h2 class="exam-card__title">{{ result.title }}</h2>
            <p class="exam-card__date">{{ formatDate(result.date) }}</p>
            <p v-if="result.notes" class="exam-card__notes">{{ result.notes }}</p>
          </div>
          <a
            class="btn btn--dark exam-card__download"
            :href="result.fileUrl"
            target="_blank"
            rel="noopener"
          >
            <i class="fa-solid fa-download"></i> Descargar
          </a>
        </article>
      </TransitionGroup>
    </section>
  </div>
</template>

<style scoped lang="scss">
.exams {
  @include container(760px);
  padding-block: $space-lg $space-section;

  &__head {
    @include flex(column, flex-start, flex-start, 0.8rem);
    margin-bottom: $space-md;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display($display-md);
  }

  &__subtitle {
    color: $ink-soft;
    max-width: 52ch;
  }

  &__form {
    @include flex(column, stretch, flex-start, 0.8rem);
    margin-top: 0.6rem;

    @include from('sm') {
      flex-direction: row;
      align-items: center;
    }
  }

  &__input {
    position: relative;
    flex: 1;

    i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: $ink-muted;
      font-size: 0.85rem;
    }

    input {
      padding-left: 2.6rem;
      border-radius: $radius-pill;
      letter-spacing: 0.06em;
    }
  }

  &__hint {
    font-size: $text-sm;
    color: $warning;
    margin-top: 0.6rem;
  }

  &__results {
    margin-top: $space-lg;
  }

  &__state {
    @include flex(column, center, center, 0.9rem);
    text-align: center;
    background: $sand;
    border-radius: $radius-lg;
    padding: $space-xl 1.5rem;

    &-icon {
      @include flex(row, center, center);
      width: 3.6rem;
      height: 3.6rem;
      border-radius: 50%;
      background: $surface;
      color: $accent;
      font-size: 1.3rem;

      &--error {
        color: $danger;
      }
    }

    &-text {
      color: $ink-soft;
      max-width: 44ch;
    }
  }

  &__list {
    @include flex(column, stretch, flex-start, 1rem);
  }
}

.exam-card {
  @include card;
  @include flex(column, stretch, flex-start, 1rem);
  padding: 1.4rem 1.5rem;

  @include from('sm') {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  &__body {
    @include flex(column, flex-start, flex-start, 0.25rem);
  }

  &__pet {
    @include eyebrow;
    @include flex(row, center, flex-start, 0.4rem);
    font-size: 0.62rem;
    color: $ink-muted;
  }

  &__title {
    @include display($text-xl, 600);
  }

  &__date {
    font-size: $text-sm;
    color: $ink-soft;
  }

  &__notes {
    font-size: $text-sm;
    color: $ink-muted;
    max-width: 46ch;
    margin-top: 0.3rem;
  }

  &__download {
    flex-shrink: 0;
  }
}
</style>
