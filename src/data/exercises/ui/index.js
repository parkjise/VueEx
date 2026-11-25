import { defineExercise } from '../define'
import { additionalUi } from './additional'

import { ui } from './lesson'

const lessons = [
  ui('tabs', '탭 메뉴 만들기', 'aria-selected', '상품 상세의 정보를 탭으로 나눠 표시합니다.', '상세 정보와 배송 탭을 번갈아 선택하세요.', '선택한 탭에 해당하는 패널이 표시됩니다.', 'active에는 탭 ID를 저장하고 동일한 ID로 버튼과 패널을 연결합니다.', '배열 인덱스를 ID로 사용하면 순서가 바뀔 때 다른 탭이 연결될 수 있습니다.', '방향키로 탭을 이동하고 선택 피드백을 색상 외 요소로도 전달하세요.', 'Home과 End 키로 첫 번째 및 마지막 탭을 선택해 보세요.', {
    data: { active: 'detail', tabs: [{ id: 'detail', label: '상세 정보', text: '가볍고 튼튼한 데스크 매트입니다.' }, { id: 'shipping', label: '배송 안내', text: '평일 오후 2시 이전 주문은 당일 발송됩니다.' }] },
    template: `<nav role="tablist" aria-label="상품 정보">
  <button v-for="(tab, i) in $tabs$" :key="tab.id" role="tab" :id="'tab-' + tab.id"
    :aria-selected="$active$ === tab.id" :aria-controls="'panel-' + tab.id"
    :tabindex="$active$ === tab.id ? 0 : -1" @click="$active$ = tab.id"
    @keydown.left.prevent="move(i, -1)" @keydown.right.prevent="move(i, 1)">{{ tab.label }}</button>
</nav>
<section v-for="tab in $tabs$" :key="tab.id" v-show="$active$ === tab.id" role="tabpanel"
  :id="'panel-' + tab.id" :aria-labelledby="'tab-' + tab.id" tabindex="0" class="panel">
  {{ tab.text }}
</section>`,
    start: '<nav aria-label="상품 정보"><button>상세 정보</button> <button>배송 안내</button></nav>\n<section class="panel">상품 정보를 표시할 영역</section>',
    methods: { move: `(index, delta) {
  const tab = ctx.tabs[(index + delta + ctx.tabs.length) % ctx.tabs.length]
  ctx.active = tab.id
  document.getElementById('tab-' + tab.id).focus()
}` },
  }),
  ui('dynamic-tabs', '동적 탭 추가와 닫기', 'splice', '열려 있는 문서를 탭으로 관리합니다.', '새 문서를 추가하고 활성 탭을 닫으세요.', '닫은 탭의 이웃 문서가 선택됩니다.', '증가하는 ID로 문서를 구별하고 닫은 위치를 이용해 이웃을 찾습니다.', '탭이 비었을 때 배열 요소가 존재한다고 가정하면 오류가 발생합니다.', '닫을 때 변경 사항이 있는 문서를 별도로 처리할 수 있습니다.', '문서 제목을 편집해 보세요.', {
    level: '중급', data: { tabs: [1], next: 2, active: 1 },
    template: `<button class="primary" @click="add">문서 열기</button>
<nav aria-label="열린 문서">
  <span v-for="id in $tabs$" :key="id"><button :aria-pressed="$active$ === id" @click="$active$ = id">문서 {{ id }}</button>
  <button :aria-label="'문서 ' + id + ' 닫기'" @click="close(id)">×</button></span>
</nav>
<p v-if="$active$">문서 {{ $active$ }} 편집 중</p><p v-else>열린 문서가 없습니다.</p>`,
    start: '<button class="primary">문서 열기</button><nav aria-label="열린 문서"></nav><p>열린 문서가 없습니다.</p>',
    methods: { add: '() { ctx.tabs.push(ctx.next); ctx.active = ctx.next++ }', close: '(id) { const i = ctx.tabs.indexOf(id); ctx.tabs.splice(i, 1); if (ctx.active === id) ctx.active = ctx.tabs[i] ?? ctx.tabs[i - 1] ?? null }' },
  }),
  ui('accordion', 'FAQ 아코디언', 'aria-expanded', '고객 지원 FAQ에서 한 답변씩 펼칩니다.', '두 질문을 순서대로 누르세요.', '이전 답변이 접히고 두 번째 답변이 펼쳐집니다.', '하나의 open 값으로 현재 열린 답변을 표현합니다.', '보이는 상태와 aria-expanded 값은 동일한 표현식으로 관리하세요.', '버튼은 Enter와 Space 입력을 기본으로 처리합니다.', '최초에 첫 항목을 열어 보세요.', {
    data: { open: '', questions: [{ id: 'delivery', title: '언제 배송되나요?', answer: '영업일 기준 2~3일이 소요됩니다.' }, { id: 'return', title: '반품이 가능한가요?', answer: '수령 후 7일 이내에 신청할 수 있습니다.' }] },
    template: `<article v-for="item in $questions$" :key="item.id">
  <button :aria-expanded="$open$ === item.id" :aria-controls="item.id"
    @click="$open$ = $open$ === item.id ? '' : item.id">{{ item.title }}</button>
  <p :id="item.id" v-show="$open$ === item.id">{{ item.answer }}</p>
</article>`, start: '<article><button>언제 배송되나요?</button><p hidden>영업일 기준 2~3일이 소요됩니다.</p></article>',
  }),
  ui('multi-accordion', '다중 아코디언', '배열 상태', '릴리스 노트의 여러 변경 내역을 함께 펼칩니다.', '두 버전을 펼친 뒤 하나를 접으세요.', '다른 버전의 열린 상태가 유지됩니다.', '배열에 열린 버전 ID를 담고 포함 여부로 표시합니다.', '버전 하나에 대한 변경이 배열 전체를 빈 값으로 만들지 않도록 합니다.', '서버 데이터의 고유 ID를 키로 사용하세요.', '모두 접기 기능을 추가해 보세요.', {
    data: { opened: [], versions: ['v2.1', 'v2.0', 'v1.9'] },
    template: `<article v-for="version in $versions$" :key="version">
  <button :aria-expanded="$opened$.includes(version)" @click="toggle(version)">{{ version }} 변경 내역</button>
  <p v-show="$opened$.includes(version)">{{ version }} 안정성 개선과 오류 수정</p>
</article>`,
    start: '<article><button>v2.1 변경 내역</button><p hidden>안정성 개선과 오류 수정</p></article>',
    methods: { toggle: '(id) { ctx.opened = ctx.opened.includes(id) ? ctx.opened.filter(item => item !== id) : [...ctx.opened, id] }' },
  }),
  ui('dropdown', '작업 드롭다운', 'v-if', '문서 이름 바꾸기와 보관 작업을 접이식 목록으로 제공합니다.', '작업을 열고 항목을 선택하세요.', '선택한 작업을 알리고 목록을 닫습니다.', '선택 이벤트가 상태 메시지와 메뉴 표시 상태를 함께 업데이트합니다.', 'Escape로 닫을 때 초점이 사라지지 않도록 트리거로 돌려보냅니다.', '실제 업무 작업은 서버 성공 응답 후 결과를 표시합니다.', '외부 클릭으로 닫는 동작을 추가해 보세요.', {
    data: { open: false, message: '' },
    template: `<div @keydown.esc="dismiss">
  <button id="actions" :aria-expanded="$open$" aria-controls="action-list" @click="$open$ = !$open$">문서 작업</button>
  <div id="action-list" v-show="$open$" class="panel">
    <button @click="choose('이름 바꾸기')">이름 바꾸기</button>
    <button @click="choose('보관')">보관</button>
  </div>
</div><p role="status">{{ $message$ }}</p>`,
    start: '<button>문서 작업</button><div class="panel" hidden><button>이름 바꾸기</button><button>보관</button></div><p role="status"></p>',
    methods: { choose: '(action) { ctx.message = action + " 작업을 선택했습니다."; ctx.dismiss() }', dismiss: '() { ctx.open = false; document.getElementById("actions").focus() }' },
  }),
  ui('custom-select', '커스텀 Select', 'radio', '배송 수단을 펼침 버튼과 라디오 옵션으로 선택합니다.', '배송 수단을 열고 라디오 옵션을 선택하세요.', '선택한 값이 트리거에 표시됩니다.', '라디오 그룹의 키보드 동작을 유지하고 v-model로 값을 연결합니다.', '카드 전체를 클릭 div로 만들면 라디오의 키보드 동작을 잃습니다.', '스타일만 필요한 경우 네이티브 select가 더 단순합니다.', '선택에 따라 배송비를 표시해 보세요.', {
    data: { open: false, chosen: '일반 배송', options: ['일반 배송', '당일 배송', '매장 픽업'] },
    template: `<button :aria-expanded="$open$" aria-controls="delivery-options" @click="$open$ = !$open$">{{ $chosen$ }}</button>
<fieldset id="delivery-options" v-show="$open$"><legend>배송 방법</legend>
  <label v-for="option in $options$" :key="option"><input type="radio" name="delivery" :value="option" v-model="$chosen$"> {{ option }}</label>
</fieldset>`,
    start: '<button>일반 배송</button><fieldset hidden><legend>배송 방법</legend><label><input type="radio" name="delivery"> 일반 배송</label></fieldset>',
  }),
  ui('multi-select', '다중 선택과 선택 요약', 'checkbox', '보고서에 포함할 데이터 열을 선택합니다.', '여러 열을 체크하고 하나를 해제하세요.', '요약에 선택된 열만 표시됩니다.', '체크박스의 v-model을 배열에 연결하면 Vue가 추가와 제거를 처리합니다.', '체크박스 value가 같으면 각 옵션을 구분할 수 없습니다.', '보여 주는 레이블과 내부 값을 분리하면 번역이 쉬워집니다.', '필수 열의 체크 해제를 막아 보세요.', {
    data: { options: ['날짜', '구매자', '금액', '상태'], selected: ['날짜'] },
    template: `<fieldset><legend>보고서 열</legend>
  <label v-for="option in $options$" :key="option"><input type="checkbox" :value="option" v-model="$selected$"> {{ option }}</label>
</fieldset><p aria-live="polite">{{ $selected$.join(', ') || '선택 없음' }}</p>`,
    start: '<fieldset><legend>보고서 열</legend><label><input type="checkbox"> 날짜</label></fieldset><p>선택 없음</p>',
  }),
  ui('modal', '모달 열기와 닫기', 'dialog', '계정의 알림 설정을 모달에서 확인합니다.', '설정을 연 뒤 닫기 또는 Escape를 누르세요.', '다이얼로그가 닫히고 원래 버튼으로 초점이 돌아갑니다.', 'showModal()은 페이지를 비활성화하고 포커스를 모달로 옮깁니다.', 'open 속성만 토글하면 모달의 포커스 제어가 동작하지 않습니다.', '닫기는 네이티브 form method="dialog"도 사용할 수 있습니다.', '설정 값을 보존하는 저장 동작을 추가해 보세요.', {
    template: `<button class="primary" @click="openDialog">설정 열기</button>
<dialog id="settings-dialog" aria-labelledby="dialog-title">
  <h2 id="dialog-title">알림 설정</h2><label><input type="checkbox"> 주간 알림</label>
  <button autofocus @click="closeDialog">닫기</button>
</dialog>`,
    start: '<button class="primary">설정 열기</button><dialog><h2>알림 설정</h2><label><input type="checkbox"> 주간 알림</label><button>닫기</button></dialog>',
    methods: { openDialog: '() { document.getElementById("settings-dialog").showModal() }', closeDialog: '() { document.getElementById("settings-dialog").close() }' },
  }),
  ui('nested-modal', '중첩 모달', 'showModal', '설정 모달 안에서 초기화 확인을 한 번 더 받습니다.', '설정을 열고 초기화를 선택한 다음 Escape를 누르세요.', '확인창만 닫히고 설정창은 열린 상태로 남습니다.', '두 dialog를 분리하고 각 ID로 열린 창을 제어합니다.', '한 개의 open 변수로 두 창을 함께 토글하면 열린 순서를 잃습니다.', '모달을 중첩할 때 가장 위에 있는 창에 취소 버튼을 제공하세요.', '확인을 누르면 체크박스 상태를 초기화해 보세요.', {
    level: '중급', data: { enabled: true },
    template: `<button @click="open('outer')">설정 열기</button>
<dialog id="outer" aria-label="설정"><h2>설정</h2>
  <label><input type="checkbox" v-model="$enabled$"> 알림 사용</label>
  <button @click="open('inner')">초기화</button> <button @click="close('outer')">닫기</button>
</dialog>
<dialog id="inner" aria-label="초기화 확인"><p>알림 설정을 초기화할까요?</p>
  <button autofocus @click="close('inner')">취소</button> <button @click="$enabled$ = false; close('inner')">확인</button>
</dialog>`,
    start: '<button>설정 열기</button><dialog id="outer"><h2>설정</h2><button>초기화</button></dialog><dialog id="inner"><p>초기화할까요?</p></dialog>',
    methods: { open: '(id) { document.getElementById(id).showModal() }', close: '(id) { document.getElementById(id).close() }' },
  }),
  ui('confirm-dialog', '삭제 확인 다이얼로그', '취소 흐름', '파일 삭제 전에 사용자에게 확인을 받습니다.', '삭제를 열고 취소한 다음 다시 열어 확인하세요.', '확인한 경우에만 파일 상태가 삭제됨으로 바뀝니다.', '삭제 상태 변경은 확인 버튼에서만 실행합니다.', 'Escape를 확인과 같은 상태 변경에 연결하지 마세요.', '복구가 어려운 작업은 버튼에 삭제 대상을 명시하세요.', '삭제 취소 기능을 추가해 보세요.', {
    data: { removed: false },
    template: `<p role="status">{{ $removed$ ? '보고서가 삭제됐습니다.' : '분기 보고서.pdf' }}</p>
<button :disabled="$removed$" @click="open">삭제</button>
<dialog id="confirm" aria-label="보고서 삭제"><p>분기 보고서를 삭제할까요?</p>
  <button autofocus @click="close">취소</button> <button @click="$removed$ = true; close()">보고서 삭제</button>
</dialog>`,
    start: '<p>분기 보고서.pdf</p><button>삭제</button><dialog><p>보고서를 삭제할까요?</p><button>취소</button><button>보고서 삭제</button></dialog>',
    methods: { open: '() { document.getElementById("confirm").showModal() }', close: '() { document.getElementById("confirm").close() }' },
  }),
  ui('alert-dialog', '알림 다이얼로그', 'alertdialog', '작업을 계속하기 전에 세션 만료 안내를 표시합니다.', '세션 만료를 누르고 안내를 확인하세요.', '확인 후 알림이 닫힙니다.', '긴급 메시지는 role과 aria-describedby로 스크린 리더에 이름과 설명을 전달합니다.', '일반 안내를 전부 긴급 알림으로 처리하면 사용 흐름을 방해합니다.', '버튼에는 확인 뒤 어떤 행동을 할지 적습니다.', '다시 로그인 경로로 이동시키는 상태를 추가해 보세요.', {
    template: `<button @click="open">세션 만료 테스트</button>
<dialog id="alert" role="alertdialog" aria-labelledby="alert-title" aria-describedby="alert-text">
  <h2 id="alert-title">세션 만료</h2><p id="alert-text">다시 로그인해 주세요.</p><button autofocus @click="close">확인</button>
</dialog>`,
    start: '<button>세션 만료 테스트</button><dialog><h2>세션 만료</h2><p>다시 로그인해 주세요.</p><button>확인</button></dialog>',
    methods: { open: '() { document.getElementById("alert").showModal() }', close: '() { document.getElementById("alert").close() }' },
  }),
  ui('toast', '자동으로 닫히는 토스트', 'setTimeout', '문서를 저장한 사실을 짧은 메시지로 알립니다.', '저장을 연속으로 누르세요.', '마지막 저장을 기준으로 메시지가 3초 뒤 닫힙니다.', '이전 타이머를 취소하고 새 타이머를 생성합니다.', '이전 예약을 남기면 새 메시지가 예상보다 빨리 사라집니다.', '컴포넌트가 사라질 때 타이머도 정리하세요.', '닫기 버튼을 추가해 보세요.', {
    level: '중급', template: '<button class="primary" @click="save">저장</button><div role="status"><p v-if="visible" class="panel">문서가 저장되었습니다.</p></div>',
    start: '<button class="primary">저장</button><div role="status"></div>',
    options: `export default {
  data: () => ({ visible: false, timer: null }),
  methods: { save() { clearTimeout(this.timer); this.visible = true; this.timer = setTimeout(() => this.visible = false, 3000) } },
  beforeUnmount() { clearTimeout(this.timer) },
}`,
    setup: `import { ref, onBeforeUnmount } from 'vue'
const visible = ref(false)
let timer
function save() {
  clearTimeout(timer)
  visible.value = true
  timer = setTimeout(() => visible.value = false, 3000)
}
onBeforeUnmount(() => clearTimeout(timer))`,
  }),
  ui('snackbar', '실행 취소 스낵바', 'Undo', '보관한 메시지를 즉시 복원할 수 있게 합니다.', '메시지를 보관하고 실행 취소를 누르세요.', '메시지가 받은 편지함으로 복구됩니다.', '보관 상태가 참일 때 취소 버튼을 보여 주고 버튼에서 상태를 되돌립니다.', '취소했을 때 원래 항목으로 초점을 옮기는 동작도 확인하세요.', '여러 번의 작업을 지원할 때는 작업 대상 ID를 함께 기록합니다.', '마지막 세 작업을 되돌리는 스택을 구현해 보세요.', {
    data: { archived: false },
    template: `<article v-if="!$archived$">새로운 피드백이 있습니다. <button @click="$archived$ = true">보관</button></article>
<div v-else class="panel"><span role="status">메시지를 보관했습니다.</span> <button @click="$archived$ = false">실행 취소</button></div>`,
    start: '<article>새로운 피드백이 있습니다. <button>보관</button></article><div role="status"></div>',
  }),
  ui('tooltip', '키보드를 지원하는 툴팁', 'aria-describedby', '용어의 짧은 설명을 인라인으로 제공합니다.', '도움말에 마우스를 올리거나 키보드 Tab으로 초점을 이동하세요.', '설명이 보이며 Escape로 숨길 수 있습니다.', '툴팁을 트리거의 설명 ID로 연결하고 포커스와 포인터 이벤트를 함께 처리합니다.', '툴팁에 클릭해야 하는 내용을 넣으면 키보드 이동이 어렵습니다.', '긴 내용이나 버튼이 필요하면 별도 팝오버를 사용하세요.', '포인터를 툴팁 위로 옮겨도 표시되게 개선해 보세요.', {
    data: { shown: false },
    template: `<button aria-describedby="note" @focus="$shown$ = true" @blur="$shown$ = false" @pointerenter="$shown$ = true" @pointerleave="$shown$ = false" @keydown.esc="$shown$ = false">캐시 도움말</button>
<span id="note" role="tooltip" :class="{ 'hint--hidden': !$shown$ }" class="hint">같은 응답을 재사용하기 위해 임시로 보관한 데이터입니다.</span>`,
    start: '<button aria-describedby="note">캐시 도움말</button><span id="note" role="tooltip">임시로 보관한 데이터</span>',
    css: '.hint { display: block; margin-top: 8px; background: #1e293b; color: white; padding: 8px; border-radius: 6px; }.hint--hidden { position: absolute; clip-path: inset(50%); }',
  }),
  ui('popover', '작업 팝오버', 'popover', '공유 메뉴에 링크와 공유 옵션을 표시합니다.', '공유를 눌러 열고 다른 영역을 누르거나 Escape를 누르세요.', '팝오버가 닫힙니다.', 'popover 속성은 툴바 위에 레이어를 올리고 가벼운 닫기 동작을 지원합니다.', '팝오버 ID와 popovertarget이 일치해야 합니다.', '예제의 링크는 실제 공유 URL로 교체할 수 있습니다.', '팝오버 안에 공유 완료 메시지를 추가해 보세요.', {
    template: '<button popovertarget="share">공유</button><aside id="share" popover aria-label="공유 옵션" class="panel"><label>공유 링크 <input readonly value="https://example.com/report"></label><button popovertarget="share" popovertargetaction="hide">닫기</button></aside>',
    start: '<button>공유</button><aside id="share" hidden><label>공유 링크 <input readonly value="https://example.com/report"></label></aside>',
  }),
  ui('context-menu', '컨텍스트 메뉴', 'contextmenu', '파일 위에서 작업 메뉴를 엽니다.', '파일을 오른쪽 클릭하거나 메뉴 버튼을 누르세요.', '메뉴에서 파일 작업을 선택하고 결과를 확인할 수 있습니다.', 'contextmenu 이벤트의 기본 동작을 막고 보이는 상태를 전환합니다.', '우클릭만 제공하면 터치나 키보드 이용자가 접근할 수 없습니다.', '화면 좌표를 사용한다면 화면 경계도 계산하세요.', 'Shift+F10 및 메뉴 키에 대한 동작을 확인해 보세요.', {
    data: { open: false, message: '' },
    template: `<article @contextmenu.prevent="$open$ = true" @keydown.esc="$open$ = false">
  보고서.pdf <button :aria-expanded="$open$" @click="$open$ = !$open$">파일 메뉴</button>
  <p v-if="$open$"><button @click="choose('이름 바꾸기')">이름 바꾸기</button> <button @click="choose('이동')">이동</button></p>
</article><p role="status">{{ $message$ }}</p>`,
    start: '<article>보고서.pdf <button>파일 메뉴</button><p hidden><button>이름 바꾸기</button></p></article><p role="status"></p>',
    methods: { choose: '(action) { ctx.message = action + " 선택"; ctx.open = false }' },
  }),
]

export default [...lessons, ...additionalUi].map((lesson, index) => defineExercise('ui', index + 1, lesson))
