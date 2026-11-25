<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import SandboxFrame from './SandboxFrame.vue'

const props = defineProps({
  payload: Object, allowDownloads: Boolean, title: String, frameKey: Number, width: Number, height: Number,
})
const viewport = ref()
const available = ref(0)
let observer
const scale = computed(() => Math.min(1, (available.value || props.width) / props.width))
onMounted(() => {
  observer = new ResizeObserver(([entry]) => { available.value = entry.contentRect.width })
  observer.observe(viewport.value)
})
onBeforeUnmount(() => observer?.disconnect())
</script>
<template>
  <div ref="viewport" class="preview__viewport">
    <div class="preview__stage" :style="{ width: width * scale + 'px', height: Math.max(185, height * scale) + 'px' }">
      <SandboxFrame :key="frameKey" :payload="payload" :allow-downloads="allowDownloads" :title="title"
        :style="{ width: width + 'px', height: Math.max(height, 185 / scale) + 'px', transform: `scale(${scale})` }" />
    </div>
  </div>
</template>
