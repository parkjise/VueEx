import { defineExercise } from './define'

export function guided(category, rows) {
  return rows.map(([slug, title, keyword, task, finish, guide, error, tip, challenge, demo], index) =>
    defineExercise(category, index + 1, {
      slug, title, keywords: Array.isArray(keyword) ? keyword : [keyword], scenario: task, task,
      checks: [finish], guide: [guide, '입력값을 바꿔 보고 템플릿의 출력이 어떤 상태에 의존하는지 확인하세요.'],
      error: [error], tip: [tip], challenge, ...demo,
    }),
  )
}

const toState = key => '$' + key + '$'

export function expressionDemo(data, controls, expression) {
  const inputs = controls.map(([key, label, type = 'text', options]) => {
    const state = toState(key)
    const input = Array.isArray(options)
      ? `<select v-model="${state}">${options.map(value => `<option>${value}</option>`).join('')}</select>`
      : `<input type="${type}" v-model${type === 'number' || type === 'range' ? '.number' : ''}="${state}"${typeof options === 'string' ? ' ' + options : ''}>`
    return `<label>${label} ${input}</label>`
  }).join('\n')
  return {
    data, computed: { result: `() { return ${expression} }` },
    template: `${inputs}\n<section class="panel" aria-live="polite"><strong>결과</strong><pre>{{ result }}</pre></section>`,
    start: `${inputs.replace(/ v-model(?:\.number)?="[^"]+"/g, '')}\n<section class="panel"><strong>결과</strong><pre><!-- TODO: 계산 결과를 표시하세요. --></pre></section>`,
    css: '.demo pre { white-space: pre-wrap; overflow-wrap: anywhere; }',
  }
}

export function starterMarkup(template) {
  return template
    .replace(/\s(?:v-[\w:.-]+|[:@][\w:.-]+)\s*=\s*"[^"]*"/g, '')
    .replace(/\s(?:v-else|v-once|v-pre)(?=[\s>])/g, '')
    .replace(/{{[\s\S]*?}}/g, '<!-- TODO: 값 표시 -->')
    .replace(/<(?:component|slot)(?=[\s>])/g, '<div')
    .replace(/<\/(?:component|slot)>/g, '</div>')
}
