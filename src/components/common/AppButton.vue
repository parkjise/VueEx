<script setup>
defineProps({ to: [String, Object], variant: { type: String, default: 'default' }, type: { type: String, default: 'button' } })
</script>
<template>
  <RouterLink v-if="to" :to="to" :class="['button', variant !== 'default' && 'button--' + variant]"><slot /></RouterLink>
  <button v-else :type="type" :class="['button', variant !== 'default' && 'button--' + variant]"><slot /></button>
</template>
