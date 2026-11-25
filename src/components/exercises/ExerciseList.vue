<script setup>
import ExerciseCard from './ExerciseCard.vue'
defineProps({ items: { type: Array, required: true }, historyDates: Object })
</script>
<template>
  <div v-if="items.length">
    <ExerciseCard v-for="exercise in items" :key="exercise.id" :exercise="exercise" :show-date="historyDates?.[exercise.id]" />
  </div>
</template>
