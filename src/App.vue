<template>
  <div :dir="uiStore.isRTL ? 'rtl' : 'ltr'" :lang="uiStore.currentLocale" class="min-h-screen bg-dark-bg text-white antialiased">
    <!-- Ambient Background -->
    <AmbientBg />

    <!-- Main Layout -->
    <Navbar />

    <main class="relative z-10">
      <RouterView v-slot="{ Component, route }">
        <Transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>

    <Footer />

    <!-- Global Overlays -->
    <CartDrawer />
    <SearchModal />
    <QuickViewModal />
    <ToastContainer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUiStore } from './stores/useUiStore.js'
import AmbientBg from './components/layout/AmbientBg.vue'
import Navbar from './components/layout/Navbar.vue'
import Footer from './components/layout/Footer.vue'
import CartDrawer from './components/cart/CartDrawer.vue'
import SearchModal from './components/search/SearchModal.vue'
import QuickViewModal from './components/products/QuickViewModal.vue'
import ToastContainer from './components/layout/ToastContainer.vue'

const uiStore = useUiStore()

onMounted(() => {
  // Scroll reveal observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  )

  const revealAll = () => {
    document.querySelectorAll('.reveal:not(.active)').forEach((el) => {
      observer.observe(el)
    })
  }

  revealAll()

  // Re-observe after route changes (MutationObserver)
  const mutObs = new MutationObserver(revealAll)
  mutObs.observe(document.querySelector('#app'), { childList: true, subtree: true })
})
</script>
