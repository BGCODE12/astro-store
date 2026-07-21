<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="productStore.quickViewProduct"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        @click.self="productStore.closeQuickView()"
      >
        <div class="modal-content w-full max-w-3xl bg-dark-card border border-dark-border rounded-3xl shadow-2xl overflow-hidden relative my-8">
          
          <!-- Close Button -->
          <button
            class="absolute top-4 right-4 rtl:left-4 rtl:right-auto z-10 btn-icon bg-black/50 backdrop-blur-md"
            @click="productStore.closeQuickView()"
          >
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>

          <div class="grid grid-cols-1 md:grid-cols-2">
            
            <!-- Product Image Slider / Display -->
            <div class="bg-gradient-to-b from-gray-800 to-gray-900 p-8 flex items-center justify-center relative min-h-[300px]">
              <img
                :src="selectedImage || product.image"
                :alt="uiStore.isRTL ? product.name_ar : product.name_en"
                class="w-full max-w-[320px] h-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              
              <!-- Thumbnails if multiple -->
              <div v-if="product.images && product.images.length > 1" class="absolute bottom-4 flex gap-2">
                <button
                  v-for="(img, idx) in product.images"
                  :key="idx"
                  class="w-12 h-12 rounded-lg border-2 overflow-hidden bg-black/40 transition-all"
                  :class="selectedImage === img ? 'border-brand-500 scale-105' : 'border-white/10 opacity-70 hover:opacity-100'"
                  @click="selectedImage = img"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>

            <!-- Details & Actions -->
            <div class="p-6 md:p-8 flex flex-col justify-between space-y-6">
              <div class="space-y-4">
                <div>
                  <span class="text-xs font-bold text-brand-500 uppercase tracking-widest">{{ product.brand }}</span>
                  <h2 class="text-2xl font-black text-white mt-1">
                    {{ uiStore.isRTL ? product.name_ar : product.name_en }}
                  </h2>
                  <div class="flex items-center gap-2 mt-2">
                    <div class="stars">
                      <i v-for="n in 5" :key="n" class="fa-solid fa-star text-xs" :class="n <= Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-600'"></i>
                    </div>
                    <span class="text-xs text-gray-400 font-semibold">({{ product.reviewCount }} {{ t('products.reviews') }})</span>
                  </div>
                </div>

                <!-- Price -->
                <div class="flex items-baseline gap-3">
                  <span class="text-3xl font-black text-white">${{ product.price.toFixed(2) }}</span>
                  <span v-if="product.originalPrice" class="text-base text-gray-500 line-through">${{ product.originalPrice.toFixed(2) }}</span>
                </div>

                <p class="text-sm text-gray-400 font-semibold leading-relaxed">
                  {{ uiStore.isRTL ? product.description_ar : product.description_en }}
                </p>

                <!-- Size Selector -->
                <div class="space-y-2">
                  <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                    {{ t('products.select_size') }}
                  </label>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="s in product.sizes"
                      :key="s"
                      class="w-10 h-10 rounded-xl text-xs font-bold border transition-all"
                      :class="selectedSize === s
                        ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/30'
                        : 'bg-dark-hover border-dark-border text-gray-300 hover:border-gray-500'"
                      @click="selectedSize = s"
                    >
                      {{ s }}
                    </button>
                  </div>
                </div>

                <!-- Quantity Adjust -->
                <div class="space-y-2">
                  <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block">
                    {{ t('products.quantity') }}
                  </label>
                  <div class="flex items-center border border-dark-border rounded-xl bg-dark-card w-32">
                    <button class="w-10 h-10 text-sm flex items-center justify-center text-gray-400 hover:text-white" @click="qty = Math.max(1, qty - 1)">
                      <i class="fa-solid fa-minus"></i>
                    </button>
                    <span class="flex-1 text-center font-bold text-white text-sm">{{ qty }}</span>
                    <button class="w-10 h-10 text-sm flex items-center justify-center text-gray-400 hover:text-white" @click="qty = Math.min(10, qty + 1)">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex gap-3 pt-4 border-t border-dark-border">
                <button class="btn-primary flex-1 py-3.5" @click="addToCart">
                  <i class="fa-solid fa-cart-plus"></i>
                  <span>{{ t('products.add_to_cart') }}</span>
                </button>
                <button class="btn-secondary px-4" @click="toggleWishlist" :title="t('products.add_to_wishlist')">
                  <i :class="isWishlisted ? 'fa-solid fa-heart text-red-500' : 'fa-regular fa-heart'"></i>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../../stores/useProductStore.js'
import { useCartStore } from '../../stores/useCartStore.js'
import { useWishlistStore } from '../../stores/useWishlistStore.js'
import { useNotificationStore } from '../../stores/useNotificationStore.js'
import { useUiStore } from '../../stores/useUiStore.js'

const { t } = useI18n()
const productStore = useProductStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const notificationStore = useNotificationStore()
const uiStore = useUiStore()

const product = computed(() => productStore.quickViewProduct)
const selectedSize = ref(null)
const selectedImage = ref(null)
const qty = ref(1)

const isWishlisted = computed(() => product.value ? wishlistStore.isWishlisted(product.value.id) : false)

watch(product, (newVal) => {
  if (newVal) {
    selectedSize.value = newVal.sizes[0] || 40
    selectedImage.value = newVal.image
    qty.value = 1
  }
})

function addToCart() {
  if (!product.value) return
  cartStore.addItem(product.value, qty.value, selectedSize.value)
  notificationStore.success(t('toast.added_cart'))
  productStore.closeQuickView()
}

function toggleWishlist() {
  if (!product.value) return
  const added = wishlistStore.toggleWishlist(product.value.id)
  notificationStore.info(added ? t('toast.added_wishlist') : t('toast.removed_wishlist'))
}
</script>
