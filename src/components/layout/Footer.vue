<template>
  <footer class="bg-[#050505] border-t border-dark-border pt-20 pb-10 relative z-10 mt-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        <!-- Brand Info -->
        <div class="space-y-6">
          <RouterLink to="/" class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30">
              <i class="fa-solid fa-bolt text-white text-xl"></i>
            </div>
            <span class="font-black text-2xl tracking-wider uppercase text-white">
              {{ t('common.brand_name') }}<span class="text-brand-500">.</span>
            </span>
          </RouterLink>
          <p class="text-gray-400 font-semibold leading-relaxed text-sm">
            {{ t('footer.brand_desc') }}
          </p>
          <div class="flex gap-3">
            <a href="#" class="btn-icon" aria-label="Instagram">
              <i class="fa-brands fa-instagram"></i>
            </a>
            <a href="#" class="btn-icon" aria-label="Twitter">
              <i class="fa-brands fa-x-twitter"></i>
            </a>
            <a href="#" class="btn-icon" aria-label="TikTok">
              <i class="fa-brands fa-tiktok"></i>
            </a>
            <a href="#" class="btn-icon" aria-label="Facebook">
              <i class="fa-brands fa-facebook-f"></i>
            </a>
          </div>
        </div>

        <!-- Links 1: Shop -->
        <div>
          <h3 class="text-white font-bold text-lg mb-6">{{ t('footer.shop') }}</h3>
          <ul class="space-y-3.5 text-sm">
            <li>
              <RouterLink to="/products?category=running" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">
                {{ t('footer.shop_links.running') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products?category=basketball" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">
                {{ t('footer.shop_links.basketball') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products?category=training" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">
                {{ t('footer.shop_links.training') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products?category=lifestyle" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">
                {{ t('footer.shop_links.lifestyle') }}
              </RouterLink>
            </li>
            <li>
              <RouterLink to="/products?sort=price_asc" class="text-brand-500 hover:text-brand-400 font-bold transition-colors">
                {{ t('footer.shop_links.sale') }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Links 2: Customer Service -->
        <div>
          <h3 class="text-white font-bold text-lg mb-6">{{ t('footer.customer_service') }}</h3>
          <ul class="space-y-3.5 text-sm">
            <li><a href="#" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">{{ t('footer.service_links.track') }}</a></li>
            <li><a href="#" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">{{ t('footer.service_links.returns') }}</a></li>
            <li><a href="#" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">{{ t('footer.service_links.size_guide') }}</a></li>
            <li><a href="#" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">{{ t('footer.service_links.faq') }}</a></li>
            <li><a href="#" class="text-gray-400 hover:text-brand-500 font-semibold transition-colors">{{ t('footer.service_links.contact') }}</a></li>
          </ul>
        </div>

        <!-- Newsletter -->
        <div>
          <h3 class="text-white font-bold text-lg mb-6">{{ t('footer.newsletter') }}</h3>
          <p class="text-gray-400 font-semibold text-sm mb-4 leading-relaxed">
            {{ t('footer.newsletter_desc') }}
          </p>
          <form class="flex flex-col gap-3" @submit.prevent="handleSubscribe">
            <div class="relative">
              <input
                v-model="email"
                type="email"
                required
                :placeholder="t('footer.newsletter_placeholder')"
                class="input-base"
              />
            </div>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-primary w-full text-sm"
            >
              <i v-if="isSubmitting" class="fa-solid fa-spinner animate-spin"></i>
              <span v-else>{{ t('footer.subscribe') }}</span>
            </button>
          </form>
        </div>
        
      </div>

      <div class="border-t border-dark-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div class="flex flex-col md:flex-row items-center gap-4 text-xs font-semibold text-gray-500">
          <p>&copy; {{ new Date().getFullYear() }} {{ t('common.brand_name') }}. {{ t('footer.rights') }}</p>
          <span class="hidden md:inline">•</span>
          <RouterLink to="/admin" class="hover:text-brand-500 transition-colors flex items-center gap-1">
            <i class="fa-solid fa-lock text-[10px]"></i>
            <span>{{ t('nav.admin') }}</span>
          </RouterLink>
        </div>
        <div class="flex items-center gap-4 text-2xl text-gray-600">
          <i class="fa-brands fa-cc-visa hover:text-white transition-colors cursor-pointer" title="Visa"></i>
          <i class="fa-brands fa-cc-mastercard hover:text-white transition-colors cursor-pointer" title="MasterCard"></i>
          <i class="fa-brands fa-cc-paypal hover:text-white transition-colors cursor-pointer" title="PayPal"></i>
          <i class="fa-brands fa-cc-apple-pay hover:text-white transition-colors cursor-pointer" title="Apple Pay"></i>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import productService from '../../services/productService.js'
import { useNotificationStore } from '../../stores/useNotificationStore.js'

const { t } = useI18n()
const notificationStore = useNotificationStore()

const email = ref('')
const isSubmitting = ref(false)

async function handleSubscribe() {
  if (!email.value) return
  isSubmitting.value = true
  try {
    await productService.subscribeNewsletter(email.value)
    notificationStore.success(t('toast.subscribed'))
    email.value = ''
  } catch (err) {
    notificationStore.error(err.message || t('toast.error'))
  } finally {
    isSubmitting.value = false
  }
}
</script>
