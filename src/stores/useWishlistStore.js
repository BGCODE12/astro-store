import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const WISHLIST_KEY = 'astro_wishlist'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveToStorage(ids) {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
  } catch (e) {
    console.warn('[WishlistStore] localStorage save failed:', e)
  }
}

export const useWishlistStore = defineStore('wishlist', () => {
  const wishlistIds = ref(loadFromStorage())

  const count = computed(() => wishlistIds.value.length)
  const isEmpty = computed(() => wishlistIds.value.length === 0)

  function isWishlisted(productId) {
    return wishlistIds.value.includes(productId)
  }

  function addToWishlist(productId) {
    if (!wishlistIds.value.includes(productId)) {
      wishlistIds.value.push(productId)
      saveToStorage(wishlistIds.value)
    }
  }

  function removeFromWishlist(productId) {
    wishlistIds.value = wishlistIds.value.filter(id => id !== productId)
    saveToStorage(wishlistIds.value)
  }

  function toggleWishlist(productId) {
    if (isWishlisted(productId)) {
      removeFromWishlist(productId)
      return false
    } else {
      addToWishlist(productId)
      return true
    }
  }

  function clearWishlist() {
    wishlistIds.value = []
    saveToStorage([])
  }

  return {
    wishlistIds,
    count,
    isEmpty,
    isWishlisted,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    clearWishlist,
  }
})
