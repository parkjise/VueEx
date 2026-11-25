<script setup>
import { shallowRef } from 'vue'
import { sandboxDocument } from '../../utils/sandbox'

const props = defineProps({ payload: Object, allowDownloads: Boolean, title: { type: String, required: true } })
const frame = shallowRef()
function initialize() {
  frame.value?.contentWindow?.postMessage({ ...props.payload, type: 'vueex-run' }, '*')
}
</script>

<template>
  <iframe ref="frame" class="sandbox-frame" :title="title" :srcdoc="sandboxDocument"
    :sandbox="allowDownloads ? 'allow-scripts allow-downloads' : 'allow-scripts'" referrerpolicy="no-referrer" @load="initialize" />
</template>
