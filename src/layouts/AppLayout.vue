<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '../components/layout/AppHeader.vue'
import AppSidebar from '../components/layout/AppSidebar.vue'
import AppSearch from '../components/common/AppSearch.vue'
const openSearch = ref(false)
const drawer = ref()
const route = useRoute()
function closeMenu() { if (drawer.value?.open) drawer.value.close() }
watch(() => route.fullPath, closeMenu)
</script>

<template>
  <a href="#main-content" class="skip-link" @click.prevent="$refs.main.focus()">본문으로 건너뛰기</a>
  <div class="app-shell">
    <div class="app-shell__sidebar"><AppSidebar /></div>
    <div class="app-shell__content">
      <AppHeader @menu="drawer?.showModal()" @search="openSearch = true" />
      <main id="main-content" ref="main" class="app-main" tabindex="-1"><RouterView /></main>
      <footer class="app-footer"><span>VueEx</span><span>Vue 3 실무 코딩 연습실</span></footer>
    </div>
  </div>
  <dialog ref="drawer" class="sidebar-drawer" aria-label="탐색 메뉴"><AppSidebar mobile @close="closeMenu" /></dialog>
  <AppSearch v-model="openSearch" />
</template>
