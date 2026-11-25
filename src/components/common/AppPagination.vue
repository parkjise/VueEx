<script setup>
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import AppButton from './AppButton.vue'
const page = defineModel({ type: Number, required: true })
defineProps({ pages: { type: Number, required: true } })
</script>
<template>
  <nav v-if="pages > 1" class="pagination" aria-label="페이지 탐색">
    <AppButton :disabled="page === 1" @click="page--"><ChevronLeft :size="16" /> 이전</AppButton>
    <span aria-live="polite">{{ page }} / {{ pages }}</span>
    <AppButton :disabled="page === pages" @click="page++">다음 <ChevronRight :size="16" /></AppButton>
  </nav>
</template>
