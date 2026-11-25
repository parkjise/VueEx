<script setup>
import { computed, defineAsyncComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Bookmark, Check, ChevronLeft, ChevronRight, Clock3 } from 'lucide-vue-next'
import { categoryById } from '../../data/categories'
import { exerciseById, exercisePath, inCategory } from '../../data/exercises'
import { useLearningStore } from '../../stores/learning'
import AppEmptyState from '../common/AppEmptyState.vue'
import AppTabs from '../common/AppTabs.vue'
import ExerciseSolution from '../exercises/ExerciseSolution.vue'
import ExerciseExplanation from '../exercises/ExerciseExplanation.vue'
import ExercisePreview from '../preview/ExercisePreview.vue'
import AppSkeleton from '../common/AppSkeleton.vue'
import AppBreadcrumb from '../common/AppBreadcrumb.vue'
import AppBadge from '../common/AppBadge.vue'
import CodeViewer from '../editor/CodeViewer.vue'

const ExerciseWorkspace = defineAsyncComponent({
  loader: () => import('../editor/ExerciseWorkspace.vue'),
  loadingComponent: AppSkeleton,
})
const route = useRoute()
const store = useLearningStore()
const items = computed(() => inCategory(route.params.category))
const index = computed(() => items.value.findIndex(item => item.slug === route.params.slug))
const exercise = computed(() => items.value[index.value])
const category = computed(() => categoryById[route.params.category])
const related = computed(() => exercise.value?.relatedExercises.map(id => exerciseById[id]).filter(Boolean) ?? [])
const views = [{ id: 'task', label: '문제 설명' }, { id: 'starter', label: '시작 코드' }, { id: 'editor', label: '실습 에디터' }, { id: 'solution', label: '정답' }, { id: 'explanation', label: '해설' }]
const starters = [{ id: 'html', label: 'HTML' }, { id: 'css', label: 'CSS' }, { id: 'javascript', label: 'JavaScript' }, { id: 'vue', label: 'Vue SFC' }]
const view = ref('task')
const starter = ref('html')
const mobile = ref('lesson')
const openedEditor = ref(false)
watch(exercise, item => {
  view.value = 'task'; starter.value = 'html'; mobile.value = 'lesson'; openedEditor.value = false
  if (item) store.visit(item.id)
}, { immediate: true })
watch(view, value => { if (value === 'editor') openedEditor.value = true })
</script>
<template>
  <article v-if="exercise" :key="exercise.id">
    <AppBreadcrumb :items="[{ label: '대시보드', to: '/' },
      { label: category.name, to: { name: 'category', params: { category: category.id } } }, { label: exercise.id }]" />
    <header class="exercise-heading">
      <div class="page-heading">
        <h1>{{ exercise.title }}</h1>
        <div class="exercise-meta"><AppBadge :level="exercise.difficulty">{{ exercise.difficulty }}</AppBadge><span class="exercise-meta__time"><Clock3 :size="16" /> {{ exercise.estimatedTime }}분</span></div>
      </div>
      <div class="exercise-heading__actions">
        <button type="button" class="button" :aria-pressed="store.favorites.includes(exercise.id)" @click="store.toggleFavorite(exercise.id)"><Bookmark :size="16" :fill="store.favorites.includes(exercise.id) ? 'currentColor' : 'none'" /> 즐겨찾기</button>
        <button type="button" class="button button--primary" :aria-pressed="store.completed.includes(exercise.id)" @click="store.toggleComplete(exercise.id)"><Check :size="16" /> {{ store.completed.includes(exercise.id) ? '완료 취소' : '학습 완료' }}</button>
      </div>
    </header>
    <div class="exercise-layout__mobile" role="group" aria-label="학습 화면">
      <button class="button" type="button" :aria-pressed="mobile === 'lesson'" @click="mobile = 'lesson'">문제와 코드</button>
      <button class="button" type="button" :aria-pressed="mobile === 'preview'" @click="mobile = 'preview'">UI 미리보기</button>
    </div>
    <div class="exercise-layout">
      <section class="panel exercise-layout__lesson" :data-mobile-active="mobile === 'lesson'">
        <AppTabs v-model="view" :tabs="views" label="실습 내용">
          <div v-if="view === 'task'" class="lesson-copy">
            <h2>문제 설명</h2><p>{{ exercise.description }}</p>
            <h3>요구사항 및 완료 조건</h3><ol><li v-for="item in exercise.requirements" :key="item">{{ item }}</li></ol>
            <h3>실무 활용 사례</h3><p>{{ exercise.scenario }}</p>
            <h3>핵심 키워드</h3><div class="lesson-copy__keywords"><span v-for="keyword in exercise.keywords" :key="keyword" class="badge">{{ keyword }}</span></div>
          </div>
          <div v-if="view === 'starter'" class="lesson-copy">
            <h2>시작 코드</h2>
            <AppTabs v-model="starter" :tabs="starters" label="시작 코드 언어">
              <CodeViewer :source="exercise.starterCode[starter]" :language="starter" />
            </AppTabs>
            <template v-if="exercise.starterCode.mockData"><h3>실습 데이터</h3><CodeViewer :source="JSON.stringify(exercise.starterCode.mockData, null, 2)" language="javascript" /></template>
          </div>
          <ExerciseWorkspace v-if="openedEditor" v-show="view === 'editor'" :exercise="exercise" />
          <ExerciseSolution v-if="view === 'solution'" :exercise="exercise" />
          <ExerciseExplanation v-if="view === 'explanation'" :exercise="exercise" />
        </AppTabs>
      </section>
      <div class="exercise-layout__preview" :data-mobile-active="mobile === 'preview'">
        <ExercisePreview :exercise="exercise" />
        <section v-if="related.length" class="panel related">
          <header class="panel__header"><h2>관련 문제</h2></header>
          <ul><li v-for="item in related" :key="item.id"><RouterLink :to="exercisePath(item)">{{ item.title }}</RouterLink></li></ul>
        </section>
      </div>
    </div>
    <nav class="lesson-nav" aria-label="문제 탐색">
      <RouterLink v-if="items[index - 1]" class="button" :to="exercisePath(items[index - 1])"><ChevronLeft :size="16" /> 이전 문제</RouterLink><span v-else></span>
      <RouterLink v-if="items[index + 1]" class="button" :to="exercisePath(items[index + 1])">다음 문제 <ChevronRight :size="16" /></RouterLink>
    </nav>
  </article>
  <AppEmptyState v-else title="문제를 찾을 수 없습니다"><RouterLink :to="{ name: 'exercises' }" class="button">전체 문제 보기</RouterLink></AppEmptyState>
</template>
