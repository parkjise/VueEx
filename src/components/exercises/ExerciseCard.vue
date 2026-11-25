<script setup>
import { Bookmark, Check, Clock3, ChevronRight } from 'lucide-vue-next'
import AppBadge from '../common/AppBadge.vue'
import { categoryById } from '../../data/categories'
import { exercisePath } from '../../data/exercises'
import { useLearningStore } from '../../stores/learning'
defineProps({ exercise: { type: Object, required: true }, showDate: { type: Number, default: null } })
const store = useLearningStore()
const date = new Intl.DateTimeFormat('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })
</script>
<template>
  <article class="exercise-card">
    <RouterLink class="exercise-card__main" :to="exercisePath(exercise)">
      <span class="category-icon" :data-color="categoryById[exercise.category].color"><component :is="categoryById[exercise.category].icon" :size="20" /></span>
      <span class="exercise-card__info"><span class="exercise-card__title">{{ exercise.title }}</span><small>{{ showDate ? date.format(showDate) : exercise.description }}</small></span>
      <AppBadge :level="exercise.difficulty">{{ exercise.difficulty }}</AppBadge>
      <span class="exercise-card__time"><Clock3 :size="15" /> {{ exercise.estimatedTime }}분</span>
      <span v-if="store.completed.includes(exercise.id)" class="exercise-card__done" title="학습 완료"><Check :size="17" /><span class="sr-only">학습 완료</span></span>
    </RouterLink>
    <button type="button" class="icon-button" :aria-label="`${exercise.title} 즐겨찾기`" :aria-pressed="store.favorites.includes(exercise.id)" @click="store.toggleFavorite(exercise.id)">
      <Bookmark :size="18" :fill="store.favorites.includes(exercise.id) ? 'currentColor' : 'none'" />
    </button>
    <RouterLink :to="exercisePath(exercise)" class="exercise-card__chevron" :aria-label="`${exercise.title} 열기`" tabindex="-1"><ChevronRight :size="18" /></RouterLink>
  </article>
</template>
