<script setup>
defineProps({ level: String })
</script>
<template><span class="badge" :data-level="level"><slot /></span></template>
