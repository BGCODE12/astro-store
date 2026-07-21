<template>
  <div class="pt-32 pb-20 max-w-7xl mx-auto px-4 text-center space-y-6 min-h-[70vh] flex flex-col items-center justify-center">
    <div class="relative">
      <h1 class="text-9xl font-black text-white/10 select-none">404</h1>
      <div class="absolute inset-0 flex items-center justify-center">
        <i class="fa-solid fa-ghost text-6xl text-brand-500 animate-bounce"></i>
      </div>
    </div>
    <h2 class="text-3xl font-black text-white">{{ t('common.page_not_found') }}</h2>
    <p class="text-gray-400 max-w-md mx-auto font-semibold">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى عنوان آخر.</p>
    <RouterLink to="/" class="btn-primary inline-flex">
      {{ t('common.go_home') }}
    </RouterLink>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
