<template>
  <div class="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 min-h-screen">
    
    <!-- Header -->
    <div class="pb-6 border-b border-dark-border">
      <h1 class="text-3xl md:text-4xl font-black text-white">{{ t('checkout.title') }}</h1>
      <p class="text-gray-400 text-sm font-semibold mt-1">أكمل معلوماتك لتأكيد طلب الشراء والدفع الآمن.</p>
    </div>

    <!-- Order Confirmed Screen -->
    <div v-if="orderPlaced" class="text-center py-16 bg-dark-card border border-dark-border rounded-3xl p-8 max-w-xl mx-auto space-y-6">
      <div class="w-20 h-20 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-4xl mx-auto animate-bounce-subtle">
        <i class="fa-solid fa-circle-check"></i>
      </div>
      <div>
        <h2 class="text-3xl font-black text-white mb-2">{{ t('checkout.order_success') }}</h2>
        <p class="text-gray-400 text-sm">شكراً لتسوقك معنا! تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني.</p>
      </div>

      <div class="bg-dark-hover p-4 rounded-xl border border-dark-border text-xs space-y-2 text-start">
        <div class="flex justify-between">
          <span class="text-gray-400">{{ t('checkout.order_number') }}:</span>
          <span class="font-bold text-brand-500">#ASTRO-{{ orderId }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-400">الإجمالي المدفوع:</span>
          <span class="font-bold text-white">${{ finalPaidAmount.toFixed(2) }}</span>
        </div>
      </div>

      <RouterLink to="/" class="btn-primary inline-flex">
        {{ t('common.go_home') }}
      </RouterLink>
    </div>

    <!-- Multi-step Checkout Form -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <!-- Checkout Form (2 cols) -->
      <form class="lg:col-span-2 bg-dark-card border border-dark-border rounded-3xl p-6 md:p-8 space-y-8" @submit.prevent="handlePlaceOrder">
        
        <!-- Step 1: Shipping Address -->
        <div class="space-y-4">
          <div class="flex items-center gap-3 pb-3 border-b border-dark-border">
            <div class="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm">1</div>
            <h3 class="text-xl font-bold text-white">{{ t('checkout.step_info') }}</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">{{ t('checkout.first_name') }} *</label>
              <input v-model="form.firstName" type="text" required class="input-base" placeholder="أحمد" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">{{ t('checkout.last_name') }} *</label>
              <input v-model="form.lastName" type="text" required class="input-base" placeholder="علي" />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">{{ t('checkout.email') }} *</label>
              <input v-model="form.email" type="email" required class="input-base" placeholder="ahmed@example.com" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">{{ t('checkout.phone') }} *</label>
              <input v-model="form.phone" type="tel" required class="input-base" placeholder="+966 50 123 4567" />
            </div>
          </div>

          <div>
            <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">{{ t('checkout.address') }} *</label>
            <input v-model="form.address" type="text" required class="input-base" placeholder="شارع الملك فهد، حي العليا" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">{{ t('checkout.city') }} *</label>
              <input v-model="form.city" type="text" required class="input-base" placeholder="الرياض" />
            </div>
            <div>
              <label class="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1.5">{{ t('checkout.country') }} *</label>
              <select v-model="form.country" class="input-base cursor-pointer">
                <option value="SA">المملكة العربية السعودية</option>
                <option value="AE">الإمارات العربية المتحدة</option>
                <option value="KW">الكويت</option>
                <option value="QA">قطر</option>
                <option value="OM">عمان</option>
                <option value="BH">البحرين</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Step 2: Payment Method -->
        <div class="space-y-4 pt-4 border-t border-dark-border">
          <div class="flex items-center gap-3 pb-3 border-b border-dark-border">
            <div class="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm">2</div>
            <h3 class="text-xl font-bold text-white">{{ t('checkout.step_payment') }}</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label
              v-for="pm in paymentMethods"
              :key="pm.id"
              class="p-4 rounded-xl border cursor-pointer flex flex-col items-center justify-center text-center transition-all select-none gap-2"
              :class="form.paymentMethod === pm.id
                ? 'bg-brand-500/15 border-brand-500 text-white font-bold'
                : 'bg-dark-hover border-dark-border text-gray-400 hover:text-white'"
            >
              <input type="radio" :value="pm.id" v-model="form.paymentMethod" class="sr-only" />
              <i :class="[pm.icon, 'text-2xl text-brand-500']"></i>
              <span class="text-xs font-bold">{{ pm.label }}</span>
            </label>
          </div>

          <!-- Simulated Credit Card Inputs -->
          <div v-if="form.paymentMethod === 'card'" class="p-4 rounded-2xl bg-dark-hover border border-dark-border space-y-3">
            <div>
              <label class="text-xs font-bold text-gray-400 block mb-1">رقم البطاقة</label>
              <input v-model="form.cardNumber" type="text" maxlength="19" placeholder="4532 •••• •••• 8892" class="input-base text-xs font-mono" />
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="text-xs font-bold text-gray-400 block mb-1">تاريخ الانتهاء</label>
                <input v-model="form.cardExp" type="text" maxlength="5" placeholder="MM/YY" class="input-base text-xs font-mono" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-400 block mb-1">CVC / CVV</label>
                <input v-model="form.cardCvc" type="password" maxlength="4" placeholder="123" class="input-base text-xs font-mono" />
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isProcessing"
          class="btn-primary w-full py-4 text-base justify-center font-black gap-3"
        >
          <i v-if="isProcessing" class="fa-solid fa-spinner animate-spin text-lg"></i>
          <template v-else>
            <i class="fa-solid fa-lock text-sm"></i>
            <span>{{ t('checkout.place_order') }} (${{ cartStore.total.toFixed(2) }})</span>
          </template>
        </button>

      </form>

      <!-- Order Items Summary Sidebar -->
      <div class="bg-dark-card border border-dark-border rounded-3xl p-6 space-y-6">
        <h3 class="text-xl font-bold text-white border-b border-dark-border pb-4">المنتجات ({{ cartStore.itemCount }})</h3>

        <div class="space-y-3 max-h-80 overflow-y-auto pr-1">
          <div
            v-for="item in cartStore.items"
            :key="`${item.id}-${item.size}`"
            class="flex items-center justify-between text-xs gap-3 p-2 bg-dark-hover/50 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <img :src="item.image" class="w-12 h-12 rounded-lg object-cover bg-gray-900" />
              <div>
                <h4 class="font-bold text-white truncate max-w-[140px]">{{ uiStore.isRTL ? item.name_ar : item.name_en }}</h4>
                <p class="text-gray-400">المقاس: {{ item.size }} • الكمية: {{ item.quantity }}</p>
              </div>
            </div>
            <span class="font-black text-white">${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <div class="space-y-2 text-xs font-semibold text-gray-400 border-t border-dark-border pt-4">
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
            <span>الخصم</span>
            <span class="font-bold">-${{ cartStore.discount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-lg font-black text-white pt-3 border-t border-dark-border">
            <span>{{ t('cart.total') }}</span>
            <span class="text-brand-500">${{ cartStore.total.toFixed(2) }}</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCartStore } from '../stores/useCartStore.js'
import { useNotificationStore } from '../stores/useNotificationStore.js'
import { useUiStore } from '../stores/useUiStore.js'

const { t } = useI18n()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()
const uiStore = useUiStore()

const isProcessing = ref(false)
const orderPlaced = ref(false)
const orderId = ref('')
const finalPaidAmount = ref(0)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: 'SA',
  paymentMethod: 'card',
  cardNumber: '',
  cardExp: '',
  cardCvc: '',
})

const paymentMethods = [
  { id: 'card', label: 'بطاقة ائتمانية', icon: 'fa-regular fa-credit-card' },
  { id: 'apple', label: 'Apple Pay', icon: 'fa-brands fa-apple' },
  { id: 'cod', label: 'الدفع عند الاستلام', icon: 'fa-solid fa-money-bill-wave' },
]

async function handlePlaceOrder() {
  isProcessing.value = true
  
  // Rate-limiting & security simulation delay
  await new Promise(r => setTimeout(r, 1500))

  orderId.value = Math.floor(100000 + Math.random() * 900000).toString()
  finalPaidAmount.value = cartStore.total
  orderPlaced.value = true
  isProcessing.value = false
  
  cartStore.clearCart()
  notificationStore.success(t('checkout.order_success'))
}
</script>
