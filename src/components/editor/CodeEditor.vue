<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { EditorView, minimalSetup } from 'codemirror'
import { Compartment, EditorState } from '@codemirror/state'
import { syntaxHighlighting, defaultHighlightStyle } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { javascript } from '@codemirror/lang-javascript'
import { vue } from '@codemirror/lang-vue'
import { oneDark } from '@codemirror/theme-one-dark'
import { useLearningStore } from '../../stores/learning'
const code = defineModel({ type: String, required: true })
const props = defineProps({ language: { type: String, required: true }, readonly: Boolean })
const mount = ref()
const store = useLearningStore()
const language = computed(() => ({ html, css, javascript, vue }[props.language] ?? javascript)())
const lang = new Compartment()
const theme = new Compartment()
let editor

onMounted(() => {
  editor = new EditorView({
    parent: mount.value,
    state: EditorState.create({
      doc: code.value,
      extensions: [
        minimalSetup, lang.of(language.value), theme.of(store.resolvedTheme === 'dark' ? oneDark : []),
        syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
        EditorView.lineWrapping, EditorState.readOnly.of(props.readonly),
        EditorView.contentAttributes.of({ 'aria-label': props.readonly ? '예제 코드' : '실습 코드', tabindex: '0' }),
        EditorView.updateListener.of(update => { if (update.docChanged) code.value = update.state.doc.toString() }),
      ],
    }),
  })
})
watch(code, value => {
  if (editor && value !== editor.state.doc.toString()) {
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: value } })
  }
})
watch(language, value => editor?.dispatch({ effects: lang.reconfigure(value) }))
watch(() => store.resolvedTheme, value => editor?.dispatch({ effects: theme.reconfigure(value === 'dark' ? oneDark : []) }))
onBeforeUnmount(() => editor?.destroy())
</script>

<template><div ref="mount" class="code-editor" /></template>
