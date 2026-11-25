const demoStyles = `
:root { font-family: system-ui, sans-serif; color: #1e293b; color-scheme: light; }
* { box-sizing: border-box; }
body { margin: 0; background: #f8fafc; }
.demo { max-width: 42rem; margin: auto; padding: clamp(14px, 4vw, 36px); }
.demo :where(button, input, textarea, select) { font: inherit; }
.demo :where(button, input:not([type=checkbox], [type=radio], [type=range]), textarea, select) {
  border: 1px solid #cbd5e1; border-radius: 7px; padding: 7px 10px; max-width: 100%; background: white; color: #1e293b;
}
.demo button { cursor: pointer; }
.demo button[aria-selected=true], .demo button[aria-pressed=true], .demo .primary {
  background: #dcfce7; border-color: #42b883; color: #14532d;
}
.demo button:disabled { opacity: .45; cursor: not-allowed; }
.demo :focus-visible { outline: 3px solid #23785a; outline-offset: 2px; }
.demo label { display: block; margin-block: 7px; }
.demo table { border-collapse: collapse; width: 100%; }
.demo th, .demo td { padding: 8px; text-align: start; border-bottom: 1px solid #cbd5e1; }
.demo article, .demo .panel { padding: 14px; background: white; border: 1px solid #dbe4e8; border-radius: 9px; margin-block: 10px; }
.demo nav button { margin: 2px; }
.demo dialog { max-width: calc(100% - 24px); border: 1px solid #dbe4e8; border-radius: 12px; padding: 20px; }
.demo dialog::backdrop { background: #172b3180; }
`.trim()

const asSource = value => JSON.stringify(value, null, 2)
const indent = (value, spaces = 2) => value.split('\n').map(line => line ? ' '.repeat(spaces) + line : '').join('\n')
const renderTemplate = value => `<template>\n  <div class="demo">\n${indent(value, 4)}\n  </div>\n</template>`
const formatSfc = (template, script, css, setup = false, styleLang = '') => [
  renderTemplate(template),
  script && `<script${setup ? ' setup' : ''}>\n${script}\n</script>`,
  css && `<style${styleLang ? ` lang="${styleLang}"` : ''}>\n${css}\n</style>`,
].filter(Boolean).join('\n\n')

export function defineExercise(category, number, {
  slug, title, level = '초급', time = 15, keywords, scenario, task, checks, guide, error, tip, challenge,
  template, compositionTemplate = template, allowDownloads = false, mockData, start, css = '', startCss = css, data = {}, computed = {}, methods = {}, options, setup, scss, startScss, javascript = '',
}) {
  const id = `${category.toUpperCase()}-${String(number).padStart(2, '0')}`
  const state = Object.keys(data).length
  const optionProperties = [
    state && `data() {\n  return ${indent(asSource(data)).trimStart()}\n}`,
    ...Object.entries({ computed, methods }).filter(([, entries]) => Object.keys(entries).length)
      .map(([name, entries]) => `${name}: {\n${indent(Object.entries(entries).map(([key, code]) =>
        `${code.startsWith('async ') ? 'async ' : ''}${key}${code.replace(/^async /, '').replaceAll('ctx.', 'this.')}`).join(',\n'))}\n}`),
  ].filter(Boolean)
  const optionsCode = options ?? (optionProperties.length ? `export default {\n${indent(optionProperties.join(',\n'))}\n}` : '')
  const setupLines = []
  const imports = [state && 'reactive', Object.keys(computed).length && 'computed'].filter(Boolean)
  if (imports.length) setupLines.push(`import { ${imports.join(', ')} } from 'vue'`)
  if (state) setupLines.push(`const ctx = reactive(${asSource(data)})`)
  const adaptContext = code => code.replace(/ctx\.(\w+)/g, (match, name) => {
    if (Object.hasOwn(computed, name)) return `${name}.value`
    if (Object.hasOwn(methods, name)) return name
    return match
  })
  for (const [key, code] of Object.entries(computed)) setupLines.push(`const ${key} = computed(${adaptContext(code).replace(/^\(\)\s*/, '() => ')})`)
  for (const [key, code] of Object.entries(methods)) setupLines.push(`${code.startsWith('async ') ? 'async ' : ''}function ${key}${adaptContext(code).replace(/^async /, '')}`)
  const setupCode = setup ?? setupLines.join('\n\n')
  for (const key of Object.keys(data).sort((a, b) => b.length - a.length)) {
    // Explicit prefix in generated lesson templates keeps HTML attributes and text intact.
    compositionTemplate = compositionTemplate.replaceAll(`$${key}$`, `ctx.${key}`)
    template = template.replaceAll(`$${key}$`, key)
  }
  const styles = [demoStyles, css].filter(Boolean).join('\n\n')
  const starterMarkup = start ?? template
  const starterStyles = [demoStyles, startCss].filter(Boolean).join('\n\n')
  const starterJs = javascript || (state || optionsCode || setupCode ? '// TODO: 요구사항에 맞게 화면 상태와 이벤트를 연결하세요.' : '')
  return {
    id, slug, title, category, difficulty: level, estimatedTime: time, keywords,
    description: task, requirements: checks, scenario,
    starterCode: {
      html: `<main class="demo">\n${indent(starterMarkup)}\n</main>`,
      css: starterStyles, javascript: starterJs,
      vue: formatSfc(starterMarkup, starterJs, startScss ? [demoStyles, startScss].join('\n\n') : starterStyles, true, startScss ? 'scss' : ''), mockData: mockData ?? (state ? data : null),
    },
    solutions: {
      optionsApi: formatSfc(template, optionsCode, scss ? [demoStyles, scss].join('\n\n') : styles, false, scss ? 'scss' : ''),
      compositionApi: formatSfc(compositionTemplate, setupCode, scss ? [demoStyles, scss].join('\n\n') : styles, true, scss ? 'scss' : ''),
    },
    explanation: guide, commonErrors: error, practicalTips: tip, challenge,
    previewComponent: 'sfc',
    allowDownloads,
    previewSource: scss ? formatSfc(compositionTemplate, setupCode, styles, true) : undefined,
  }
}
