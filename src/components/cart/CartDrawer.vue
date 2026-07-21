<template>
  <Teleport to="body">
    <!-- Backdrop Overlay -->
    <Transition name="overlay">
      <div
        v-if="cartStore.isOpen"
        class="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
        @click="cartStore.closeCart()"
      ></div>
    </Transition>

    <!-- Slide-over Drawer -->
    <Transition :name="uiStore.isRTL ? 'drawer-left' : 'drawer'">
      <div
        v-if="cartStore.isOpen"
        class="fixed top-0 bottom-0 z-[100] w-full max-w-md bg-dark-card border-l rtl:border-r rtl:border-l-0 border-dark-border shadow-2xl flex flex-col justify-between"
        :class="uiStore.isRTL ? 'left-0' : 'right-0'"
      >
        <!-- Header -->
        <div class="px-6 py-5 border-b border-dark-border flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <h2 class="text-xl font-black text-white">{{ t('cart.title') }}</h2>
            <span v-if="cartStore.itemCount > 0" class="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400">
              {{ cartStore.itemCount }} {{ t(cartStore.itemCount === 1 ? 'cart.item' : 'cart.items') }}
            </span>
          </div>
          <button class="btn-icon" @click="cartStore.closeCart()">
            <i class="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <!-- Cart Items List (Scrollable) -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <div v-if="cartStore.isEmpty" class="h-full flex flex-col items-center justify-center text-center py-12">
            <div class="w-20 h-20 rounded-full bg-dark-hover flex items-center justify-center text-gray-600 text-3xl mb-4">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <h3 class="text-lg font-bold text-white mb-1">{{ t('cart.empty') }}</h3>
            <p class="text-gray-400 text-sm max-w-xs mb-6">{{ t('cart.empty_sub') }}</p>
            <button class="btn-primary text-sm" @click="cartStore.closeCart(); $router.push('/products')">
              {{ t('cart.continue_shopping') }}
            </button>
          </div>

          <div
            v-for="item in cartStore.items"
            :key="`${item.id}-${item.size}-${item.color}`"
            class="bg-dark-hover/50 border border-dark-border rounded-xl p-3.5 flex gap-3 items-center transition-all hover:border-dark-border/80"
          >
            <!-- Thumbnail -->
            <div class="w-20 h-20 rounded-lg bg-gray-900 flex-shrink-0 overflow-hidden relative">
              <img :src="item.image" :alt="uiStore.isRTL ? item.name_ar : item.name_en" class="w-full h-full object-cover" />
            </div>

            <!-- Details -->
            <div class="flex-1 min-w-0 space-y-1">
              <p class="text-[10px] font-bold text-brand-500 uppercase tracking-wider">{{ item.brand }}</p>
              <h4 class="text-sm font-bold text-white truncate">{{ uiStore.isRTL ? item.name_ar : item.name_en }}</h4>
              
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span v-if="item.size" class="px-1.5 py-0.5 bg-dark-border rounded">{{ t('products.size') }}: {{ item.size }}</span>
              </div>

              <!-- Quantity & Price controls -->
              <div class="flex items-center justify-between pt-1">
                <div class="flex items-center border border-dark-border rounded-lg bg-dark-card">
                  <button
                    class="w-7 h-7 text-xs flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity - 1)"
                  >
                    <i class="fa-solid fa-minus"></i>
                  </button>
                  <span class="w-7 text-center text-xs font-bold text-white">{{ item.quantity }}</span>
                  <button
                    class="w-7 h-7 text-xs flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity + 1)"
                  >
                    <i class="fa-solid fa-plus"></i>
                  </button>
                </div>

                <div class="text-end">
                  <span class="text-sm font-black text-white">${{ (item.price * item.quantity).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <!-- Trash Button -->
            <button
              class="text-gray-500 hover:text-red-400 p-2 transition-colors flex-shrink-0"
              @click="cartStore.removeItem(item.id, item.size, item.color)"
              :title="t('cart.remove')"
            >
              <i class="fa-regular fa-trash-can text-sm"></i>
            </button>
          </div>
        </div>

        <!-- Footer / Checkout Summary -->
        <div v-if="!cartStore.isEmpty" class="p-6 border-t border-dark-border bg-dark-card space-y-4">
          <!-- Coupon Input -->
          <form class="flex gap-2" @submit.prevent="handleCoupon">
            <input
              v-model="couponInput"
              type="text"
              :placeholder="t('cart.coupon_placeholder')"
              class="input-base text-xs flex-1 py-2.5 uppercase"
            />
            <button type="submit" class="btn-secondary text-xs px-4 py-2.5">
              {{ t('cart.apply_coupon') }}
            </button>
          </form>

          <p v-if="cartStore.appliedCoupon" class="text-xs text-green-400 font-semibold flex items-center justify-between">
            <span>{{ t('cart.coupon_applied') }} ({{ cartStore.appliedCoupon.label }})</span>
            <button class="text-gray-400 hover:text-white underline text-[10px]" @click="cartStore.removeCoupon()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </p>

          <p v-if="cartStore.couponError" class="text-xs text-red-400 font-semibold">
            {{ t('cart.invalid_coupon') }}
          </p>

          <!-- Calculations -->
          <div class="space-y-2 text-xs font-semibold text-gray-400">
            <div class="flex justify-between">
              <span>{{ t('cart.subtotal') }}</span>
              <span class="text-white font-bold">${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between">
              <span>{{ t('cart.shipping') }}</span>
              <span v-if="cartStore.shippingCost === 0" class="text-green-400 font-bold">{{ t('cart.free_shipping') }}</span>
              <span v-else class="text-white font-bold">${{ cartStore.shippingCost.toFixed(2) }}</span>
            </div>

            <div v-if="cartStore.discount > 0" class="flex justify-between text-green-400">
              <span>خصم / Discount</span>
              <span class="font-bold">-${{ cartStore.discount.toFixed(2) }}</span>
            </div>

            <div class="flex justify-between text-base font-black text-white pt-2 border-t border-dark-border">
              <span>{{ t('cart.total') }}</span>
              <span class="text-brand-500">${{ cartStore.total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Actions -->
          <button class="btn-primary w-full" @click="goToCheckout">
            <span>{{ t('cart.checkout') }}</span>
            <i class="fa-solid fa-arrow-left rtl:rotate-0 rotate-180"></i>
          </button>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../../stores/useCartStore.js'
import { useUiStore } from '../../stores/useUiStore.js'

const { t } = useI18n()
const router = useRouter()
const cartStore = useCartStore()
const uiStore = useUiStore()

const couponInput = ref('')

function handleCoupon() {
  if (couponInput.value) {
    cartStore.applyCoupon(couponInput.value)
  }
}

function goToCheckout() {
  cartStore.closeCart()
  router.push('/checkout')
}
</script>
