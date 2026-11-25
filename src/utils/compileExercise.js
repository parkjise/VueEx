import { compileScript, compileTemplate, compileStyle, parse } from 'vue/compiler-sfc'

function check(errors) {
  if (errors.length) throw new Error(errors.map(error => error.message ?? error).join('\n'))
}

function inlineVueImports(code) {
  return code.replace(/import\s+(\w+)\s+from\s*['"]axios['"];?/g, 'const $1 = __axios;').replace(/import\s*{([^}]+)}\s*from\s*['"]vue['"];?/g, (_, names) => {
    const bindings = names.split(',').map(name => name.trim().replace(/\s+as\s+/, ': ')).filter(Boolean)
    return `const { ${bindings.join(', ')} } = Vue;`
  })
}

export function compileExercise(source) {
  const { descriptor, errors } = parse(source, { filename: 'Exercise.vue' })
  check(errors)
  if (!descriptor.template || descriptor.template.src || descriptor.script?.src || descriptor.scriptSetup?.src) {
    throw new Error('하나의 파일에 템플릿과 스크립트를 작성하세요.')
  }
  if (descriptor.styles.some(style => style.src || style.lang || style.module)) {
    throw new Error('실행 환경에서는 인라인 CSS를 지원합니다. SCSS 실습은 Vue 프로젝트에서 확인할 수 있습니다.')
  }
  const id = 'vueex-demo'
  const scoped = descriptor.styles.some(style => style.scoped)
  const css = descriptor.styles.map(style => {
    const result = compileStyle({ source: style.content, filename: 'Exercise.vue', id, scoped: style.scoped })
    check(result.errors)
    return result.code
  }).join('\n')
  const script = descriptor.script || descriptor.scriptSetup
    ? compileScript(descriptor, { id, genDefaultAs: '__component' })
    : { content: 'const __component = {}', bindings: {} }
  const template = compileTemplate({
    source: descriptor.template.content, filename: 'Exercise.vue', id, scoped,
    compilerOptions: { bindingMetadata: script.bindings },
  })
  check(template.errors)
  return {
    css,
    code: inlineVueImports(`${script.content}\n${template.code.replace('export function render', 'function render')}\n`)
      + `\n__component.render = render;\n${scoped ? `__component.__scopeId = 'data-v-${id}';` : ''}\nVue.createApp(__component).mount('#preview');`,
  }
}
