<script setup>
import { onBeforeUnmount, ref, watch } from 'vue'
const props = defineProps({ message: String, sequence: Number })
const visible = ref(false)
let timer
watch([() => props.message, () => props.sequence], ([message]) => {
  clearTimeout(timer)
  visible.value = Boolean(message)
  if (message) timer = setTimeout(() => { visible.value = false }, 2300)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>
<template><div class="app-toast" :data-visible="visible" role="status">{{ visible ? message : '' }}</div></template>
