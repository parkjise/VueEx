<script setup>
import { ref, shallowRef } from 'vue'
import { Copy, Play, RotateCcw } from 'lucide-vue-next'
import AppTabs from '../common/AppTabs.vue'
import CodeEditor from './CodeEditor.vue'
import SandboxFrame from '../preview/SandboxFrame.vue'
import { compileExercise } from '../../utils/compileExercise'
const props = defineProps({ exercise: { type: Object, required: true } })
const tabs = [{ id: 'html', label: 'HTML' }, { id: 'css', label: 'CSS' }, { id: 'javascript', label: 'JavaScript' }, { id: 'vue', label: 'Vue SFC' }]
const active = ref('vue')
const code = ref({ ...props.exercise.starterCode })
const result = shallowRef(null)
const runId = ref(0)
const status = ref('')
function run() {
  try {
    const { html, css, javascript, vue } = code.value
    result.value = active.value === 'vue' ? compileExercise(vue) : { html, css, javascript }
  } catch (error) { result.value = { error: error.message } }
  runId.value += 1
  status.value = result.value.error ? '실행 오류를 확인하세요.' : '실행 결과가 업데이트되었습니다.'
}
function reset() {
  code.value = { ...props.exercise.starterCode }
  result.value = null
  status.value = '시작 코드로 초기화했습니다.'
}
async function copy() {
  try { await navigator.clipboard.writeText(code.value[active.value]); status.value = '코드를 복사했습니다.' }
  catch { status.value = '코드를 복사할 수 없습니다.' }
}
</script>

<template>
  <section class="workspace">
    <h2>실습 에디터</h2>
    <p>Vue SFC 탭은 단독으로 실행됩니다. HTML, CSS, JavaScript 탭은 하나의 결과로 실행됩니다.</p>
    <AppTabs v-model="active" :tabs="tabs" label="편집 언어">
      <CodeEditor v-model="code[active]" :language="active" />
    </AppTabs>
    <div class="workspace__actions">
      <button type="button" class="button button--primary" @click="run"><Play :size="16" /> 실행</button>
      <button type="button" class="button" @click="reset"><RotateCcw :size="16" /> 초기화</button>
      <button type="button" class="button" @click="copy"><Copy :size="16" /> 복사</button>
    </div>
    <p class="workspace__status" role="status">{{ status }}</p>
    <section v-if="result" class="panel workspace__result">
      <header class="panel__header"><h3>실행 결과</h3></header>
      <SandboxFrame :key="runId" :payload="result" title="사용자 실습 실행 결과" />
    </section>
  </section>
</template>
