<template>
  <!-- Toast Container -->
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 items-center w-full max-w-sm px-4 pointer-events-none">
    <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3 w-full items-center">
      <div
        v-for="toast in notificationStore.toasts"
        :key="toast.id"
        class="w-full pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md cursor-pointer select-none"
        :class="toastClasses(toast.type)"
        @click="notificationStore.dismiss(toast.id)"
      >
        <!-- Icon -->
        <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm" :class="iconBgClass(toast.type)">
          <i :class="iconClass(toast.type)"></i>
        </div>
        <!-- Message -->
        <p class="flex-1 text-sm font-semibold text-white">{{ toast.message }}</p>
        <!-- Close hint -->
        <i class="fa-solid fa-xmark text-white/40 text-xs flex-shrink-0"></i>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useNotificationStore } from '../../stores/useNotificationStore.js'

const notificationStore = useNotificationStore()

function toastClasses(type) {
  const map = {
    success: 'bg-dark-card/90 border-green-500/30',
    error: 'bg-dark-card/90 border-red-500/30',
    info: 'bg-dark-card/90 border-blue-500/30',
    warning: 'bg-dark-card/90 border-yellow-500/30',
  }
  return map[type] || map.success
}

function iconBgClass(type) {
  const map = {
    success: 'bg-green-500/20 text-green-400',
    error: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
  }
  return map[type] || map.success
}

function iconClass(type) {
  const map = {
    success: 'fa-solid fa-circle-check',
    error: 'fa-solid fa-circle-xmark',
    info: 'fa-solid fa-circle-info',
    warning: 'fa-solid fa-triangle-exclamation',
  }
  return map[type] || map.success
}
</script>
