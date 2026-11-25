<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categoryById } from '../data/categories'
import { exerciseById, exercises, inCategory, searchExercises } from '../data/exercises'
import { useLearningStore } from '../stores/learning'
import AppBreadcrumb from '../components/common/AppBreadcrumb.vue'
import AppCard from '../components/common/AppCard.vue'
import AppPagination from '../components/common/AppPagination.vue'
import ExerciseList from '../components/exercises/ExerciseList.vue'
import ExerciseFilter from '../components/exercises/ExerciseFilter.vue'
import AppEmptyState from '../components/common/AppEmptyState.vue'
const route = useRoute()
const store = useLearningStore()
const query = ref('')
const level = ref('')
const categoryFilter = ref('')
const status = ref('')
const page = ref(1)
const pageSize = 16
const currentCategory = computed(() => categoryById[route.params.category])
const title = computed(() => ({
  exercises: '전체 문제', category: currentCategory.value?.name ?? '카테고리를 찾을 수 없습니다',
  favorites: '즐겨찾기', history: '학습 기록', search: '통합 검색', 'not-found': '페이지를 찾을 수 없습니다',
}[route.name]))
const subtitle = computed(() => ({
  exercises: '주제와 난이도를 선택해서 풀고 싶은 실습을 찾아보세요.',
  category: currentCategory.value?.description,
  favorites: '다시 풀고 싶은 문제를 한곳에서 확인하세요.',
  history: '최근에 열어 본 문제와 완료 여부를 확인하세요.',
  search: route.query.q ? `“${route.query.q}” 검색 결과` : '문제 이름 또는 키워드로 검색하세요.',
}[route.name]))
const items = computed(() => {
  if (route.name === 'category') return inCategory(route.params.category)
  if (route.name === 'favorites') return store.favorites.map(id => exerciseById[id]).filter(Boolean)
  if (route.name === 'history') return store.history.map(item => exerciseById[item.id]).filter(Boolean)
  if (route.name === 'not-found') return []
  return exercises
})
const historyDates = computed(() => Object.fromEntries(store.history.map(item => [item.id, item.at])))
const filtered = computed(() => {
  const matching = new Set(searchExercises(query.value).map(exercise => exercise.id))
  return items.value.filter(exercise => matching.has(exercise.id)
    && (!level.value || exercise.difficulty === level.value)
    && (!categoryFilter.value || exercise.category === categoryFilter.value)
    && (!status.value || store.completed.includes(exercise.id) === (status.value === 'done')))
})
const pages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))
const visible = computed(() => filtered.value.slice((page.value - 1) * pageSize, page.value * pageSize))
watch(() => route.fullPath, () => {
  query.value = route.name === 'search' ? String(route.query.q ?? '') : ''
  level.value = ''; categoryFilter.value = ''; status.value = ''; page.value = 1
}, { immediate: true })
watch([query, level, categoryFilter, status], () => { page.value = 1 })
watch(pages, max => { page.value = Math.min(page.value, max) })
</script>

<template>
  <section>
    <AppBreadcrumb :items="[{ label: '대시보드', to: '/' }, { label: title }]" />
    <div class="page-heading"><h1>{{ title }}</h1><p v-if="subtitle">{{ subtitle }}</p></div>
    <AppCard as="div">
      <ExerciseFilter v-if="route.name !== 'not-found'" v-model:query="query" v-model:level="level" v-model:category="categoryFilter"
        v-model:status="status" :fixed-category="route.name === 'category'" />
      <p v-if="route.name !== 'not-found'" class="catalog-count" role="status">{{ filtered.length }}문제<span v-if="currentCategory"> · 카테고리 제작 목표 {{ currentCategory.goal }}문제</span></p>
      <ExerciseList :items="visible" :history-dates="route.name === 'history' ? historyDates : undefined" />
      <AppEmptyState v-if="!visible.length" :title="items.length ? '조건에 맞는 문제가 없습니다' : '표시할 문제가 없습니다'">
        <RouterLink :to="{ name: 'exercises' }" class="button">전체 문제 보기</RouterLink>
      </AppEmptyState>
      <AppPagination v-model="page" :pages="pages" />
    </AppCard>
  </section>
</template>
