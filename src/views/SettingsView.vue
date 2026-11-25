<script setup>
import { Monitor, Moon, Sun } from 'lucide-vue-next'
import { useLearningStore } from '../stores/learning'
const store = useLearningStore()
const modes = [{ id: 'system', label: '시스템 설정', icon: Monitor }, { id: 'light', label: '라이트 모드', icon: Sun }, { id: 'dark', label: '다크 모드', icon: Moon }]
</script>
<template>
  <div class="page-heading"><h1>설정</h1><p>테마와 학습 기록은 현재 브라우저에 저장됩니다.</p></div>
  <section class="panel">
    <header class="panel__header"><h2>화면 테마</h2></header>
    <div class="settings__choices" role="group" aria-label="화면 테마">
      <label v-for="mode in modes" :key="mode.id"><input v-model="store.theme" type="radio" name="theme" :value="mode.id"><component :is="mode.icon" :size="17" />{{ mode.label }}</label>
    </div>
  </section>
</template>
