<script setup>
defineProps({ exercise: { type: Object, required: true } })
</script>
<template>
  <div class="lesson-copy">
    <h2>코드 해설</h2>
    <h3>코드 실행 순서</h3>
    <ol><li v-for="step in exercise.explanation" :key="step">{{ step }}</li></ol>
    <h3>자주 발생하는 오류</h3>
    <ul><li v-for="error in exercise.commonErrors" :key="error">{{ error }}</li></ul>
    <h3>실무 활용 팁</h3>
    <ul><li v-for="tip in exercise.practicalTips" :key="tip">{{ tip }}</li></ul>
    <h3>응용 문제</h3><p>{{ exercise.challenge }}</p>
  </div>
</template>
