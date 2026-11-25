import { guided } from '../guided'

const fixtures = [{ id: 1, title: '실습 시작', published: true }, { id: 2, title: 'CSS 레이아웃', published: false }, { id: 3, title: '파일 관리', published: true }, { id: 4, title: '탭 인터랙션', published: false }]
const config = [
  ['fetch','Fetch API로 JSON 읽기','Fetch API','브라우저 Fetch로 내장 JSON 문서를 읽습니다.','불러오기를 누르면 JSON의 제목이 표시됩니다.','fetch의 Response에서 ok를 확인하고 json으로 본문을 읽습니다.','HTTP 오류 응답은 fetch Promise를 자동으로 거절하지 않을 수 있습니다.','response가 JSON이 아닐 때 안내를 추가하세요.',
    "const response = await fetch('data:application/json,' + encodeURIComponent(JSON.stringify(ctx.records))); if (!response.ok) throw new Error('응답 오류'); return await response.json()"],
  ['axios','Axios로 모의 응답 받기','Axios adapter','실제 Axios 인스턴스의 요청과 응답을 로컬 데이터에 연결합니다.','Axios 요청 후 응답의 data가 표시됩니다.','Axios 인스턴스의 adapter를 교체해 네트워크 없이도 get의 응답을 연습합니다.','Axios 데이터는 response.data에 있습니다. Fetch의 json 메서드를 호출하지 않습니다.','응답 인터셉터로 공통 형식을 만들어 보세요.',
    "const client = axios.create({ adapter: async config => ({ data: ctx.records, status: 200, statusText: 'OK', headers: {}, config }) }); const response = await client.get('/lessons'); return response.data"],
  ['async-await','async/await 순차 작업','await','서로 의존하는 모의 세션과 프로필을 순서대로 읽습니다.','완료 후 올바른 사용자 ID와 이름이 표시됩니다.','세션 응답에서 사용자 ID를 얻은 뒤 해당 ID로 프로필을 조회합니다.','Promise에서 ID를 꺼내려면 완료될 때까지 await 해야 합니다.','두 번째 요청이 실패하면 다시 시도할 수 있게 하세요.',
    "const session = await Promise.resolve({ userId: 7 }); await pause(150); return { id: session.userId, name: '지우', sequence: ['세션', '프로필'] }"],
  ['get','GET으로 리소스 한 건 찾기','GET · ID','상품 ID로 모의 문서를 조회합니다.','ID 1은 문서를 반환하고 없는 ID는 404로 표시됩니다.','요청 입력을 숫자 ID로 변환하고 일치하는 리소스를 찾습니다.','응답이 없는데도 정상 객체를 반환한 것처럼 표시하지 마세요.','조회 결과가 없을 때 목록으로 돌아가기 버튼을 추가하세요.',
    "const id = Number(ctx.input); const result = ctx.records.find(item => item.id === id); if (!result) throw new Error('404 · 문서가 없습니다.'); return result",
    '문서 ID', '1'],
  ['post','POST로 새 문서 생성','POST · 201','모의 문서 저장소에 새 문서를 올립니다.','제목을 입력한 뒤 생성하면 새로운 ID와 제목이 반환됩니다.','POST 처리는 입력을 검증하고 고유 ID로 새 레코드를 추가합니다.','등록 요청을 재전송했을 때 중복 생성 정책을 검토하세요.','201 응답의 위치 정보를 함께 표시하세요.',
    "const title = ctx.input.trim(); if (!title) throw new Error('400 · 제목을 입력하세요.'); const row = { id: ctx.nextId++, title, published: false }; ctx.records = [...ctx.records, row]; return { status: 201, record: row }", '새 문서 제목', '새 실습'],
  ['put','PUT으로 문서 전체 교체','PUT · 전체 교체','첫 문서의 설명 객체를 새 입력으로 교체합니다.','교체 뒤 제목과 새 공개 상태가 반환됩니다.','PUT은 지정한 리소스를 요청 본문 전체로 교체하는 계약을 사용합니다.','보내지 않은 필드가 기존 상태로 유지된다고 가정하지 마세요.','같은 PUT을 두 번 보내고 결과를 비교하세요.',
    "const title = ctx.input.trim(); if (!title) throw new Error('400 · 제목을 입력하세요.'); const replacement = { id: 1, title, published: false }; ctx.records = ctx.records.map(row => row.id === 1 ? replacement : row); return replacement", '교체할 제목', '개선된 시작 문서'],
  ['patch','PATCH로 제목만 변경','PATCH · 부분 수정','문서 ID와 공개 상태를 유지한 채 제목만 바꿉니다.','새 제목을 적용해도 다른 속성은 보존됩니다.','기존 객체를 펼친 다음 변경할 필드만 덮어씁니다.','PUT과 PATCH의 차이는 API 계약에 맞춰 서버와 합의하세요.','같은 폼에서 공개 상태도 선택적으로 변경하게 해 보세요.',
    "const title = ctx.input.trim(); if (!title) throw new Error('400 · 제목을 입력하세요.'); ctx.records = ctx.records.map(row => row.id === 1 ? { ...row, title } : row); return ctx.records.find(row => row.id === 1)", '새 제목', '시작 가이드'],
  ['delete','DELETE 이후 목록 동기화','DELETE · 204','입력한 ID의 문서를 삭제한 뒤 남은 문서를 읽습니다.','같은 ID가 목록에 남지 않고 없는 ID는 안내됩니다.','삭제 요청을 적용한 뒤 배열을 새 상태로 교체하고 결과를 반환합니다.','204 응답에는 JSON 본문이 없을 수 있습니다.','삭제가 실패하면 서버와 화면 상태를 원래대로 유지하세요.',
    "const id = Number(ctx.input); if (!ctx.records.some(row => row.id === id)) throw new Error('404 · 이미 없거나 삭제된 문서입니다.'); ctx.records = ctx.records.filter(row => row.id !== id); return { status: 204, remaining: ctx.records }", '문서 ID', '2'],
  ['loading','요청 중 로딩 상태 관리','finally','요청이 완료될 때까지 중복 클릭을 막습니다.','진행 중 버튼과 상태 텍스트가 바뀌고 완료 후 복구됩니다.','요청 시작 전 busy를 설정하고 완료 여부와 관계없이 finally에서 해제합니다.','오류 경로에 로딩 해제를 빠뜨리면 계속 대기 상태가 됩니다.','오래 걸리는 경우 사용자에게 취소 기능을 제공하세요.',
    'await pause(1300); return { received: ctx.records.length, status: "준비 완료" }'],
  ['error','오류 메시지와 재시도','try · catch','처음 요청을 실패시키고 이후 재시도로 복구합니다.','첫 요청은 오류 안내, 다음 요청은 데이터 표시가 됩니다.','catch에서 오류를 상태로 저장하고 새 요청에서는 이전 오류를 초기화합니다.','실패하는 경우에도 finally가 실행되는지 확인하세요.','일시적 장애만 자동 재시도하도록 조건을 만들어 보세요.',
    "if (ctx.calls === 1) throw new Error('503 · 일시적인 장애입니다. 다시 시도하세요.'); return ctx.records"],
  ['empty','빈 데이터 결과 표시','빈 상태','성공했으나 입력 검색 결과가 없는 상황을 처리합니다.','빈 결과는 오류 상태와 다른 안내를 표시합니다.','null은 실행 전, 빈 배열은 성공했지만 항목이 없다는 상태를 표현합니다.','빈 배열을 서버 오류로 처리하면 사용자에게 잘못된 신호를 줍니다.','빈 결과에서 검색 초기화 버튼을 추가하세요.',
    "return ctx.records.filter(item => item.title.includes(ctx.input.trim()))", '검색어', '없는 문서'],
  ['search','API 검색어 인코딩','URLSearchParams','입력한 검색어를 주소 매개변수로 바꾼 요청을 모사합니다.','한글과 공백이 포함된 검색어가 URL로 인코딩되며 결과에 반영됩니다.','URLSearchParams가 사용자 문자열을 쿼리스트링에 맞게 인코딩합니다.','직접 이어 붙이면 &, ?, # 문자가 의미를 바꿀 수 있습니다.','복수 카테고리나 정렬을 매개변수에 추가하세요.',
    "const params = new URLSearchParams({ q: ctx.input.trim() }); return { url: '/lessons?' + params.toString(), items: ctx.records.filter(item => item.title.includes(params.get('q'))) }", '검색어', 'CSS 레이아웃'],
  ['pagination','페이지 쿼리와 메타데이터','페이지네이션','모의 API의 페이지당 2건과 전체 개수를 표시합니다.','페이지 번호를 1 또는 2로 변경하면 결과 항목이 달라집니다.','서버 응답에서 items와 total을 분리하여 화면에 필요한 경계를 계산합니다.','페이지가 1부터 시작하면 배열 시작 위치를 (page - 1) * size로 계산합니다.','다음 페이지 버튼과 페이지 범위 제한을 적용하세요.',
    "const page = Number(ctx.input); if (!Number.isInteger(page) || page < 1 || page > Math.ceil(ctx.records.length / 2)) throw new Error('페이지 범위를 확인하세요.'); return { page, total: ctx.records.length, items: ctx.records.slice((page-1)*2,page*2) }", '페이지 번호', '1'],
  ['promise-all','병렬 조회 결과 결합','Promise.all','공지와 사용자 통계를 독립적으로 요청해 요약합니다.','두 응답이 모두 준비된 뒤에 한 번에 표시됩니다.','요청 두 개를 먼저 시작하고 Promise.all이 둘 모두 완료될 때까지 기다립니다.','결과 순서는 끝난 순서가 아니라 Promise 배열의 순서입니다.','일부 요청을 실패시키고 Promise.allSettled로 동작을 비교하세요.',
    "const notices = pause(320).then(() => ctx.records.slice(0, 2)); const stats = pause(190).then(() => ({ completed: 12 })); const [items, summary] = await Promise.all([notices, stats]); return { items, summary }"],
  ['abort','AbortController로 요청 취소','AbortController','길게 걸리는 모의 요청을 중간에 취소합니다.','요청 중 취소하면 완료 결과 대신 취소 메시지가 표시됩니다.','signal을 모의 transport에 전달하고 abort 이벤트에서 예약을 정리합니다.','취소 결과도 실패로 보고 재시도 루프에 넣지 않도록 분리하세요.','실제 Fetch 요청의 signal 옵션에 적용해 보세요.',
    "await pause(2500); return ctx.records"],
  ['api-module','데이터 조회 함수와 화면 분리','API 모듈','문서 필터 요청을 전송 함수에 모읍니다.','상태 필터에 따라 공개 또는 비공개 목록을 읽습니다.','전송 함수는 요청 인자를 받아 데이터를 반환하고 호출부는 로딩 표시를 관리합니다.','함수 안에서 페이지 전역 DOM을 직접 수정하면 재사용하기 어렵습니다.','전송 함수를 별도 모듈에 옮긴 다음 재사용하세요.',
    "return await apiClient.list(ctx.records, ctx.input === '공개')", '필터 (공개 / 비공개)', '공개'],
  ['api-composable','API composable로 요청 상태 관리','composable','데이터와 로딩을 묶은 목록 조회 기능을 사용합니다.','요청 사이에 상태를 유지하고 취소와 오류를 구분합니다.','Composition 정답은 useRequest에서 상태와 동작을 반환합니다. Options 정답은 같은 계약을 인스턴스 메서드로 제공합니다.','요청 인스턴스마다 상태를 만들지 않으면 독립된 화면끼리 값이 공유됩니다.','서로 독립된 두 composable 인스턴스를 같은 페이지에 배치해 보세요.',
    "await pause(240); return { items: ctx.records, source: '로컬 fixture' }"],
  ['all-settled','성공 및 실패 응답을 함께 표시','Promise.allSettled','두 대시보드 데이터 중 실패가 있어도 성공한 정보를 보여 줍니다.','첫 번째 응답을 받은 뒤 두 번째 오류도 결과에 포함됩니다.','allSettled는 정착한 각 결과의 status와 value 또는 reason을 제공받습니다.','성공 항목에 reason, 실패 항목에 value를 기대하면 undefined가 나옵니다.','실패한 슬롯만 재시도하는 동작을 구현하세요.',
    "const results = await Promise.allSettled([Promise.resolve(ctx.records.slice(0, 1)), Promise.reject(new Error('통계 없음'))]); return results.map(result => result.status === 'fulfilled' ? { status: result.status, value: result.value } : { status: result.status, reason: result.reason.message })"],
  ['http-status','HTTP 상태 분기','Response · ok','성공, 인증 필요, 서버 장애 상황을 Response 객체로 재현합니다.','200은 데이터를 표시하고 401과 503은 서로 다른 안내가 나옵니다.','Response의 ok는 200대 응답에서만 참입니다. 다른 상태는 의미에 맞게 처리합니다.','오류 응답에서 항상 JSON을 반환한다고 가정하면 파싱 오류가 추가됩니다.','상태가 429일 때 요청 제한 메시지를 추가하세요.',
    "const status = Number(ctx.input); if (![200,401,503].includes(status)) throw new Error('200, 401, 503 중 하나를 입력하세요.'); const response = new Response(JSON.stringify(ctx.records), { status }); if (!response.ok) throw new Error(status === 401 ? '401 · 로그인 필요' : '503 · 서버 일시 중단'); return await response.json()", '응답 코드', '200'],
  ['retry','한 번만 재시도하는 모의 요청','재시도 · idempotency','일시 장애가 난 읽기 요청을 정해진 횟수 안에서 다시 실행합니다.','시도 횟수가 2이고 두 번째 요청의 결과가 표시됩니다.','읽기 요청의 실패를 한 번 처리하고 그 뒤에는 예외를 상위 흐름으로 전달합니다.','쓰기도 같은 방식으로 무조건 재시도하면 중복 생성될 수 있습니다.','재시도 전 기다리는 시간을 늘리는 백오프를 적용하세요.',
    "let attempts = 0; while (attempts < 2) { attempts++; await pause(180); if (attempts === 1) continue; return { attempts, items: ctx.records } } throw new Error('요청 실패')"],
]

