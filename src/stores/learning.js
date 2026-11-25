import { computed, onScopeDispose, ref, watch } from 'vue'
import { defineStore } from 'pinia'

const key = 'vueex.learning.v1'
const defaults = { completed: [], favorites: [], history: [], theme: 'system' }

function readState() {
  try { return { ...defaults, ...JSON.parse(localStorage.getItem(key)) } }
  catch { return defaults }
}

export const useLearningStore = defineStore('learning', () => {
  const initial = readState()
  const completed = ref(initial.completed)
  const favorites = ref(initial.favorites)
  const history = ref(initial.history)
  const theme = ref(initial.theme)
  const scheme = window.matchMedia('(prefers-color-scheme: dark)')
  const systemDark = ref(scheme.matches)
  const onSchemeChange = event => { systemDark.value = event.matches }
  scheme.addEventListener('change', onSchemeChange)
  onScopeDispose(() => scheme.removeEventListener('change', onSchemeChange))
  const resolvedTheme = computed(() => theme.value === 'system' ? (systemDark.value ? 'dark' : 'light') : theme.value)
  watch([completed, favorites, history, theme], () => {
    try { localStorage.setItem(key, JSON.stringify({ completed: completed.value, favorites: favorites.value, history: history.value, theme: theme.value })) }
    catch { /* Learning remains available for the current session. */ }
  })
  function toggle(list, id) {
    return list.includes(id) ? list.filter(item => item !== id) : [...list, id]
  }
  function toggleFavorite(id) { favorites.value = toggle(favorites.value, id) }
  function toggleComplete(id) { completed.value = toggle(completed.value, id) }
  function visit(id) {
    history.value = [{ id, at: Date.now() }, ...history.value.filter(item => item.id !== id)].slice(0, 100)
  }
  return { completed, favorites, history, theme, resolvedTheme, toggleFavorite, toggleComplete, visit }
})
