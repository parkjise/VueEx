export function ui(slug, title, keyword, task, action, result, guide, error, tip, challenge, demo) {
  return { slug, title, keywords: ['Vue 3', keyword], scenario: demo.scenario ?? task, task, checks: [action, result],
    guide: [guide, '선택값을 변경한 뒤 화면에 표시된 결과와 접근성 속성을 함께 확인하세요.'],
    error: [error], tip: [tip], challenge, ...demo }
}
