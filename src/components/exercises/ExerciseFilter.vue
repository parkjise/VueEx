<script setup>
import { computed } from 'vue'
import AppInput from '../common/AppInput.vue'
import AppSelect from '../common/AppSelect.vue'
import AppCheckbox from '../common/AppCheckbox.vue'
import { categories, difficulties } from '../../data/categories'
const query = defineModel('query', { type: String, required: true })
const level = defineModel('level', { type: String, required: true })
const category = defineModel('category', { type: String, required: true })
const status = defineModel('status', { type: String, required: true })
function statusOption(option) {
  return computed({ get: () => status.value === option, set: enabled => { status.value = enabled ? option : '' } })
}
const incomplete = statusOption('todo')
const complete = statusOption('done')
defineProps({ fixedCategory: Boolean })
</script>
<template>
  <div class="catalog-filters" role="group" aria-label="문제 필터">
    <AppInput v-model="query" type="search" aria-label="목록 내 검색" placeholder="문제 또는 키워드" />
    <AppSelect v-if="!fixedCategory" v-model="category" aria-label="카테고리">
      <option value="">모든 카테고리</option><option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</option>
    </AppSelect>
    <AppSelect v-model="level" aria-label="난이도"><option value="">모든 난이도</option><option v-for="item in difficulties" :key="item">{{ item }}</option></AppSelect>
    <AppCheckbox v-model="complete">완료만</AppCheckbox>
    <AppCheckbox v-model="incomplete">미완료만</AppCheckbox>
  </div>
</template>
