<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="uiStore.isSearchOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md"
        @click.self="uiStore.closeSearch()"
      >
        <div class="modal-content w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden">
          <!-- Input Header -->
          <div class="p-4 border-b border-dark-border flex items-center gap-3">
            <i class="fa-solid fa-magnifying-glass text-brand-500 text-lg ml-2"></i>
            <input
              ref="searchInputRef"
              v-model="query"
              type="text"
              :placeholder="t('nav.search')"
              class="w-full bg-transparent text-white font-semibold text-lg focus:outline-none placeholder-gray-500"
              @input="handleSearch"
            />
            <button class="btn-icon" @click="uiStore.closeSearch()">
              <i class="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          <!-- Results / Suggestions -->
          <div class="p-6 max-h-[60vh] overflow-y-auto space-y-4">
            <div v-if="isLoading" class="flex justify-center py-8">
              <i class="fa-solid fa-spinner animate-spin text-brand-500 text-2xl"></i>
            </div>

            <div v-else-if="results.length > 0" class="space-y-3">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">نتائج البحث ({{ results.length }})</p>
              <div
                v-for="product in results"
                :key="product.id"
                class="flex items-center justify-between p-3 rounded-xl bg-dark-hover hover:border-brand-500/30 border border-transparent transition-all cursor-pointer group"
                @click="selectProduct(product.id)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden flex-shrink-0">
                    <img :src="product.image" :alt="uiStore.isRTL ? product.name_ar : product.name_en" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <h4 class="font-bold text-white text-sm group-hover:text-brand-500 transition-colors">
                      {{ uiStore.isRTL ? product.name_ar : product.name_en }}
                    </h4>
                    <p class="text-xs text-gray-400 font-semibold">{{ product.brand }} • {{ product.category }}</p>
                  </div>
                </div>
                <span class="font-black text-brand-500 text-sm">${{ product.price }}</span>
              </div>
            </div>

            <div v-else-if="query.trim().length > 0" class="text-center py-8 text-gray-400 font-semibold">
              <i class="fa-solid fa-ghost text-3xl mb-2 text-gray-600 block"></i>
              <p>{{ t('common.no_results') }} "{{ query }}"</p>
            </div>

            <div v-else class="space-y-3">
              <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">البحوث الشائعة</p>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="tag in ['Phantom X', 'Ultraboost', 'Jordan', 'Nike', 'Puma']"
                  :key="tag"
                  class="chip"
                  @click="query = tag; handleSearch()"
                >
                  {{ tag }}
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
import { ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUiStore } from '../../stores/useUiStore.js'
import productService from '../../services/productService.js'

const { t } = useI18n()
const router = useRouter()
const uiStore = useUiStore()

const query = ref('')
const results = ref([])
const isLoading = ref(false)
const searchInputRef = ref(null)

let debounceTimer = null

watch(() => uiStore.isSearchOpen, (isOpen) => {
  if (isOpen) {
    query.value = ''
    results.value = []
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
})

function handleSearch() {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) {
    results.value = []
    isLoading.value = false
    return
  }

  isLoading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      results.value = await productService.getProducts({ query: query.value })
    } catch (err) {
      console.error(err)
    } finally {
      isLoading.value = false
    }
  }, 300)
}

function selectProduct(id) {
  uiStore.closeSearch()
  router.push(`/products/${id}`)
}
</script>
