<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { site, whatsappLink } from '@/config/site'
import { catalogService } from '@/services/catalog.service'
import type { Branch } from '@/types'

const copy = site.branchesPage
const branches = ref<Branch[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    branches.value = await catalogService.getBranches()
  } finally {
    loading.value = false
  }
})

/** Mapa embebido sin API key: por coordenadas si las hay, si no por dirección. */
function mapSrc(branch: Branch): string {
  const query = branch.coords || `Nilos Pet ${branch.address} ${branch.city}`
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`
}
</script>

<template>
  <div class="branches">
    <header class="branches__head">
      <p class="branches__eyebrow">{{ copy.eyebrow }}</p>
      <h1 class="branches__title">{{ copy.title }}</h1>
      <p>{{ copy.subtitle }}</p>
    </header>

    <p v-if="loading" class="branches__loading"><i class="fa-solid fa-spinner fa-spin"></i></p>

    <div v-else class="branches__list">
      <article v-for="branch in branches" :key="branch._id" class="branches__card">
        <div class="branches__cover">
          <img v-if="branch.image" :src="branch.image" :alt="`Fachada de ${branch.name}`" />
          <i v-else class="fa-solid fa-shop" aria-hidden="true"></i>
          <span class="branches__tag">{{ branch.name }}</span>
        </div>

        <div class="branches__body">
          <h2>Nilos Pet {{ branch.name }}</h2>
          <p><i class="fa-solid fa-location-dot"></i> {{ branch.address }}</p>
          <p v-if="branch.hours"><i class="fa-solid fa-clock"></i> {{ branch.hours }}</p>
          <p v-if="branch.phone"><i class="fa-brands fa-whatsapp"></i> {{ branch.phone }}</p>

          <iframe
            class="branches__map"
            :src="mapSrc(branch)"
            :title="`Mapa de ${branch.name}`"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>

          <div class="branches__actions">
            <a
              class="btn branches__whatsapp"
              :href="
                whatsappLink(`Hola, quiero contactar a Nilos Pet ${branch.name}`, branch.phone)
              "
              target="_blank"
              rel="noopener"
            >
              <i class="fa-brands fa-whatsapp"></i> {{ copy.contact }}
            </a>
            <a
              v-if="branch.mapsUrl"
              class="btn btn--ghost"
              :href="branch.mapsUrl"
              target="_blank"
              rel="noopener"
            >
              <i class="fa-solid fa-diamond-turn-right"></i> {{ copy.directions }}
            </a>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped lang="scss">
.branches {
  @include container;
  padding-block: $space-lg $space-xl;

  &__head {
    text-align: center;
    max-width: 620px;
    margin: 0 auto $space-lg;
    color: $ink-soft;
  }

  &__eyebrow {
    @include eyebrow;
  }

  &__title {
    @include display(clamp(2.4rem, 6vw, 4rem));
    color: $ink;
    margin-block: 0.6rem;
  }

  &__loading {
    text-align: center;
    padding-block: $space-xl;
  }

  &__list {
    @include flex-cards(340px, 1.6rem);
  }

  &__card {
    @include card;
    overflow: hidden;
    box-shadow: $shadow-sm;
  }

  &__cover {
    @include flex(row, center, center);
    position: relative;
    aspect-ratio: 16 / 8;
    background: linear-gradient(135deg, $accent, $accent-deep);
    color: rgba($paper, 0.35);
    font-size: 3.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__tag {
    @include eyebrow;
    position: absolute;
    top: 0.9rem;
    left: 0.9rem;
    font-size: 0.65rem;
    background: $paper;
    padding: 0.35rem 0.8rem;
    border-radius: $radius-pill;
  }

  &__body {
    @include flex(column, stretch, flex-start, 0.6rem);
    padding: 1.4rem;

    h2 {
      @include display($text-xl, 600);
    }

    p {
      @include flex(row, baseline, flex-start, 0.6rem);
      font-size: $text-sm;
      color: $ink-soft;

      i {
        color: $accent;
        width: 1rem;
        flex-shrink: 0;
      }
    }
  }

  &__map {
    width: 100%;
    height: 230px;
    border: 0;
    border-radius: $radius-sm;
    margin-top: 0.4rem;
  }

  &__actions {
    @include flex(row, center, flex-start, 0.6rem);
    flex-wrap: wrap;
    margin-top: 0.4rem;
  }

  &__whatsapp {
    flex: 1;
    background: #1f9d57;
    color: $surface;

    &:hover {
      background: #17804a;
    }
  }
}
</style>
