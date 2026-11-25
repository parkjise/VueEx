<script setup>
import { watchEffect } from 'vue'
import AppLayout from './layouts/AppLayout.vue'
import { useLearningStore } from './stores/learning'

const store = useLearningStore()
watchEffect(() => {
  document.documentElement.dataset.theme = store.resolvedTheme
})
</script>

<template><AppLayout /></template>
