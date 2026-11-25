<script setup>
import { ref, watch } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import CodeEditor from './CodeEditor.vue'
import AppToast from '../common/AppToast.vue'
const props = defineProps({ source: { type: String, required: true }, language: { type: String, default: 'vue' } })
const displayed = ref(props.source)
const status = ref('')
const copyCount = ref(0)
watch(() => props.source, value => { displayed.value = value; status.value = '' })
async function copy() {
  copyCount.value++
  try { await navigator.clipboard.writeText(displayed.value); status.value = '복사됨' }
  catch { status.value = '복사할 수 없습니다' }
}
</script>
<template>
  <div class="code-viewer">
    <div class="code-viewer__toolbar"><span>{{ language.toUpperCase() }}</span>
      <button type="button" class="button button--subtle" @click="copy"><component :is="status === '복사됨' ? Check : Copy" :size="15" /> 복사</button>
    </div>
    <CodeEditor v-model="displayed" :language="language" readonly />
    <AppToast :message="status" :sequence="copyCount" />
  </div>
</template>
