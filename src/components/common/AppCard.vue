<script setup>
defineProps({ as: { type: String, default: 'section' } })
</script>
<template><component :is="as" class="panel"><slot /></component></template>
