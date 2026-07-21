import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { i18n } from '../i18n/index.js'

export const useUiStore = defineStore('ui', () => {
  const isSearchOpen = ref(false)
  const isMobileMenuOpen = ref(false)

  // Language management
  const currentLocale = ref(localStorage.getItem('astro_locale') || 'ar')

  const isRTL = computed(() => currentLocale.value === 'ar')

  function setLocale(locale) {
    currentLocale.value = locale
    i18n.global.locale.value = locale
    localStorage.setItem('astro_locale', locale)

    // Update document direction and language
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    document.body.classList.toggle('lang-en', locale === 'en')
  }

  function toggleLocale() {
    setLocale(currentLocale.value === 'ar' ? 'en' : 'ar')
  }

  function openSearch() { isSearchOpen.value = true }
  function closeSearch() { isSearchOpen.value = false }
  function toggleSearch() { isSearchOpen.value = !isSearchOpen.value }

  function openMobileMenu() { isMobileMenuOpen.value = true }
  function closeMobileMenu() { isMobileMenuOpen.value = false }
  function toggleMobileMenu() { isMobileMenuOpen.value = !isMobileMenuOpen.value }

  // Initialize document direction on store creation
  function init() {
    setLocale(currentLocale.value)
  }

  return {
    isSearchOpen,
    isMobileMenuOpen,
    currentLocale,
    isRTL,
    setLocale,
    toggleLocale,
    openSearch,
    closeSearch,
    toggleSearch,
    openMobileMenu,
    closeMobileMenu,
    toggleMobileMenu,
    init,
  }
})
