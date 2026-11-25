import assert from 'node:assert/strict'
import { compileString } from 'sass'
import { createSSRApp } from 'vue'
import * as Vue from 'vue'
import axios from 'axios'
import { renderToString } from 'vue/server-renderer'
import { exercises, searchExercises } from '../src/data/exercises/index'
import { categories } from '../src/data/categories'
import { compileExercise } from '../src/utils/compileExercise'

const ids = new Set()
const paths = new Set()
const errors = []
function compile(source) {
  return compileExercise(source.replace(/<style lang="scss">([\s\S]*?)<\/style>/g,
    (_, scss) => `<style>${compileString(scss, { logger: { warn() {}, debug() {} } }).css}</style>`))
}
for (const exercise of exercises) {
  const path = `${exercise.category}/${exercise.slug}`
  assert.ok(!ids.has(exercise.id), `Duplicate ID: ${exercise.id}`)
  assert.ok(!paths.has(path), `Duplicate route: ${path}`)
  ids.add(exercise.id)
  paths.add(path)
  assert.ok(searchExercises(exercise.id.toLowerCase()).includes(exercise))
  for (const field of ['description', 'scenario', 'requirements', 'keywords', 'explanation', 'commonErrors', 'practicalTips', 'challenge']) {
    assert.ok(exercise[field]?.length, `${path}: missing ${field}`)
  }
  for (const field of ['html', 'css', 'vue']) assert.ok(exercise.starterCode[field]?.length)
  for (const [type, source] of Object.entries({ ...exercise.solutions, starter: exercise.starterCode.vue })) {
    try {
      const { code } = compile(source)
      const mount = { createApp(component) { return { mount() { return component } } } }
      const component = Function('Vue', '__axios', `${code.replace('Vue.createApp(__component).mount', 'return Vue.createApp(__component).mount')}`)({ ...Vue, ...mount }, axios)
      const html = await renderToString(createSSRApp(component))
      assert.match(html, /class="demo"/)
    } catch (error) { errors.push(`${path} (${type}): ${error.message}`) }
  }
}
for (const category of categories) {
  const count = exercises.filter(exercise => exercise.category === category.id).length
  assert.ok(count <= category.goal, `${category.id}: exceeds stated goal`)
  console.log(`${category.name} ${count}/${category.goal}`)
}
assert.deepEqual(errors, [])
console.log(`Validated ${exercises.length} lessons and ${exercises.length * 3} Vue SFCs.`)
