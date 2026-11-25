<script setup>
defineProps({ label: { type: String, required: true } })
</script>
<template><span class="app-tooltip"><slot /><span class="app-tooltip__label" aria-hidden="true">{{ label }}</span></span></template>
