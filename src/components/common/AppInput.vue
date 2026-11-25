<script setup>
const value = defineModel({ type: String, required: true })
</script>
<template><input v-model="value"></template>
