<template>
  <div class="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 min-h-screen">
    
    <!-- Loading State -->
    <div v-if="productStore.isLoadingProduct" class="flex justify-center py-32">
      <i class="fa-solid fa-spinner animate-spin text-brand-500 text-4xl"></i>
    </div>

    <!-- Error / Not Found -->
    <div v-else-if="productStore.error" class="text-center py-24 bg-dark-card rounded-3xl border border-dark-border">
      <h2 class="text-2xl font-bold text-white mb-2">{{ t('common.error') }}</h2>
      <p class="text-gray-400 mb-6">{{ productStore.error }}</p>
      <RouterLink to="/products" class="btn-primary inline-flex">{{ t('common.back') }}</RouterLink>
    </div>

    <!-- Main Product Detail -->
    <div v-else-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
      
      <!-- Gallery / Image Selector -->
      <div class="space-y-4">
        <div class="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-8 flex items-center justify-center border border-dark-border relative min-h-[420px] overflow-hidden group">
          <img
            :src="activeImage || product.image"
            :alt="uiStore.isRTL ? product.name_ar : product.name_en"
            class="w-full max-w-[420px] h-auto object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
          />
          <button
            class="absolute top-4 right-4 btn-icon bg-black/60"
            @click="toggleWishlist"
            :title="t('products.add_to_wishlist')"
          >
            <i :class="isWishlisted ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'"></i>
          </button>
        </div>

        <!-- Thumbnail list -->
        <div v-if="product.images && product.images.length > 1" class="flex gap-3 overflow-x-auto pb-2">
          <button
            v-for="(img, idx) in product.images"
            :key="idx"
            class="w-20 h-20 rounded-xl border-2 overflow-hidden bg-black/40 flex-shrink-0 transition-all"
            :class="activeImage === img ? 'border-brand-500 scale-105 shadow-lg shadow-brand-500/20' : 'border-white/10 opacity-70 hover:opacity-100'"
            @click="activeImage = img"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <!-- Info & Specifications -->
      <div class="space-y-6">
        <div>
          <span class="text-xs font-bold text-brand-500 uppercase tracking-widest">{{ product.brand }}</span>
          <h1 class="text-3xl md:text-4xl font-black text-white mt-1">
            {{ uiStore.isRTL ? product.name_ar : product.name_en }}
          </h1>
          
          <div class="flex items-center gap-3 mt-3">
            <div class="stars">
              <i v-for="n in 5" :key="n" class="fa-solid fa-star text-sm" :class="n <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'"></i>
            </div>
            <span class="text-sm font-bold text-gray-300">{{ product.rating }}</span>
            <span class="text-gray-500 text-xs font-semibold">({{ product.reviewCount }} {{ t('products.reviews') }})</span>
          </div>
        </div>

        <!-- Price -->
        <div class="flex items-baseline gap-4 py-2 border-y border-dark-border">
          <span class="text-4xl font-black text-white">${{ product.price.toFixed(2) }}</span>
          <span v-if="product.originalPrice" class="text-lg text-gray-500 line-through">${{ product.originalPrice.toFixed(2) }}</span>
          <span v-if="product.stock > 0" class="text-xs font-bold px-2.5 py-1 bg-green-500/20 text-green-400 rounded-full rtl:mr-auto ltr:ml-auto">
            <i class="fa-solid fa-circle text-[8px] mr-1"></i> {{ t('products.in_stock') }}
          </span>
        </div>

        <!-- Description -->
        <p class="text-gray-400 font-semibold leading-relaxed text-sm md:text-base">
          {{ uiStore.isRTL ? product.description_ar : product.description_en }}
        </p>

        <!-- Features list -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-gray-300 uppercase tracking-wider">المميزات الرئيسية</h4>
          <div class="grid grid-cols-2 gap-2">
            <div
              v-for="(feat, idx) in (uiStore.isRTL ? product.features_ar : product.features_en)"
              :key="idx"
              class="flex items-center gap-2 text-xs font-semibold text-gray-300 bg-dark-card border border-dark-border p-2.5 rounded-xl"
            >
              <i class="fa-solid fa-check text-brand-500 text-xs"></i>
              <span>{{ feat }}</span>
            </div>
          </div>
        </div>

        <!-- Size Selector -->
        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs font-bold">
            <span class="text-gray-300 uppercase tracking-wider">{{ t('products.select_size') }}</span>
            <button class="text-brand-500 hover:underline">دليل المقاسات</button>
          </div>
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="s in product.sizes"
              :key="s"
              class="w-12 h-12 rounded-xl text-sm font-bold border transition-all"
              :class="selectedSize === s
                ? 'bg-brand-500 text-white border-brand-500 shadow-lg shadow-brand-500/30 scale-105'
                : 'bg-dark-card border-dark-border text-gray-300 hover:border-gray-500'"
              @click="selectedSize = s"
            >
              {{ s }}
            </button>
          </div>
        </div>

        <!-- Quantity & Add to Cart -->
        <div class="flex flex-col sm:flex-row gap-4 pt-4">
          <div class="flex items-center border border-dark-border rounded-xl bg-dark-card w-full sm:w-36 justify-between px-2 h-14">
            <button class="w-10 h-full text-lg flex items-center justify-center text-gray-400 hover:text-white" @click="qty = Math.max(1, qty - 1)">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="font-bold text-white text-base">{{ qty }}</span>
            <button class="w-10 h-full text-lg flex items-center justify-center text-gray-400 hover:text-white" @click="qty = Math.min(10, qty + 1)">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

          <button class="btn-primary flex-1 h-14 text-base gap-3" @click="addToCart">
            <i class="fa-solid fa-bag-shopping text-lg"></i>
            <span>{{ t('products.add_to_cart') }}</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Related Products -->
    <section v-if="productStore.relatedProducts.length > 0" class="space-y-8 border-t border-dark-border pt-12">
      <h3 class="text-2xl font-black text-white">منتجات ذات صلة</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          v-for="rel in productStore.relatedProducts"
          :key="rel.id"
          :product="rel"
        />
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../stores/useProductStore.js'
import { useCartStore } from '../stores/useCartStore.js'
import { useWishlistStore } from '../stores/useWishlistStore.js'
import { useNotificationStore } from '../stores/useNotificationStore.js'
import { useUiStore } from '../stores/useUiStore.js'
import ProductCard from '../components/products/ProductCard.vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const { t } = useI18n()
const route = useRoute()
const productStore = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()
const uiStore = useUiStore()

const product = computed(() => productStore.currentProduct)
const selectedSize = ref(null)
const activeImage = ref(null)
const qty = ref(1)

const isWishlisted = computed(() => product.value ? wishlistStore.isWishlisted(product.value.id) : false)

function loadProduct() {
  productStore.fetchProduct(props.id || route.params.id)
}

watch(product, (newVal) => {
  if (newVal) {
    selectedSize.value = newVal.sizes[0] || 40
    activeImage.value = newVal.image
    qty.value = 1
  }
})

watch(() => route.params.id, () => {
  loadProduct()
})

onMounted(() => {
  loadProduct()
})

function addToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, qty.value, selectedSize.value)
  notificationStore.success(t('toast.added_cart'))
}

function toggleWishlist() {
  if (!product.value) return
  const added = wishlistStore.toggleWishlist(product.value.id)
  notificationStore.info(added ? t('toast.added_wishlist') : t('toast.removed_wishlist'))
}
</script>
