import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import productService from '../services/productService.js'

export const useProductStore = defineStore('products', () => {
  // State
  const products = ref([])
  const featured = ref([])
  const trending = ref([])
  const currentProduct = ref(null)
  const relatedProducts = ref([])
  const isLoading = ref(false)
  const isLoadingProduct = ref(false)
  const error = ref(null)
  const quickViewProduct = ref(null)

  // Filters state
  const filters = ref({
    category: 'all',
    brand: [],
    minPrice: 0,
    maxPrice: 1000,
    size: null,
    query: '',
    sort: 'newest',
  })

  // Getters
  const filteredProducts = computed(() => products.value)
  const hasProducts = computed(() => products.value.length > 0)
  const productCount = computed(() => products.value.length)

  // Actions
  async function fetchProducts(customFilters = {}) {
    isLoading.value = true
    error.value = null
    try {
      const activeFilters = { ...filters.value, ...customFilters }
      products.value = await productService.getProducts(activeFilters)
    } catch (err) {
      error.value = err.message || 'Failed to fetch products'
      console.error('[ProductStore] fetchProducts error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchFeatured() {
    try {
      featured.value = await productService.getFeaturedProducts()
    } catch (err) {
      console.error('[ProductStore] fetchFeatured error:', err)
    }
  }

  async function fetchTrending() {
    isLoading.value = true
    try {
      trending.value = await productService.getTrending()
    } catch (err) {
      console.error('[ProductStore] fetchTrending error:', err)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchProduct(id) {
    isLoadingProduct.value = true
    currentProduct.value = null
    error.value = null
    try {
      currentProduct.value = await productService.getProduct(id)
      // Also load related
      relatedProducts.value = await productService.getRelated(
        currentProduct.value.id,
        currentProduct.value.category
      )
    } catch (err) {
      error.value = err.message || 'Product not found'
      console.error('[ProductStore] fetchProduct error:', err)
    } finally {
      isLoadingProduct.value = false
    }
  }

  function setFilter(key, value) {
    filters.value[key] = value
  }

  function resetFilters() {
    filters.value = {
      category: 'all',
      brand: [],
      minPrice: 0,
      maxPrice: 1000,
      size: null,
      query: '',
      sort: 'newest',
    }
  }

  function openQuickView(product) {
    quickViewProduct.value = product
  }

  function closeQuickView() {
    quickViewProduct.value = null
  }

  return {
    products,
    featured,
    trending,
    currentProduct,
    relatedProducts,
    isLoading,
    isLoadingProduct,
    error,
    quickViewProduct,
    filters,
    filteredProducts,
    hasProducts,
    productCount,
    fetchProducts,
    fetchFeatured,
    fetchTrending,
    fetchProduct,
    setFilter,
    resetFilters,
    openQuickView,
    closeQuickView,
  }
})
