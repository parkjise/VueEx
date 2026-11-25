<script setup>
import { ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
const open = defineModel({ type: Boolean, required: true })
defineProps({ title: { type: String, required: true } })
const dialog = ref()
watch([open, dialog], ([value, element]) => {
  if (value && element && !element.open) element.showModal()
  if (!value && element?.open) element.close()
}, { flush: 'post' })
</script>

<template>
  <dialog ref="dialog" class="modal" :aria-label="title" @close="open = false">
    <header class="modal__header"><h2>{{ title }}</h2>
      <button type="button" class="icon-button" aria-label="닫기" @click="open = false"><X :size="20" /></button>
    </header>
    <slot v-if="open" />
  </dialog>
</template>
