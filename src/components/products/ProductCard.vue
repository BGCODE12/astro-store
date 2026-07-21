<template>
  <div class="group bg-dark-card border border-dark-border rounded-2xl p-4 transition-all duration-300 hover:-translate-y-2 hover:border-brand-500/50 hover:shadow-[0_10px_30px_rgba(255,102,51,0.15)] relative flex flex-col justify-between">
    
    <!-- Top Badges & Wishlist -->
    <div class="flex justify-between items-center mb-3">
      <!-- Badge -->
      <div>
        <span v-if="product.badge === 'new'" class="badge-new">{{ t('products.badge.new') }}</span>
        <span v-else-if="product.badge === 'sale'" class="badge-sale">{{ t('products.badge.sale') }}</span>
        <span v-else-if="product.badge === 'hot'" class="badge-hot">{{ t('products.badge.hot') }}</span>
      </div>

      <!-- Wishlist Toggle Button -->
      <button
        class="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center transition-colors z-10"
        :class="isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'"
        @click.stop="handleWishlist"
        :title="t('products.add_to_wishlist')"
      >
        <i :class="isWishlisted ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
      </button>
    </div>

    <!-- Image & Quick View Hover Overlay -->
    <div
      class="bg-gradient-to-b from-gray-800/80 to-gray-900/90 rounded-xl mb-4 h-52 img-hover-zoom flex items-center justify-center p-4 relative cursor-pointer"
      @click="$router.push(`/products/${product.id}`)"
    >
      <img
        :src="product.image"
        :alt="uiStore.isRTL ? product.name_ar : product.name_en"
        class="w-full h-full object-cover rounded-lg drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
      />

      <!-- Quick View Hover Button -->
      <button
        class="absolute bottom-3 bg-black/80 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-lg backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-1.5"
        @click.stop="productStore.openQuickView(product)"
      >
        <i class="fa-regular fa-eye"></i>
        <span>{{ t('products.quick_view') }}</span>
      </button>
    </div>

    <!-- Details -->
    <div class="space-y-1.5 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex justify-between items-center text-xs">
          <p class="text-brand-500 font-bold uppercase tracking-wider">{{ product.brand }}</p>
          <div class="stars" :title="`${product.rating} / 5`">
            <i class="fa-solid fa-star star-filled text-[10px]"></i>
            <span class="text-xs font-bold text-gray-300 ml-1 rtl:mr-1 rtl:ml-0">{{ product.rating }}</span>
          </div>
        </div>

        <RouterLink :to="`/products/${product.id}`">
          <h3 class="text-base font-bold text-white truncate hover:text-brand-500 transition-colors mt-1">
            {{ uiStore.isRTL ? product.name_ar : product.name_en }}
          </h3>
        </RouterLink>
      </div>

      <!-- Price & Add to Cart -->
      <div class="flex justify-between items-center pt-3 border-t border-dark-border/50 mt-2">
        <div class="flex flex-col">
          <span class="text-xl font-black text-white">${{ product.price.toFixed(2) }}</span>
          <span v-if="product.originalPrice" class="text-xs text-gray-500 line-through">${{ product.originalPrice.toFixed(2) }}</span>
        </div>

        <button
          class="w-10 h-10 rounded-xl bg-white/5 hover:bg-brand-500 text-white flex items-center justify-center transition-all duration-300 border border-white/10 group-hover:border-transparent active:scale-90"
          @click.stop="handleAddToCart"
          :title="t('products.add_to_cart')"
        >
          <i class="fa-solid fa-cart-plus"></i>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '../../stores/useUiStore.js'
import { useCartStore } from '../../stores/useCartStore.js'
import { useWishlistStore } from '../../stores/useWishlistStore.js'
import { useProductStore } from '../../stores/useProductStore.js'
import { useNotificationStore } from '../../stores/useNotificationStore.js'

const props = defineProps({
  product: { type: Object, required: true },
})

const { t } = useI18n()
const uiStore = useUiStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productStore = useProductStore()
const notificationStore = useNotificationStore()

const isWishlisted = computed(() => wishlistStore.isWishlisted(props.product.id))

function handleWishlist() {
  const added = wishlistStore.toggleWishlist(props.product.id)
  notificationStore.info(added ? t('toast.added_wishlist') : t('toast.removed_wishlist'))
}

function handleAddToCart() {
  const defaultSize = props.product.sizes[0] || 40
  const defaultColor = props.product.colors[0] || '#111111'
  cartStore.addItem(props.product, 1, defaultSize, defaultColor)
  notificationStore.success(t('toast.added_cart'))
}
</script>
