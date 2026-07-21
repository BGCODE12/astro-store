<template>
  <div class="w-full">
    <!-- Loading State: Skeletons -->
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <SkeletonCard v-for="n in count" :key="n" />
    </div>

    <!-- Empty Results -->
    <div v-else-if="products.length === 0" class="text-center py-16 bg-dark-card border border-dark-border rounded-2xl p-8">
      <div class="w-16 h-16 rounded-full bg-dark-hover flex items-center justify-center text-gray-500 text-3xl mx-auto mb-4">
        <i class="fa-solid fa-filter-circle-xmark"></i>
      </div>
      <h3 class="text-xl font-bold text-white mb-2">{{ t('products.no_results') }}</h3>
      <p class="text-gray-400 text-sm mb-6">جرب تغيير الفلاتر أو إعادة ضبط البحث للعثور على الأحذية المطلوبة.</p>
      <button class="btn-secondary text-sm" @click="$emit('clear-filters')">
        {{ t('products.filter.clear') }}
      </button>
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import ProductCard from './ProductCard.vue'
import SkeletonCard from './SkeletonCard.vue'

defineProps({
  products: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  count: { type: Number, default: 8 },
})

defineEmits(['clear-filters'])

const { t } = useI18n()
</script>
