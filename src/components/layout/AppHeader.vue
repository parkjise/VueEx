<script setup>
import { Menu, Moon, Search, Sun } from 'lucide-vue-next'
import { onMounted, onUnmounted } from 'vue'
import { useLearningStore } from '../../stores/learning'
const store = useLearningStore()
const emit = defineEmits(['search', 'menu'])
const isMac = /Mac|iPhone|iPad/.test(navigator.platform)
function shortcut(event) {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    emit('search')
  }
}
onMounted(() => window.addEventListener('keydown', shortcut))
onUnmounted(() => window.removeEventListener('keydown', shortcut))
</script>
<template>
  <header class="app-header">
    <button class="icon-button app-header__menu" type="button" aria-label="메뉴 열기" @click="emit('menu')"><Menu :size="23" /></button>
    <button class="app-header__search" type="button" @click="emit('search')">
      <Search :size="19" /><span>문제, 키워드 검색</span><kbd>{{ isMac ? '⌘' : 'Ctrl' }} K</kbd>
    </button>
    <button class="icon-button app-header__theme" type="button" :aria-label="store.resolvedTheme === 'dark' ? '라이트 모드로 변경' : '다크 모드로 변경'"
      @click="store.theme = store.resolvedTheme === 'dark' ? 'light' : 'dark'">
      <Sun v-if="store.resolvedTheme === 'dark'" :size="20" /><Moon v-else :size="20" />
    </button>
    <RouterLink class="app-header__avatar" :to="{ name: 'settings' }" aria-label="학습 설정">V</RouterLink>
  </header>
</template>
