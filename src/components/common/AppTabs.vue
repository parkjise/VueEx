<script setup>
import { useId } from 'vue'
const selected = defineModel({ type: String, required: true })
const props = defineProps({ tabs: { type: Array, required: true }, label: { type: String, required: true } })
const prefix = useId()

function move(event, index) {
  const last = props.tabs.length - 1
  const targets = { ArrowLeft: index === 0 ? last : index - 1, ArrowRight: index === last ? 0 : index + 1, Home: 0, End: last }
  if (!(event.key in targets)) return
  event.preventDefault()
  const target = targets[event.key]
  selected.value = props.tabs[target].id
  event.currentTarget.parentElement.children[target].focus()
}
</script>

<template>
  <div class="tabs" role="tablist" :aria-label="label">
    <button v-for="(tab, i) in tabs" :id="`${prefix}-${tab.id}`" :key="tab.id" type="button" role="tab"
      :aria-controls="`${prefix}-panel`" :aria-selected="selected === tab.id" :tabindex="selected === tab.id ? 0 : -1"
      @click="selected = tab.id" @keydown="move($event, i)">{{ tab.label }}</button>
  </div>
  <div :id="`${prefix}-panel`" class="tabs__panel" role="tabpanel" :aria-labelledby="`${prefix}-${selected}`" tabindex="0">
    <slot :selected="selected" />
  </div>
</template>
