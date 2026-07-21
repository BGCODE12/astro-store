<template>
  <div class="space-y-24">
    <!-- Hero Section -->
    <section class="relative z-10 pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative w-full">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <!-- Text Content -->
          <div class="order-2 lg:order-1 text-center lg:text-start reveal active">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 font-bold text-xs md:text-sm mb-6 backdrop-blur-sm">
              <i class="fa-solid fa-fire text-brand-500"></i>
              <span>{{ t('hero.badge') }}</span>
            </div>
            <h1 class="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.15] mb-6 drop-shadow-lg">
              {{ t('hero.title_1') }} <br>
              <span class="text-gradient">{{ t('hero.title_2') }}</span>
            </h1>
            <p class="text-gray-400 text-base lg:text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed font-semibold">
              {{ t('hero.desc') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <RouterLink to="/products" class="btn-primary text-base py-4 px-8">
                <span>{{ t('hero.cta_shop') }}</span>
                <i class="fa-solid fa-arrow-left rtl:rotate-0 rotate-180"></i>
              </RouterLink>
              <button class="btn-secondary text-base py-4 px-8" @click="isVideoOpen = true">
                <i class="fa-regular fa-circle-play text-xl"></i>
                <span>{{ t('hero.cta_video') }}</span>
              </button>
            </div>
            
            <!-- Stats -->
            <div class="mt-12 grid grid-cols-3 gap-4 border-t border-dark-border pt-8">
              <div>
                <h3 class="text-2xl md:text-3xl font-black text-white">50K+</h3>
                <p class="text-gray-500 text-xs md:text-sm font-semibold">{{ t('hero.stat_customers') }}</p>
              </div>
              <div>
                <h3 class="text-2xl md:text-3xl font-black text-white">120+</h3>
                <p class="text-gray-500 text-xs md:text-sm font-semibold">{{ t('hero.stat_branches') }}</p>
              </div>
              <div>
                <h3 class="text-2xl md:text-3xl font-black text-white">4.9</h3>
                <p class="text-gray-500 text-xs md:text-sm font-semibold flex items-center gap-1 justify-center lg:justify-start">
                  {{ t('hero.stat_rating') }} <i class="fa-solid fa-star text-yellow-500 text-xs"></i>
                </p>
              </div>
            </div>
          </div>

          <!-- Shoe Display 3D Floating -->
          <div class="order-1 lg:order-2 relative reveal active flex justify-center items-center">
            <!-- Glowing backdrop -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[450px] lg:h-[450px] bg-brand-500/25 rounded-full filter blur-[90px]"></div>
            
            <!-- Main Hero Image -->
            <div class="relative z-10 animate-float w-full max-w-[480px]">
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"
                alt="Astro Phantom X Shoe"
                class="w-full h-auto drop-shadow-[0_25px_35px_rgba(0,0,0,0.85)] rounded-3xl"
              />
            </div>
            
            <!-- Floating Badges -->
            <div class="absolute top-6 right-0 rtl:left-0 rtl:right-auto bg-dark-card/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-xl animate-bounce-subtle z-20">
              <p class="text-xs font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-weight-hanging text-brand-500"></i> {{ t('hero.badge_weight') }}
              </p>
            </div>
            <div class="absolute bottom-12 left-0 rtl:right-0 rtl:left-auto bg-dark-card/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl shadow-xl animate-bounce-subtle z-20" style="animation-delay: 1.5s;">
              <p class="text-xs font-bold text-white flex items-center gap-2">
                <i class="fa-solid fa-wind text-brand-500"></i> {{ t('hero.badge_airflow') }}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- Brand Partners -->
    <section class="border-y border-dark-border bg-dark-card/30 py-8 relative z-10">
      <div class="max-w-7xl mx-auto px-4">
        <p class="text-center text-gray-500 text-xs font-bold mb-6 uppercase tracking-widest">{{ t('brands.title') }}</p>
        <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 hover:opacity-100 transition-opacity duration-500 text-xl md:text-2xl font-black text-gray-400 select-none">
          <div class="hover:text-white transition-colors cursor-pointer"><i class="fa-brands fa-nike"></i> NIKE</div>
          <div class="hover:text-white transition-colors cursor-pointer">ADIDAS</div>
          <div class="hover:text-white transition-colors cursor-pointer flex items-center gap-1"><i class="fa-solid fa-cat text-sm"></i> PUMA</div>
          <div class="hover:text-white transition-colors cursor-pointer">REEBOK</div>
          <div class="hover:text-white transition-colors cursor-pointer italic">UNDER ARMOUR</div>
        </div>
      </div>
    </section>

    <!-- Trending Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="flex justify-between items-end mb-10 reveal">
        <div>
          <h2 class="section-heading">
            {{ t('products.trending') }} <span class="text-brand-500">{{ t('products.trending_accent') }}</span>
          </h2>
          <p class="text-gray-400 text-sm font-semibold mt-1">{{ t('products.trending_sub') }}</p>
        </div>
        <RouterLink to="/products" class="hidden md:flex items-center gap-2 text-brand-500 hover:text-white font-bold transition-colors text-sm">
          <span>{{ t('products.view_all') }}</span>
          <i class="fa-solid fa-arrow-left rtl:rotate-0 rotate-180 text-xs"></i>
        </RouterLink>
      </div>

      <ProductGrid :products="productStore.trending" :loading="productStore.isLoading" :count="4" />

      <div class="mt-10 text-center md:hidden">
        <RouterLink to="/products" class="btn-secondary inline-flex text-sm">
          {{ t('products.view_all_mobile') }}
        </RouterLink>
      </div>
    </section>

    <!-- Special Offer Banner -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 reveal">
      <div class="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 to-brand-500 p-8 md:p-14 text-white shadow-2xl">
        <div class="absolute inset-0 opacity-20 pointer-events-none">
          <div class="absolute top-0 right-0 w-80 h-80 bg-white rounded-full mix-blend-overlay filter blur-3xl translate-x-1/3 -translate-y-1/3"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          <div class="text-center md:text-start">
            <h2 class="text-3xl md:text-5xl font-black mb-4 leading-tight">{{ t('offer.title') }}</h2>
            <p class="text-white/90 text-base md:text-lg mb-8 font-semibold">
              {{ t('offer.desc') }}
              <span class="bg-white text-black font-black px-2 py-0.5 rounded text-xl mx-1">{{ t('offer.discount') }}</span>
              {{ t('offer.desc_2') }}
            </p>
            <RouterLink to="/products?sort=price_asc" class="bg-black hover:bg-gray-900 text-white font-bold py-4 px-8 rounded-xl transition-all inline-flex items-center gap-3 shadow-xl hover:-translate-y-1">
              <span>{{ t('offer.cta') }}</span>
              <i class="fa-solid fa-bolt text-brand-400"></i>
            </RouterLink>
          </div>
          <div class="flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"
              alt="Sale Shoe"
              class="w-full max-w-[360px] transform -rotate-12 hover:rotate-0 transition-transform duration-700 drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Features / Trust Indicators -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Feature 1 -->
        <div class="card-base p-6 text-center hover-lift reveal">
          <div class="w-14 h-14 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 text-2xl mx-auto mb-4">
            <i class="fa-solid fa-truck-fast"></i>
          </div>
          <h4 class="text-lg font-bold mb-1 text-white">{{ t('features.shipping_title') }}</h4>
          <p class="text-gray-400 text-xs font-semibold leading-relaxed">{{ t('features.shipping_desc') }}</p>
        </div>

        <!-- Feature 2 -->
        <div class="card-base p-6 text-center hover-lift reveal" style="transition-delay: 100ms;">
          <div class="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl mx-auto mb-4">
            <i class="fa-solid fa-rotate-left"></i>
          </div>
          <h4 class="text-lg font-bold mb-1 text-white">{{ t('features.returns_title') }}</h4>
          <p class="text-gray-400 text-xs font-semibold leading-relaxed">{{ t('features.returns_desc') }}</p>
        </div>

        <!-- Feature 3 -->
        <div class="card-base p-6 text-center hover-lift reveal" style="transition-delay: 200ms;">
          <div class="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 text-2xl mx-auto mb-4">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h4 class="text-lg font-bold mb-1 text-white">{{ t('features.quality_title') }}</h4>
          <p class="text-gray-400 text-xs font-semibold leading-relaxed">{{ t('features.quality_desc') }}</p>
        </div>

        <!-- Feature 4 -->
        <div class="card-base p-6 text-center hover-lift reveal" style="transition-delay: 300ms;">
          <div class="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-2xl mx-auto mb-4">
            <i class="fa-solid fa-headset"></i>
          </div>
          <h4 class="text-lg font-bold mb-1 text-white">{{ t('features.support_title') }}</h4>
          <p class="text-gray-400 text-xs font-semibold leading-relaxed">{{ t('features.support_desc') }}</p>
        </div>
      </div>
    </section>

    <!-- Promo Video Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="isVideoOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" @click.self="isVideoOpen = false">
          <div class="modal-content w-full max-w-4xl bg-black rounded-3xl overflow-hidden relative aspect-video border border-dark-border">
            <button class="absolute top-4 right-4 z-10 btn-icon bg-black/60" @click="isVideoOpen = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <iframe
              class="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              title="Astro Commercial Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../stores/useProductStore.js'
import ProductGrid from '../components/products/ProductGrid.vue'

const { t } = useI18n()
const productStore = useProductStore()
const isVideoOpen = ref(false)

onMounted(() => {
  productStore.fetchTrending()
})
</script>
