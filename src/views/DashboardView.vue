<script setup>
import { computed } from 'vue'
import { ArrowUpRight, BookOpen, Bookmark, Check, ChevronRight, CircleCheck, Clock3, CodeXml, Flame, Target } from 'lucide-vue-next'
import { categories } from '../data/categories'
import { exerciseById, exercisePath, exercises, inCategory } from '../data/exercises'
import { useLearningStore } from '../stores/learning'
import ExerciseCard from '../components/exercises/ExerciseCard.vue'
import AppEmptyState from '../components/common/AppEmptyState.vue'
const store = useLearningStore()
const done = computed(() => exercises.filter(exercise => store.completed.includes(exercise.id)).length)
const progress = computed(() => Math.round(done.value / (exercises.length || 1) * 100))
const last = computed(() => store.history.map(item => exerciseById[item.id]).find(exercise => exercise && !store.completed.includes(exercise.id)))
const recommended = computed(() => ['UI-01','HTML-01','CSS-01','UI-08'].map(id => exerciseById[id]).filter(Boolean))
const recent = computed(() => store.history.filter(item => exerciseById[item.id]).slice(0, 3))
const favorites = computed(() => store.favorites.map(id => exerciseById[id]).filter(Boolean).slice(0, 3))
const tracks = computed(() => categories.map(category => {
  const items = inCategory(category.id)
  return { ...category, count: items.length, done: items.filter(exercise => store.completed.includes(exercise.id)).length }
}))
const stats = computed(() => [
  { label: '전체 문제', number: exercises.length, unit: '문제', icon: BookOpen, color: 'blue', description: '지금 풀 수 있는 문제' },
  { label: '학습 완료', number: done.value, unit: '문제', icon: CircleCheck, color: 'mint', description: '완료 표시한 문제' },
  { label: '학습 진행률', number: progress.value, unit: '%', icon: Target, color: 'violet', progress: progress.value },
  { label: '즐겨찾기', number: store.favorites.filter(id => exerciseById[id]).length, unit: '문제', icon: Bookmark, color: 'peach', description: '다시 보고 싶은 문제' },
])
</script>

<template>
  <div class="dashboard">
    <div class="page-heading"><h1>대시보드</h1><p>학습 현황을 확인하고, 다음 실습을 시작하세요.</p></div>
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__content">
        <p class="hero__eyebrow"><CodeXml :size="17" /> Vue 3 실무 플레이그라운드</p>
        <h2 id="hero-title">직접 만들면서 배우는<br><em>Vue 3 실무 코딩</em></h2>
        <p>완성된 UI를 살펴보고 코드를 직접 실행해 보세요.<br>탭 메뉴부터 실무 프로젝트까지, 한 문제씩 연습합니다.</p>
        <div class="hero__actions">
          <RouterLink v-if="last" :to="exercisePath(last)" class="button button--primary">이어서 학습하기</RouterLink>
          <RouterLink v-else :to="{ name: 'category', params: { category: 'ui' } }" class="button button--primary">실습 시작하기</RouterLink>
          <RouterLink :to="{ name: 'exercises' }" class="button hero__secondary">전체 문제 보기</RouterLink>
        </div>
      </div>
      <div class="hero-code" aria-hidden="true">
        <div class="hero-code__bar"><span class="hero-code__lights"><i></i><i></i><i></i></span><span>App.vue</span><CodeXml :size="16" /></div>
        <div class="hero-code__editor">
          <div><b>01</b><span class="syntax--green">&lt;script setup&gt;</span></div>
          <div><b>02</b><span><i>import</i> { ref } <i>from</i> <em>'vue'</em></span></div>
          <div><b>03</b></div>
          <div><b>04</b><span><i>const</i> progress = <strong>ref</strong>(<em>0</em>)</span></div>
          <div><b>05</b><span><i>const</i> practice = () =&gt; progress.value++</span></div>
          <div><b>06</b><span class="syntax--green">&lt;/script&gt;</span></div>
        </div>
        <div class="hero-code__status"><span><Check :size="15" /> Ready to practice</span><span>Vue 3</span></div>
      </div>
    </section>
    <section class="stat-grid" aria-label="학습 통계">
      <article v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-card__label"><span class="category-icon" :data-color="stat.color"><component :is="stat.icon" :size="19" /></span>{{ stat.label }}</div>
        <strong>{{ stat.number }}<small>{{ stat.unit }}</small></strong>
        <progress v-if="stat.progress !== undefined" :value="stat.progress" max="100" aria-label="학습 진행률" />
        <p v-else>{{ stat.description }}</p>
      </article>
    </section>
    <div class="section-header"><div><h2>학습 카테고리</h2><p>관심 있는 주제를 골라 실습을 시작하세요.</p></div><RouterLink :to="{ name: 'exercises' }">전체 문제 <ChevronRight :size="17" /></RouterLink></div>
    <section class="track-grid" aria-label="학습 카테고리">
      <RouterLink v-for="track in tracks" :key="track.id" class="track-card" :to="{ name: 'category', params: { category: track.id } }">
        <div class="track-card__top"><span class="category-icon" :data-color="track.color"><component :is="track.icon" :size="21" /></span><ArrowUpRight :size="18" /></div>
        <h3>{{ track.name }}</h3><p>{{ track.description }}</p>
        <div class="track-card__bottom"><span>{{ track.count }}문제</span><span>{{ track.done }} 완료</span></div>
        <progress :value="track.done" :max="track.count || 1" :aria-label="`${track.name} 진행률`" />
      </RouterLink>
    </section>
    <div class="dashboard__columns">
      <section class="panel">
        <header class="panel__header"><h2><Flame :size="19" /> 추천 문제</h2></header>
        <ExerciseCard v-for="exercise in recommended" :key="exercise.id" :exercise="exercise" />
      </section>
      <section class="panel">
        <header class="panel__header panel__header--split"><h2><Clock3 :size="19" /> 최근 학습</h2><RouterLink :to="{ name: 'history' }">전체 보기</RouterLink></header>
        <ExerciseCard v-for="item in recent" :key="item.id" :exercise="exerciseById[item.id]" :show-date="item.at" />
        <AppEmptyState v-if="!recent.length" title="최근 학습 기록이 없습니다" description="문제를 열면 여기에 표시됩니다." />
      </section>
    </div>
    <section class="panel">
      <header class="panel__header panel__header--split"><h2><Bookmark :size="19" /> 즐겨찾기</h2><RouterLink :to="{ name: 'favorites' }">전체 보기</RouterLink></header>
      <ExerciseCard v-for="exercise in favorites" :key="exercise.id" :exercise="exercise" />
      <AppEmptyState v-if="!favorites.length" title="저장한 문제가 없습니다" description="다시 풀어 보고 싶은 문제를 저장하세요." />
    </section>
  </div>
</template>
