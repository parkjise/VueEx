<script setup>
import { ChevronRight } from 'lucide-vue-next'
defineProps({ items: { type: Array, required: true } })
</script>
<template>
  <nav class="breadcrumb" aria-label="현재 위치">
    <template v-for="(item, index) in items" :key="item.label">
      <ChevronRight v-if="index" :size="14" aria-hidden="true" />
      <RouterLink v-if="item.to" :to="item.to">{{ item.label }}</RouterLink>
      <span v-else aria-current="page">{{ item.label }}</span>
    </template>
  </nav>
</template>
