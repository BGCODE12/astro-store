<template>
  <nav
    class="fixed w-full z-50 transition-all duration-300"
    :class="isScrolled ? 'glass shadow-xl' : 'bg-transparent'"
    id="navbar"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">

        <!-- Logo -->
        <RouterLink to="/" class="flex-shrink-0 flex items-center gap-2.5 cursor-pointer group" @click="uiStore.closeMobileMenu()">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30 transition-transform duration-300 group-hover:scale-110">
            <i class="fa-solid fa-bolt text-white text-lg"></i>
          </div>
          <span class="font-black text-2xl tracking-wider uppercase text-white">
            {{ t('common.brand_name') }}<span class="text-brand-500">.</span>
          </span>
        </RouterLink>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center gap-7">
          <RouterLink
            v-for="link in navLinks"
            :key="link.name"
            :to="link.path"
            class="font-semibold transition-colors duration-200 text-sm"
            :class="$route.path === link.path
              ? 'text-brand-500 font-bold'
              : 'text-gray-400 hover:text-white'"
          >
            {{ t(link.label) }}
            <span v-if="link.badge" class="ml-1 rtl:mr-1 rtl:ml-0 text-brand-500">
              <i class="fa-solid fa-tag text-xs"></i>
            </span>
          </RouterLink>
        </div>

        <!-- Right Actions -->
        <div class="hidden md:flex items-center gap-2">
          <!-- Language Switcher -->
          <button
            class="btn-icon text-xs font-black tracking-widest"
            @click="uiStore.toggleLocale()"
            :title="t('common.lang_switch')"
          >
            <span class="text-[11px] font-black">{{ uiStore.currentLocale === 'ar' ? 'EN' : 'ع' }}</span>
          </button>

          <!-- Search -->
          <button class="btn-icon" @click="uiStore.openSearch()" :title="t('nav.search')">
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>

          <!-- Wishlist -->
          <RouterLink to="/wishlist" class="btn-icon relative" :title="t('nav.wishlist')">
            <i class="fa-regular fa-heart"></i>
            <span
              v-if="wishlistStore.count > 0"
              class="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center"
            >{{ wishlistStore.count }}</span>
          </RouterLink>

          <!-- Cart -->
          <button
            class="btn-icon relative"
            @click="cartStore.toggleCart()"
            :title="t('nav.cart')"
          >
            <i class="fa-solid fa-bag-shopping"></i>
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto bg-brand-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-pulse-brand"
            >{{ cartStore.itemCount }}</span>
          </button>
        </div>

        <!-- Mobile Right Actions -->
        <div class="md:hidden flex items-center gap-2">
          <!-- Wishlist Mobile -->
          <RouterLink to="/wishlist" class="btn-icon relative">
            <i class="fa-regular fa-heart text-sm"></i>
            <span v-if="wishlistStore.count > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{{ wishlistStore.count }}</span>
          </RouterLink>

          <!-- Cart Button Mobile -->
          <button class="btn-icon relative" @click="cartStore.toggleCart()">
            <i class="fa-solid fa-bag-shopping text-sm"></i>
            <span v-if="cartStore.itemCount > 0" class="absolute -top-1 -right-1 bg-brand-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">{{ cartStore.itemCount }}</span>
          </button>

          <!-- Hamburger -->
          <button
            class="btn-icon"
            @click="uiStore.toggleMobileMenu()"
            :aria-label="uiStore.isMobileMenuOpen ? 'Close menu' : 'Open menu'"
          >
            <Transition name="icon-fade" mode="out-in">
              <i v-if="uiStore.isMobileMenuOpen" key="close" class="fa-solid fa-xmark"></i>
              <i v-else key="open" class="fa-solid fa-bars"></i>
            </Transition>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Dropdown Menu -->
    <Transition name="slide-mobile">
      <div
        v-if="uiStore.isMobileMenuOpen"
        class="md:hidden absolute top-20 left-0 right-0 w-full bg-dark-card/95 backdrop-blur-xl border-b border-dark-border shadow-2xl z-50"
      >
        <div class="max-w-7xl mx-auto px-4 py-4 space-y-2">
          <button
            v-for="link in navLinks"
            :key="link.name"
            class="w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-colors text-start cursor-pointer active:scale-98"
            :class="$route.path === link.path
              ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20 font-bold'
              : 'text-gray-300 hover:bg-dark-hover hover:text-white'"
            @click="navigateMobile(link.path)"
          >
            <span>{{ t(link.label) }}</span>
            <i v-if="$route.path === link.path" class="fa-solid fa-chevron-left rtl:fa-chevron-right text-brand-500 text-xs"></i>
          </button>

          <!-- Mobile bottom actions row -->
          <div class="flex items-center gap-3 pt-3 border-t border-dark-border mt-3">
            <button class="flex-1 btn-ghost text-sm gap-2" @click="uiStore.openSearch(); uiStore.closeMobileMenu()">
              <i class="fa-solid fa-magnifying-glass"></i>
              <span>{{ t('nav.search') }}</span>
            </button>
            <button class="flex-1 btn-ghost text-sm gap-2" @click="uiStore.toggleLocale()">
              <i class="fa-solid fa-globe"></i>
              <span>{{ t('common.lang_switch') }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '../../stores/useUiStore.js'
import { useCartStore } from '../../stores/useCartStore.js'
import { useWishlistStore } from '../../stores/useWishlistStore.js'

const { t } = useI18n()
const router = useRouter()
const uiStore = useUiStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()

const isScrolled = ref(false)

const navLinks = [
  { name: 'home', path: '/', label: 'nav.home' },
  { name: 'products', path: '/products', label: 'nav.products' },
  { name: 'wishlist', path: '/wishlist', label: 'nav.wishlist' },
  { name: 'deals', path: '/products?sort=price_asc', label: 'nav.deals', badge: true },
]

function navigateMobile(path) {
  uiStore.closeMobileMenu()
  router.push(path)
}

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.slide-mobile-enter-active,
.slide-mobile-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-mobile-enter-from,
.slide-mobile-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.15s ease;
}
.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
  transform: scale(0.7) rotate(10deg);
}
</style>
