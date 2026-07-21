<template>
  <div class="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 min-h-screen">
    
    <div class="flex justify-between items-center pb-6 border-b border-dark-border">
      <h1 class="text-3xl md:text-4xl font-black text-white">
        {{ t('cart.title') }}
        <span v-if="cartStore.itemCount > 0" class="text-brand-500 font-bold text-lg">({{ cartStore.itemCount }})</span>
      </h1>
      <button v-if="!cartStore.isEmpty" class="text-xs text-gray-400 hover:text-red-400 font-semibold" @click="cartStore.clearCart()">
        إفراغ السلة
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="cartStore.isEmpty" class="text-center py-20 bg-dark-card border border-dark-border rounded-3xl p-8 max-w-xl mx-auto">
      <div class="w-20 h-20 rounded-full bg-dark-hover flex items-center justify-center text-gray-600 text-3xl mx-auto mb-4">
        <i class="fa-solid fa-cart-shopping"></i>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">{{ t('cart.empty') }}</h2>
      <p class="text-gray-400 text-sm mb-6">{{ t('cart.empty_sub') }}</p>
      <RouterLink to="/products" class="btn-primary inline-flex">
        {{ t('cart.continue_shopping') }}
      </RouterLink>
    </div>

    <!-- Cart Layout -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Items List -->
      <div class="lg:col-span-2 space-y-4">
        <div
          v-for="item in cartStore.items"
          :key="`${item.id}-${item.size}-${item.color}`"
          class="bg-dark-card border border-dark-border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between"
        >
          <div class="flex items-center gap-4 w-full sm:w-auto">
            <div class="w-24 h-24 rounded-xl bg-gray-900 overflow-hidden flex-shrink-0">
              <img :src="item.image" :alt="uiStore.isRTL ? item.name_ar : item.name_en" class="w-full h-full object-cover" />
            </div>
            <div>
              <span class="text-xs font-bold text-brand-500 uppercase tracking-widest">{{ item.brand }}</span>
              <h3 class="text-base font-bold text-white mt-0.5">{{ uiStore.isRTL ? item.name_ar : item.name_en }}</h3>
              <p class="text-xs text-gray-400 mt-1">
                <span v-if="item.size" class="px-2 py-0.5 bg-dark-hover rounded border border-dark-border">
                  {{ t('products.size') }}: {{ item.size }}
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center justify-between w-full sm:w-auto gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-dark-border">
            <!-- Quantity controls -->
            <div class="flex items-center border border-dark-border rounded-xl bg-dark-hover">
              <button class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white" @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity - 1)">
                <i class="fa-solid fa-minus text-xs"></i>
              </button>
              <span class="w-8 text-center text-sm font-bold text-white">{{ item.quantity }}</span>
              <button class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white" @click="cartStore.updateQuantity(item.id, item.size, item.color, item.quantity + 1)">
                <i class="fa-solid fa-plus text-xs"></i>
              </button>
            </div>

            <!-- Price -->
            <span class="text-lg font-black text-white min-w-[80px] text-end">${{ (item.price * item.quantity).toFixed(2) }}</span>

            <!-- Delete -->
            <button class="text-gray-500 hover:text-red-400 p-2" @click="cartStore.removeItem(item.id, item.size, item.color)">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary Card -->
      <div class="bg-dark-card border border-dark-border rounded-3xl p-6 h-fit space-y-6">
        <h3 class="text-xl font-bold text-white border-b border-dark-border pb-4">ملخص الطلب</h3>

        <form class="flex gap-2" @submit.prevent="cartStore.applyCoupon(couponInput)">
          <input
            v-model="couponInput"
            type="text"
            :placeholder="t('cart.coupon_placeholder')"
            class="input-base text-xs flex-1 uppercase"
          />
          <button type="submit" class="btn-secondary text-xs px-4">
            {{ t('cart.apply_coupon') }}
          </button>
        </form>

        <p v-if="cartStore.appliedCoupon" class="text-xs text-green-400 font-semibold flex items-center justify-between">
          <span>{{ t('cart.coupon_applied') }} ({{ cartStore.appliedCoupon.label }})</span>
          <button class="text-gray-400 hover:text-white text-[10px]" @click="cartStore.removeCoupon()">إزالة</button>
        </p>

        <div class="space-y-3 text-sm font-semibold text-gray-400">
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

          <div class="flex justify-between text-xl font-black text-white pt-4 border-t border-dark-border">
            <span>{{ t('cart.total') }}</span>
            <span class="text-brand-500">${{ cartStore.total.toFixed(2) }}</span>
          </div>
        </div>

        <RouterLink to="/checkout" class="btn-primary w-full py-4 text-center justify-center">
          <span>{{ t('cart.checkout') }}</span>
          <i class="fa-solid fa-arrow-left rtl:rotate-0 rotate-180"></i>
        </RouterLink>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../stores/useCartStore.js'
import { useUiStore } from '../stores/useUiStore.js'

const { t } = useI18n()
const cartStore = useCartStore()
const uiStore = useUiStore()

const couponInput = ref('')
</script>
