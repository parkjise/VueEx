<script setup>
import { BookOpen } from 'lucide-vue-next'
defineProps({ title: String, description: String })
</script>
<template>
  <div class="empty-state">
    <span class="category-icon" data-color="mint"><BookOpen :size="21" /></span>
    <strong>{{ title }}</strong>
    <p v-if="description">{{ description }}</p>
    <slot />
  </div>
</template>
