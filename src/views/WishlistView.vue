<template>
  <div class="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 min-h-screen">
    
    <div class="flex justify-between items-center pb-6 border-b border-dark-border">
      <h1 class="text-3xl md:text-4xl font-black text-white">
        {{ t('wishlist.title') }}
        <span v-if="wishlistStore.count > 0" class="text-brand-500 font-bold text-lg">({{ wishlistStore.count }})</span>
      </h1>
      <button v-if="!wishlistStore.isEmpty" class="text-xs text-gray-400 hover:text-red-400 font-semibold" @click="wishlistStore.clearWishlist()">
        إفراغ المفضلة
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="wishlistStore.isEmpty" class="text-center py-20 bg-dark-card border border-dark-border rounded-3xl p-8 max-w-xl mx-auto">
      <div class="w-20 h-20 rounded-full bg-dark-hover flex items-center justify-center text-gray-600 text-3xl mx-auto mb-4">
        <i class="fa-regular fa-heart"></i>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">{{ t('wishlist.empty') }}</h2>
      <p class="text-gray-400 text-sm mb-6">{{ t('wishlist.empty_sub') }}</p>
      <RouterLink to="/products" class="btn-primary inline-flex">
        {{ t('cart.continue_shopping') }}
      </RouterLink>
    </div>

    <!-- Wishlist Products Grid -->
    <div v-else>
      <ProductGrid :products="wishlistProducts" :loading="isLoading" />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWishlistStore } from '../stores/useWishlistStore.js'
import productService from '../services/productService.js'
import ProductGrid from '../components/products/ProductGrid.vue'

const { t } = useI18n()
const wishlistStore = useWishlistStore()

const wishlistProducts = ref([])
const isLoading = ref(false)

async function loadWishlistProducts() {
  if (wishlistStore.wishlistIds.length === 0) {
    wishlistProducts.value = []
    return
  }
  isLoading.value = true
  try {
    const allProducts = await productService.getProducts()
    wishlistProducts.value = allProducts.filter(p => wishlistStore.wishlistIds.includes(p.id))
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

watch(() => wishlistStore.wishlistIds, () => {
  loadWishlistProducts()
}, { deep: true })

onMounted(() => {
  loadWishlistProducts()
})
</script>
