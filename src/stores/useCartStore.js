import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { COUPONS } from '../services/mockData.js'

const CART_KEY = 'astro_cart'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(items) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  } catch (e) {
    console.warn('[CartStore] localStorage save failed:', e)
  }
}

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref(loadFromStorage())
  const isOpen = ref(false)
  const couponCode = ref('')
  const appliedCoupon = ref(null)
  const couponError = ref('')

  // Shipping threshold
  const FREE_SHIPPING_THRESHOLD = 200

  // Getters
  const itemCount = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  const subtotal = computed(() =>
    items.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
  )

  const shippingCost = computed(() =>
    subtotal.value >= FREE_SHIPPING_THRESHOLD ? 0 : 15
  )

  const discount = computed(() => {
    if (!appliedCoupon.value) return 0
    const coupon = appliedCoupon.value
    if (coupon.type === 'percentage') return subtotal.value * coupon.discount
    if (coupon.type === 'fixed') return Math.min(coupon.discount, subtotal.value)
    return 0
  })

  const total = computed(() =>
    Math.max(0, subtotal.value + shippingCost.value - discount.value)
  )

  const isEmpty = computed(() => items.value.length === 0)

  function isInCart(productId, size, color) {
    return items.value.some(
      i => i.id === productId && i.size === size && i.color === color
    )
  }

  // Actions
  function addItem(product, quantity = 1, size = null, color = null) {
    const existingIndex = items.value.findIndex(
      i => i.id === product.id && i.size === size && i.color === color
    )

    if (existingIndex >= 0) {
      items.value[existingIndex].quantity = Math.min(
        items.value[existingIndex].quantity + quantity,
        10 // max per item
      )
    } else {
      items.value.push({
        id: product.id,
        name_ar: product.name_ar,
        name_en: product.name_en,
        brand: product.brand,
        price: product.price,
        image: product.image,
        quantity: Math.min(quantity, 10),
        size,
        color,
      })
    }

    saveToStorage(items.value)
  }

  function removeItem(productId, size, color) {
    items.value = items.value.filter(
      i => !(i.id === productId && i.size === size && i.color === color)
    )
    saveToStorage(items.value)
  }

  function updateQuantity(productId, size, color, quantity) {
    const item = items.value.find(
      i => i.id === productId && i.size === size && i.color === color
    )
    if (item) {
      if (quantity <= 0) {
        removeItem(productId, size, color)
      } else {
        item.quantity = Math.min(quantity, 10)
        saveToStorage(items.value)
      }
    }
  }

  function clearCart() {
    items.value = []
    appliedCoupon.value = null
    couponCode.value = ''
    couponError.value = ''
    saveToStorage([])
  }

  function openCart() { isOpen.value = true }
  function closeCart() { isOpen.value = false }
  function toggleCart() { isOpen.value = !isOpen.value }

  function applyCoupon(code) {
    couponError.value = ''
    const sanitizedCode = code.trim().toUpperCase().substring(0, 20)
    const coupon = COUPONS[sanitizedCode]
    if (coupon) {
      appliedCoupon.value = coupon
      couponCode.value = sanitizedCode
      return true
    } else {
      couponError.value = 'invalid'
      appliedCoupon.value = null
      return false
    }
  }

  function removeCoupon() {
    appliedCoupon.value = null
    couponCode.value = ''
    couponError.value = ''
  }

  return {
    items,
    isOpen,
    couponCode,
    appliedCoupon,
    couponError,
    itemCount,
    subtotal,
    shippingCost,
    discount,
    total,
    isEmpty,
    FREE_SHIPPING_THRESHOLD,
    isInCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    applyCoupon,
    removeCoupon,
  }
})
