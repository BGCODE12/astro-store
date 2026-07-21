import { defineStore } from 'pinia'
import { ref } from 'vue'

let toastIdCounter = 0

export const useNotificationStore = defineStore('notification', () => {
  const toasts = ref([])

  function show(message, type = 'success', duration = 3500) {
    const id = ++toastIdCounter
    toasts.value.push({ id, message, type, visible: true })

    setTimeout(() => {
      dismiss(id)
    }, duration)

    return id
  }

  function success(message, duration = 3500) {
    return show(message, 'success', duration)
  }

  function error(message, duration = 4000) {
    return show(message, 'error', duration)
  }

  function info(message, duration = 3000) {
    return show(message, 'info', duration)
  }

  function warning(message, duration = 3500) {
    return show(message, 'warning', duration)
  }

  function dismiss(id) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function clearAll() {
    toasts.value = []
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    warning,
    dismiss,
    clearAll,
  }
})
