<script setup>
import { ChevronDown } from 'lucide-vue-next'
defineOptions({ inheritAttrs: false })
const value = defineModel({ type: String, required: true })
</script>
<template>
  <span class="catalog-filters__select"><select v-model="value" v-bind="$attrs"><slot /></select><ChevronDown :size="15" aria-hidden="true" /></span>
</template>
