<script setup lang="ts">
import HomeHero from '@/components/home/HomeHero.vue'
import HomeBanner from '@/components/home/HomeBanner.vue'
import HomeReviews from '@/components/home/HomeReviews.vue'
import HomeMarquee from '@/components/home/HomeMarquee.vue'
import HomeCategories from '@/components/home/HomeCategories.vue'
import HomeSteps from '@/components/home/HomeSteps.vue'
import HomeFeatured from '@/components/home/HomeFeatured.vue'
import HomeServicesTeaser from '@/components/home/HomeServicesTeaser.vue'
import HomeResultsTeaser from '@/components/home/HomeResultsTeaser.vue'
import HomeCta from '@/components/home/HomeCta.vue'
</script>

<template>
  <div class="home">
    <HomeBanner />
    <HomeHero />
    <HomeMarquee />
    <HomeServicesTeaser />
    <HomeCategories />
    <HomeSteps />
    <HomeFeatured />
    <HomeResultsTeaser />
    <HomeReviews />
    <HomeCta />
  </div>
</template>

<style scoped lang="scss">
.home {
  // Las bandas rotadas y los blobs no deben generar scroll horizontal.
  overflow-x: clip;
}
</style>
