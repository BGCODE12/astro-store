<template>
  <div class="pt-32 pb-20 max-w-md mx-auto px-4 min-h-[80vh] flex flex-col justify-center items-center">
    
    <div class="w-full bg-dark-card border border-dark-border rounded-3xl p-8 shadow-2xl space-y-6 text-center">
      
      <!-- Lock Icon Header -->
      <div class="w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 flex items-center justify-center text-3xl mx-auto shadow-lg shadow-brand-500/20">
        <i class="fa-solid fa-user-shield"></i>
      </div>

      <div>
        <h1 class="text-2xl font-black text-white mb-2">{{ t('admin.passcode_title') }}</h1>
        <p class="text-xs text-gray-400 font-semibold leading-relaxed">
          {{ t('admin.passcode_desc') }}
        </p>
      </div>

      <!-- Secret Passcode Form -->
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div class="relative">
          <input
            v-model="passcode"
            :type="showPasscode ? 'text' : 'password'"
            required
            :placeholder="t('admin.passcode_placeholder')"
            class="input-base text-center tracking-widest text-lg py-3.5 font-bold"
          />
          <button
            type="button"
            class="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-sm"
            @click="showPasscode = !showPasscode"
          >
            <i :class="showPasscode ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
          </button>
        </div>

        <p v-if="errorMessage" class="text-xs text-red-400 font-bold animate-shake">
          <i class="fa-solid fa-circle-exclamation mr-1"></i> {{ errorMessage }}
        </p>

        <button type="submit" class="btn-primary w-full py-4 text-base font-bold gap-2">
          <i class="fa-solid fa-key"></i>
          <span>{{ t('admin.enter') }}</span>
        </button>
      </form>

      <!-- Passcode Hint for User -->
      <div class="pt-4 border-t border-dark-border/60 text-xs text-gray-500">
        <p>الرمز السري الافتراضي للاختبار: <span class="text-brand-400 font-mono font-bold bg-dark-hover px-2 py-0.5 rounded border border-dark-border">astro2026</span> أو <span class="text-brand-400 font-mono font-bold bg-dark-hover px-2 py-0.5 rounded border border-dark-border">1234</span></p>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/useAuthStore.js'
import { useNotificationStore } from '../../stores/useNotificationStore.js'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const passcode = ref('')
const showPasscode = ref(false)
const errorMessage = ref('')

function handleLogin() {
  errorMessage.value = ''
  const success = authStore.loginWithPasscode(passcode.value, true)
  if (success) {
    notificationStore.success('أهلاً بك في لوحة تحكم الأدمن!')
    router.push('/admin')
  } else {
    errorMessage.value = t('admin.invalid_passcode')
  }
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}
.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
