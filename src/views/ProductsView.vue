<template>
  <div class="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 min-h-screen">
    
    <!-- Page Header & Title -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-dark-border">
      <div>
        <h1 class="text-3xl md:text-4xl font-black text-white">
          {{ t('nav.products') }}
          <span class="text-brand-500 font-bold text-lg">({{ productStore.productCount }})</span>
        </h1>
        <p class="text-gray-400 text-sm font-semibold mt-1">تصفح تشكيلتنا الكاملة من الأحذية الفاخرة.</p>
      </div>

      <!-- Controls: Sort & Mobile Filter Toggle -->
      <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
        <!-- Mobile Filter Toggle Button -->
        <button class="md:hidden btn-secondary text-xs py-2.5 px-4" @click="isMobileFilterOpen = true">
          <i class="fa-solid fa-sliders text-brand-500"></i>
          <span>{{ t('products.filter.title') }}</span>
        </button>

        <!-- Sort Select -->
        <div class="flex items-center gap-2">
          <label class="text-xs font-bold text-gray-400 hidden sm:inline">{{ t('products.sort.label') }}:</label>
          <select
            v-model="productStore.filters.sort"
            @change="handleSortChange"
            class="input-base text-xs py-2.5 px-3 rounded-xl bg-dark-card border-dark-border text-white font-bold cursor-pointer"
          >
            <option value="newest">{{ t('products.sort.newest') }}</option>
            <option value="price_asc">{{ t('products.sort.price_asc') }}</option>
            <option value="price_desc">{{ t('products.sort.price_desc') }}</option>
            <option value="rating">{{ t('products.sort.rating') }}</option>
            <option value="popular">{{ t('products.sort.popular') }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Main Layout: Sidebar Filter + Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
      
      <!-- Desktop Sidebar Filter -->
      <div class="hidden md:block col-span-1">
        <ProductFilter
          v-model="productStore.filters"
          @apply="applyFilters"
        />
      </div>

      <!-- Products Grid -->
      <div class="col-span-1 md:col-span-3">
        <ProductGrid
          :products="productStore.products"
          :loading="productStore.isLoading"
          :count="8"
          @clear-filters="productStore.resetFilters(); applyFilters()"
        />
      </div>

    </div>

    <!-- Mobile Slide-over Filter Drawer -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="isMobileFilterOpen" class="fixed inset-0 z-[90] bg-black/80 backdrop-blur-sm" @click="isMobileFilterOpen = false"></div>
      </Transition>
      <Transition :name="uiStore.isRTL ? 'drawer-left' : 'drawer'">
        <div v-if="isMobileFilterOpen" class="fixed top-0 bottom-0 z-[100] w-full max-w-xs bg-dark-card p-6 overflow-y-auto shadow-2xl" :class="uiStore.isRTL ? 'left-0' : 'right-0'">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-black text-lg text-white">{{ t('products.filter.title') }}</h3>
            <button class="btn-icon" @click="isMobileFilterOpen = false">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <ProductFilter
            v-model="productStore.filters"
            @apply="applyFilters(); isMobileFilterOpen = false"
          />
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useProductStore } from '../stores/useProductStore.js'
import { useUiStore } from '../stores/useUiStore.js'
import ProductFilter from '../components/products/ProductFilter.vue'
import ProductGrid from '../components/products/ProductGrid.vue'

const { t } = useI18n()
const route = useRoute()
const productStore = useProductStore()
const uiStore = useUiStore()

const isMobileFilterOpen = ref(false)

function applyFilters() {
  productStore.fetchProducts()
}

function handleSortChange() {
  productStore.fetchProducts()
}

onMounted(() => {
  // Check URL query parameters
  if (route.query.category) {
    productStore.filters.category = route.query.category
  }
  if (route.query.sort) {
    productStore.filters.sort = route.query.sort
  }
  productStore.fetchProducts()
})

watch(() => route.query, (newQuery) => {
  if (newQuery.category) productStore.filters.category = newQuery.category
  if (newQuery.sort) productStore.filters.sort = newQuery.sort
  productStore.fetchProducts()
})
</script>
