import api from './api.js'
import PRODUCTS from './mockData.js'

// Simple LocalStorage persistence for admin modifications
const CUSTOM_PRODUCTS_KEY = 'astro_custom_products'

function getStoredProducts() {
  try {
    const raw = localStorage.getItem(CUSTOM_PRODUCTS_KEY)
    return raw ? JSON.parse(raw) : PRODUCTS
  } catch {
    return PRODUCTS
  }
}

function saveStoredProducts(list) {
  try {
    localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('Failed to save products:', e)
  }
}

let activeProducts = getStoredProducts()

const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000

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

function clearCache() {
  cache.clear()
}

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const productService = {
  async getProducts(filters = {}) {
    await delay(300)
    let results = [...activeProducts]

    if (filters.category && filters.category !== 'all') {
      results = results.filter(p => p.category === filters.category)
    }
    if (filters.brand && filters.brand.length) {
      results = results.filter(p => filters.brand.includes(p.brand))
    }
    if (filters.minPrice !== undefined) {
      results = results.filter(p => p.price >= filters.minPrice)
    }
    if (filters.maxPrice !== undefined) {
      results = results.filter(p => p.price <= filters.maxPrice)
    }
    if (filters.size) {
      results = results.filter(p => p.sizes.includes(filters.size))
    }
    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(p =>
        p.name_ar.includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.includes(q)
      )
    }

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
        results.sort((a, b) => b.id - a.id)
    }

    return results
  },

  async getProduct(id) {
    await delay(300)
    const product = activeProducts.find(p => p.id === Number(id))
    if (!product) throw new Error(`Product ${id} not found`)
    return product
  },

  async getFeaturedProducts() {
    await delay(300)
    return activeProducts.filter(p => p.isFeatured)
  },

  async getTrending() {
    await delay(300)
    return [...activeProducts]
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 4)
  },

  async getRelated(productId, category) {
    await delay(300)
    return activeProducts
      .filter(p => p.category === category && p.id !== productId)
      .slice(0, 4)
  },

  async addProduct(newProduct) {
    await delay(400)
    const id = Date.now()
    const product = {
      id,
      rating: 5.0,
      reviewCount: 1,
      badge: 'new',
      sizes: newProduct.sizes || [40, 41, 42, 43],
      colors: newProduct.colors || ['#111111', '#ff6633'],
      images: [newProduct.image],
      description_ar: newProduct.description_ar || newProduct.name_ar,
      description_en: newProduct.description_en || newProduct.name_en,
      features_ar: ['خفيف الوزن', 'جودة عالية'],
      features_en: ['Lightweight', 'Premium Quality'],
      isFeatured: true,
      ...newProduct,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock || 10),
    }
    activeProducts.unshift(product)
    saveStoredProducts(activeProducts)
    clearCache()
    return product
  },

  async updateProduct(id, updatedData) {
    await delay(400)
    const index = activeProducts.findIndex(p => p.id === Number(id))
    if (index !== -1) {
      activeProducts[index] = {
        ...activeProducts[index],
        ...updatedData,
        price: Number(updatedData.price),
        stock: Number(updatedData.stock),
      }
      saveStoredProducts(activeProducts)
      clearCache()
      return activeProducts[index]
    }
    throw new Error('Product not found')
  },

  async deleteProduct(id) {
    await delay(400)
    activeProducts = activeProducts.filter(p => p.id !== Number(id))
    saveStoredProducts(activeProducts)
    clearCache()
    return true
  },

  async subscribeNewsletter(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) throw new Error('Invalid email address')
    await delay(400)
    return { success: true, email }
  },

  clearCache,
}

export default productService
