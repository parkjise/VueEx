<script setup>
import AppTabs from '../common/AppTabs.vue'
const active = defineModel({ type: String, required: true })
const modes = [{ id: 'optionsApi', label: 'Options API' }, { id: 'compositionApi', label: 'Composition API' }, { id: 'compare', label: 'API 비교' }]
</script>
<template>
  <AppTabs v-model="active" :tabs="modes" label="정답 API"><slot /></AppTabs>
</template>
