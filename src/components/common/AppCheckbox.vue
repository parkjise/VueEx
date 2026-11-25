<script setup>
defineOptions({ inheritAttrs: false })
const value = defineModel({ type: Boolean, required: true })
</script>
<template>
  <label class="app-checkbox"><input v-model="value" type="checkbox" v-bind="$attrs"><span><slot /></span></label>
</template>
