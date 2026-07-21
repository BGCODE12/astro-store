<template>
  <aside class="bg-dark-card border border-dark-border rounded-2xl p-6 space-y-6">
    <!-- Filter Header -->
    <div class="flex justify-between items-center pb-4 border-b border-dark-border">
      <div class="flex items-center gap-2">
        <i class="fa-solid fa-sliders text-brand-500"></i>
        <h3 class="font-black text-lg text-white">{{ t('products.filter.title') }}</h3>
      </div>
      <button class="text-xs font-semibold text-gray-400 hover:text-brand-500 transition-colors" @click="reset">
        {{ t('products.filter.clear') }}
      </button>
    </div>

    <!-- Category Filter -->
    <div class="space-y-3">
      <h4 class="text-sm font-bold text-gray-300 uppercase tracking-wider">{{ t('products.filter.category') }}</h4>
      <div class="space-y-1.5">
        <button
          v-for="cat in ['all', ...CATEGORIES]"
          :key="cat"
          class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          :class="localFilters.category === cat
            ? 'bg-brand-500/15 text-brand-400 font-bold border border-brand-500/30'
            : 'text-gray-400 hover:bg-dark-hover hover:text-white'"
          @click="selectCategory(cat)"
        >
          <span>{{ cat === 'all' ? 'جميع التصنيفات' : t(`products.category.${cat}`) }}</span>
          <i v-if="localFilters.category === cat" class="fa-solid fa-check text-brand-500"></i>
        </button>
      </div>
    </div>

    <!-- Brand Filter -->
    <div class="space-y-3 pt-4 border-t border-dark-border">
      <h4 class="text-sm font-bold text-gray-300 uppercase tracking-wider">{{ t('products.filter.brand') }}</h4>
      <div class="space-y-2">
        <label
          v-for="brand in BRANDS"
          :key="brand"
          class="flex items-center gap-3 cursor-pointer text-xs font-semibold text-gray-400 hover:text-white select-none"
        >
          <input
            type="checkbox"
            :value="brand"
            v-model="localFilters.brand"
            @change="apply"
            class="w-4 h-4 rounded bg-dark-hover border-dark-border text-brand-500 focus:ring-brand-500/30"
          />
          <span>{{ brand }}</span>
        </label>
      </div>
    </div>

    <!-- Price Range Filter -->
    <div class="space-y-3 pt-4 border-t border-dark-border">
      <div class="flex justify-between items-center text-xs font-bold">
        <span class="text-gray-300 uppercase tracking-wider">{{ t('products.filter.price') }}</span>
        <span class="text-brand-500">${{ localFilters.maxPrice }}</span>
      </div>
      <input
        type="range"
        min="50"
        max="400"
        step="10"
        v-model.number="localFilters.maxPrice"
        @change="apply"
        class="w-full accent-brand-500 bg-dark-hover cursor-pointer"
      />
      <div class="flex justify-between text-[11px] text-gray-500 font-semibold">
        <span>$50</span>
        <span>$400</span>
      </div>
    </div>

    <!-- Size Filter -->
    <div class="space-y-3 pt-4 border-t border-dark-border">
      <h4 class="text-sm font-bold text-gray-300 uppercase tracking-wider">{{ t('products.filter.size') }}</h4>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="size in SIZES"
          :key="size"
          class="py-2 text-xs font-bold rounded-lg border transition-all"
          :class="localFilters.size === size
            ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/30'
            : 'bg-dark-hover border-dark-border text-gray-400 hover:border-gray-500 hover:text-white'"
          @click="toggleSize(size)"
        >
          {{ size }}
        </button>
      </div>
    </div>

  </aside>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { BRANDS, CATEGORIES, SIZES } from '../../services/mockData.js'

const props = defineProps({
  modelValue: { type: Object, required: true },
})

const emit = defineEmits(['update:modelValue', 'apply'])

const { t } = useI18n()

const localFilters = reactive({ ...props.modelValue })

watch(() => props.modelValue, (newVal) => {
  Object.assign(localFilters, newVal)
}, { deep: true })

function selectCategory(cat) {
  localFilters.category = cat
  apply()
}

function toggleSize(size) {
  localFilters.size = localFilters.size === size ? null : size
  apply()
}

function apply() {
  emit('update:modelValue', { ...localFilters })
  emit('apply')
}

function reset() {
  localFilters.category = 'all'
  localFilters.brand = []
  localFilters.minPrice = 0
  localFilters.maxPrice = 1000
  localFilters.size = null
  apply()
}
</script>
