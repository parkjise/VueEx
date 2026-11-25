<script setup>
import { computed } from 'vue'
import { exercises } from '../../data/exercises'
import { useLearningStore } from '../../stores/learning'

const store = useLearningStore()
const completed = computed(() => exercises.filter(exercise => store.completed.includes(exercise.id)).length)
const percent = computed(() => Math.round(completed.value / (exercises.length || 1) * 100))
</script>
<template>
  <RouterLink :to="{ name: 'history' }" class="sidebar__progress">
    <span><strong>나의 학습 진행률</strong><b>{{ percent }}%</b></span>
    <progress :value="percent" max="100" aria-label="나의 학습 진행률" />
    <small>{{ completed }} / {{ exercises.length }} 문제 완료</small>
  </RouterLink>
</template>
