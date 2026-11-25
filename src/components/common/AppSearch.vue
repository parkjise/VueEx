<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from 'lucide-vue-next'
import AppModal from './AppModal.vue'
import { exercisePath, searchExercises } from '../../data/exercises'
const open = defineModel({ type: Boolean, required: true })
const router = useRouter()
const query = ref('')
const results = computed(() => query.value.trim() ? searchExercises(query.value).slice(0, 6) : [])
watch(open, value => { if (value) query.value = String(router.currentRoute.value.query.q ?? '') })
function search() {
  if (!query.value.trim()) return
  router.push({ name: 'search', query: { q: query.value.trim() } })
  open.value = false
}
</script>
<template>
  <AppModal v-model="open" title="문제 검색">
    <form class="search-form" role="search" @submit.prevent="search">
      <Search :size="19" /><input v-model="query" type="search" aria-label="문제 또는 키워드" placeholder="예: 탭, CSS, v-model" autofocus>
      <button type="submit" class="button button--primary">검색</button>
    </form>
    <ul v-if="results.length" class="search-results">
      <li v-for="exercise in results" :key="exercise.id"><RouterLink :to="exercisePath(exercise)" @click="open = false"><span>{{ exercise.title }}</span><small>{{ exercise.id }}</small></RouterLink></li>
    </ul>
    <p v-else-if="query.trim()" class="search-results__empty">일치하는 문제가 없습니다.</p>
  </AppModal>
</template>
