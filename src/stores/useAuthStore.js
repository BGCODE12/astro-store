import { defineStore } from 'pinia'
import { ref } from 'vue'

const ADMIN_AUTH_KEY = 'astro_admin_authenticated'
const PASSCODES = ['1234', 'astro2026', 'admin']

export const useAuthStore = defineStore('auth', () => {
  const isAdminAuthenticated = ref(
    sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true' ||
    localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
  )

  function loginWithPasscode(passcode, remember = false) {
    const cleanCode = String(passcode).trim().toLowerCase()
    if (PASSCODES.includes(cleanCode)) {
      isAdminAuthenticated.value = true
      if (remember) {
        localStorage.setItem(ADMIN_AUTH_KEY, 'true')
      } else {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true')
      }
      return true
    }
    return false
  }

  function logoutAdmin() {
    isAdminAuthenticated.value = false
    sessionStorage.removeItem(ADMIN_AUTH_KEY)
    localStorage.removeItem(ADMIN_AUTH_KEY)
  }

  return {
    isAdminAuthenticated,
    loginWithPasscode,
    logoutAdmin,
  }
})