const transport = `function pauseWithSignal(ms, signal) {
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(new DOMException('요청 취소', 'AbortError')) }
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve() }, ms)
    if (signal.aborted) abort()
    else signal.addEventListener('abort', abort, { once: true })
  })
}`
const apiClient = `const apiClient = { async list(records, published) { return records.filter(item => item.published === published) } }`

export default guided('api', config.map(([slug,title,keyword,task,finish,guide,error,challenge,operation,inputLabel,input = '']) => {
  const initial = JSON.stringify({ input, records:fixtures, result:null, error:'', busy:false, calls:0, nextId:5, controller:null })
  const inputMarkup = inputLabel ? `<label>${inputLabel} <input v-model="ctx.input"></label>\n` : ''
  const compositionTemplate = `${inputMarkup}<button :disabled="ctx.busy" @click="run">{{ ctx.busy ? '요청 중' : '요청 실행' }}</button>
<button :disabled="!ctx.busy" @click="cancel">취소</button>
<section class="panel" aria-live="polite" :aria-busy="ctx.busy">
  <p v-if="ctx.error" role="alert">{{ ctx.error }}</p>
  <p v-else-if="ctx.busy">응답을 기다리는 중입니다.</p>
  <p v-else-if="Array.isArray(ctx.result) && !ctx.result.length">일치하는 데이터가 없습니다.</p>
  <pre v-else-if="ctx.result !== null">{{ ctx.result }}</pre>
  <p v-else>로컬 실습 데이터로 요청을 실행해 보세요.</p>
</section>`
  const optionsTemplate = compositionTemplate.replaceAll('ctx.', '')
  const request = `async function request(ctx, signal) {
  const pause = ms => pauseWithSignal(ms, signal)
  await pause(250)
  ${operation}
}`
  const execute = `async function runRequest(ctx) {
  if (ctx.busy) return
  const controller = new AbortController()
  ctx.controller = controller
  ctx.calls++
  ctx.error = ''
  ctx.result = null
  ctx.busy = true
  try {
    const value = await request(ctx, controller.signal)
    if (!controller.signal.aborted) ctx.result = value
    else ctx.error = '요청을 취소했습니다.'
  } catch (error) {
    ctx.error = error.name === 'AbortError' ? '요청을 취소했습니다.' : error.message
  } finally {
    ctx.busy = false
    ctx.controller = null
  }
}`
  const common = [slug === 'axios' && "import axios from 'axios'", slug === 'api-module' && apiClient, transport, request, execute].filter(Boolean).join('\n\n')
  const options = common + `\n\nexport default {
  data: () => (${initial}),
  methods: { run() { return runRequest(this) }, cancel() { this.controller?.abort() } },
  beforeUnmount() { this.cancel() },
}`
  const setup = "import { reactive, onBeforeUnmount } from 'vue'\n" + common +
    `\n\nfunction useRequest() {
  const ctx = reactive(${initial})
  const run = () => runRequest(ctx)
  const cancel = () => ctx.controller?.abort()
  onBeforeUnmount(cancel)
  return { ctx, run, cancel }
}
const { ctx, run, cancel } = useRequest()`
  return [slug,title,[keyword,'비동기 처리'],task,finish,guide,error,'개발 중에는 같은 데이터 구조로 성공, 빈 값, 실패 케이스를 번갈아 확인하세요.',challenge,{
    template: optionsTemplate, compositionTemplate,
    start: `${inputLabel ? `<label>${inputLabel} <input></label>\n` : ''}<button>요청 실행</button> <button disabled>취소</button>\n<section class="panel" aria-live="polite"><p>실행 결과</p></section>`,
    css: '.demo pre { white-space: pre-wrap; overflow-wrap: anywhere; }',
    options, setup, level:'중급', mockData:fixtures,
  }]
}))
