<script setup>
import { Bookmark, BookOpen, Clock3, CodeXml, LayoutDashboard, Settings, X } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { categories } from '../../data/categories'
import { exercisePath, inCategory } from '../../data/exercises'
import LearningProgress from '../dashboard/LearningProgress.vue'

const emit = defineEmits(['close'])
defineProps({ mobile: Boolean })
const route = useRoute()
const neighbors = computed(() => {
  if (route.name !== 'exercise') return []
  const items = inCategory(route.params.category)
  const position = items.findIndex(item => item.slug === route.params.slug)
  return position >= 0 ? items.slice(Math.max(0, position - 1), position + 2) : []
})
const sections = [
  { label: '학습', links: [{ name: 'dashboard', label: '대시보드', icon: LayoutDashboard }, { name: 'exercises', label: '전체 문제', icon: BookOpen }] },
  { label: '내 학습', links: [{ name: 'favorites', label: '즐겨찾기', icon: Bookmark }, { name: 'history', label: '학습 기록', icon: Clock3 }, { name: 'settings', label: '설정', icon: Settings }] },
]
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <RouterLink class="brand" to="/" @click="emit('close')">
        <span class="brand__mark"><CodeXml :size="23" :stroke-width="2.4" /></span>
        <span><strong>Vue<span>Ex</span></strong><small>실무 코딩 연습실</small></span>
      </RouterLink>
      <button v-if="mobile" class="icon-button" aria-label="메뉴 닫기" type="button" @click="emit('close')"><X :size="20" /></button>
    </div>
    <nav class="sidebar__nav" aria-label="주 메뉴">
      <div v-for="(section, index) in sections" :key="section.label" :class="{ 'sidebar__personal': index === 1 }">
        <p class="sidebar__label">{{ section.label }}</p>
        <RouterLink v-for="link in section.links" :key="link.name" class="sidebar__link" :to="{ name: link.name }" @click="emit('close')">
          <component :is="link.icon" :size="18" /><span>{{ link.label }}</span>
        </RouterLink>
      </div>
      <div class="sidebar__categories">
        <p class="sidebar__label">카테고리</p>
        <template v-for="category in categories" :key="category.id">
          <RouterLink class="sidebar__link" :class="{ 'sidebar__link--parent': neighbors.length && route.params.category === category.id }"
            :to="{ name: 'category', params: { category: category.id } }" @click="emit('close')">
            <component :is="category.icon" :size="17" /><span>{{ category.name }}</span>
          </RouterLink>
          <div v-if="route.params.category === category.id && neighbors.length" class="sidebar__lessons">
            <RouterLink v-for="exercise in neighbors" :key="exercise.id" class="sidebar__link" :to="exercisePath(exercise)" @click="emit('close')">{{ exercise.title }}</RouterLink>
          </div>
        </template>
      </div>
    </nav>
    <LearningProgress @click="emit('close')" />
  </aside>
</template>
