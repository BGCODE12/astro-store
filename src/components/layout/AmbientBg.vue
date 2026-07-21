<template>
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
    <!-- Orange blob - top right -->
    <div class="ambient-blob w-96 h-96 bg-brand-500/20 top-0 right-0 animation-delay-0"></div>
    <!-- Purple blob - top left -->
    <div class="ambient-blob w-72 h-72 bg-purple-600/15 top-40 left-10" style="animation-delay: 2s;"></div>
    <!-- Orange blob - bottom center -->
    <div class="ambient-blob w-80 h-80 bg-brand-600/15 -bottom-8 left-40" style="animation-delay: 4s;"></div>
    <!-- Grid overlay -->
    <div class="absolute inset-0 grid-overlay opacity-60"></div>
  </div>
</template>

<script setup>
// Static decorative component - no logic needed
</script>
