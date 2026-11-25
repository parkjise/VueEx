<script setup>
import { computed, ref } from 'vue'
import { Maximize2, Monitor, RotateCcw, Smartphone, Tablet } from 'lucide-vue-next'
import AppModal from '../common/AppModal.vue'
import AppTooltip from '../common/AppTooltip.vue'
import PreviewViewport from './PreviewViewport.vue'
import { compileExercise } from '../../utils/compileExercise'
const props = defineProps({ exercise: { type: Object, required: true } })
const sizes = [
  { id: 'desktop', label: '데스크톱', icon: Monitor, width: 768, height: 380 },
  { id: 'tablet', label: '태블릿', icon: Tablet, width: 580, height: 420 },
  { id: 'mobile', label: '모바일', icon: Smartphone, width: 375, height: 470 },
]
const selected = ref(sizes[0])
const key = ref(0)
const fullscreen = ref(false)
const payload = computed(() => {
  try { return compileExercise(props.exercise.previewSource ?? props.exercise.solutions.compositionApi) }
  catch (error) { return { error: error.message } }
})
</script>
<template>
  <section class="panel preview">
    <header class="panel__header preview__header">
      <div><h2>UI 미리보기</h2><p>완성된 화면을 직접 조작해 보세요.</p></div>
      <div class="preview__actions">
        <AppTooltip label="초기화"><button class="icon-button" type="button" aria-label="미리보기 초기화" @click="key += 1"><RotateCcw :size="17" /></button></AppTooltip>
        <AppTooltip label="전체 화면"><button class="icon-button" type="button" aria-label="전체 화면으로 보기" @click="fullscreen = true"><Maximize2 :size="17" /></button></AppTooltip>
      </div>
    </header>
    <div class="preview__devices" role="group" aria-label="미리보기 화면 크기">
      <button v-for="size in sizes" :key="size.id" type="button" class="button button--subtle" :aria-pressed="size.id === selected.id" @click="selected = size">
        <component :is="size.icon" :size="16" /> {{ size.label }}
      </button>
    </div>
    <PreviewViewport :frame-key="key" :payload="payload" :allow-downloads="exercise.allowDownloads" :title="exercise.title + ' 완성 화면'"
      :width="selected.width" :height="selected.height" />
    <AppModal v-model="fullscreen" :title="exercise.title + ' 미리보기'">
      <PreviewViewport :payload="payload" :allow-downloads="exercise.allowDownloads" :title="exercise.title + ' 전체 화면'"
        :width="selected.width" :height="selected.height" />
    </AppModal>
  </section>
</template>
