import api from './api.js'
import PRODUCTS from './mockData.js'

// =======================================================
// SIMPLE IN-MEMORY CACHE
// =======================================================
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

// =======================================================
// MOCK DELAY SIMULATOR (mimics network latency)
// =======================================================
function delay(ms = 600) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// =======================================================
// PRODUCT SERVICE
// =======================================================
export const productService = {

  /**
   * Fetch all products (with optional filters)
   */
  async getProducts(filters = {}) {
    const cacheKey = `products:${JSON.stringify(filters)}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    await delay(700)

    let results = [...PRODUCTS]

    // Filter by category
    if (filters.category && filters.category !== 'all') {
      results = results.filter(p => p.category === filters.category)
    }

    // Filter by brand
    if (filters.brand && filters.brand.length) {
      results = results.filter(p => filters.brand.includes(p.brand))
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice)
    }

    // Filter by size
    if (filters.size) {
      results = results.filter(p => p.sizes.includes(filters.size))
    }

    // Search query
    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(p =>
        p.name_ar.includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.includes(q)
      )
    }

    // Sort
    switch (filters.sort) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        results.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        results.sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
        results.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case 'newest':
      default:
        results.sort((a, b) => a.id - b.id)
    }

    setCache(cacheKey, results)
    return results
  },

  /**
   * Fetch a single product by ID
   */
  async getProduct(id) {
    const cacheKey = `product:${id}`
    const cached = getCached(cacheKey)
    if (cached) return cached

    await delay(500)
    const product = PRODUCTS.find(p => p.id === Number(id))
    if (!product) throw new Error(`Product ${id} not found`)

    setCache(cacheKey, product)
    return product
  },

  /**
   * Fetch featured products for Hero/Home page
   */
  async getFeaturedProducts() {
    const cacheKey = 'products:featured'
    const cached = getCached(cacheKey)
    if (cached) return cached

    await delay(500)
    const featured = PRODUCTS.filter(p => p.isFeatured)
    setCache(cacheKey, featured)
    return featured
  },

  /**
   * Fetch trending/best-seller products
   */
  async getTrending() {
    const cacheKey = 'products:trending'
    const cached = getCached(cacheKey)
    if (cached) return cached

    await delay(400)
    const trending = [...PRODUCTS]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 4)
    setCache(cacheKey, trending)
    return trending
  },

  /**
   * Fetch related products (same category, exclude current)
   */
  async getRelated(productId, category) {
    await delay(400)
    return PRODUCTS
      .filter(p => p.category === category && p.id !== productId)
      .slice(0, 4)
  },

  /**
   * Simulate subscribe to newsletter
   */
  async subscribeNewsletter(email) {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email address')
    }
    await delay(800)
    return { success: true, email }
  },

  /**
   * Clear cache (for dev/debug)
   */
  clearCache() {
    cache.clear()
  },
}

export default productService
