<script setup>
import { ref } from 'vue'
import ApiSwitcher from './ApiSwitcher.vue'
import CodeViewer from '../editor/CodeViewer.vue'
defineProps({ exercise: { type: Object, required: true } })
const active = ref('optionsApi')
</script>
<template>
  <ApiSwitcher v-model="active">
    <div class="lesson-copy">
      <template v-if="active === 'compare'">
        <h2>Options API와 Composition API</h2>
        <template v-if="exercise.solutions.optionsApi === exercise.solutions.compositionApi">
          <p>이 문제는 마크업과 스타일만으로 완성됩니다. 두 방식의 SFC에서 같은 템플릿을 사용합니다.</p>
        </template>
        <template v-else>
          <h3>Options API</h3><p>반응형 상태는 data에서 선언하고, methods와 computed에서 this로 참조합니다. 템플릿은 생성된 인스턴스의 속성을 읽습니다.</p>
          <h3>Composition API</h3><p>script setup에서 상태와 동작을 선언합니다. setup의 바인딩을 템플릿에서 직접 사용합니다.</p>
          <h3>이 문제에 적용하기</h3><p>{{ exercise.explanation[0] }}</p>
        </template>
        <h3>Options API</h3><CodeViewer :source="exercise.solutions.optionsApi" />
        <h3>Composition API</h3><CodeViewer :source="exercise.solutions.compositionApi" />
      </template>
      <template v-else>
        <h2>{{ active === 'optionsApi' ? 'Options API 정답' : 'Composition API 정답' }}</h2>
        <CodeViewer :source="exercise.solutions[active]" />
      </template>
    </div>
  </ApiSwitcher>
</template>
