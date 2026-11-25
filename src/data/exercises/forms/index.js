import { guided } from '../guided'

const field = (key, label, type = 'text', extra = {}) => ({ key, label, type, ...extra })
const email = field('email','이메일','email',{ autocomplete:'email' })
const password = field('password','비밀번호','password',{ autocomplete:'new-password' })
const name = field('name','이름')
const phone = field('phone','연락처','tel',{ autocomplete:'tel' })
const emailRegex = '/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/'
const validEmail = `${emailRegex}.test(ctx.values.email || '')`

const rows = [
  ['login','로그인 입력 검증','이메일과 비밀번호가 없는 제출을 막습니다.','유효한 이메일과 비밀번호를 입력해야 모의 로그인이 완료됩니다.', '두 필드를 차례로 검사하고 처음 실패한 메시지를 화면에 표시합니다.', '이 예제의 완료는 인증이 아니라 로컬 입력 검증 결과입니다.', '서버에서 잘못된 비밀번호 오류를 반환하는 흐름을 추가하세요.',
    [email, { ...password, autocomplete:'current-password' }], `!${validEmail} ? '이메일 주소를 확인하세요.' : !ctx.values.password ? '비밀번호를 입력하세요.' : ''`],
  ['signup','회원가입 필수 항목 검증','회원 이름과 로그인 정보를 받고 이용 약관 동의를 검사합니다.','이름, 이메일, 8자리 이상 비밀번호, 약관을 모두 입력하면 제출됩니다.','개인 정보 검사와 동의 상태를 분리하고 동의는 체크박스의 참·거짓으로 읽습니다.','안내에 표시된 필수 조건과 제출 로직의 필수 조건을 일치시키세요.','선택 이메일 알림 여부를 추가하세요.',
    [name,email,password,field('terms','이용 약관에 동의합니다','checkbox')],`!ctx.values.name?.trim() ? '이름을 입력하세요.' : !${validEmail} ? '이메일 주소를 확인하세요.' : (ctx.values.password?.length ?? 0) < 8 ? '비밀번호를 8자 이상 입력하세요.' : !ctx.values.terms ? '이용 약관에 동의하세요.' : ''`],
  ['required','공백을 제외한 필수 입력','문의 제목의 공백 제출을 막습니다.','공백만 제출하면 메시지가 나오고 글자를 입력하면 통과합니다.','trim으로 앞뒤 공백을 정리한 뒤 빈 문자열인지 확인합니다.','required만 적용한 텍스트 필드는 공백 문자열을 거절하지 않을 수 있습니다.','공백 제거 후 최대 길이도 검사해 보세요.',
    [field('subject','문의 제목')],"ctx.values.subject?.trim() ? '' : '문의 제목을 입력하세요.'"],
  ['email','이메일 주소 형식 검사','뉴스레터에 형식이 맞는 이메일만 받습니다.','잘못된 형식을 제출했을 때 오류를 읽을 수 있습니다.','간단한 형식 검사는 @ 앞뒤의 토큰과 도메인 점을 확인합니다.','형식을 통과해도 실제 수신 가능한 주소라는 뜻은 아닙니다.','중복 구독 요청 처리도 만들어 보세요.',
    [email],`${validEmail} ? '' : 'name@example.com 형식으로 입력하세요.'`],
  ['password-strength','비밀번호 길이와 조합 검사','계정 설정에서 길이와 문자 유형을 확인합니다.','영문과 숫자를 포함한 10자 이상만 통과합니다.','길이와 각 문자 분류를 별도의 조건으로 읽어 검사합니다.','초기 입력이 없을 때도 검사 표현식이 작동하도록 기본값을 두세요.','어떤 조건을 충족했는지 체크리스트로 보여 주세요.',
    [password],"ctx.values.password?.length >= 10 && /[a-z]/i.test(ctx.values.password) && /[0-9]/.test(ctx.values.password) ? '' : '영문과 숫자를 포함해 10자 이상 입력하세요.'"],
  ['password-match','비밀번호 일치 검사','비밀번호 재입력값을 첫 번째 입력과 비교합니다.','빈 값과 다른 비밀번호는 모두 제출되지 않습니다.','처음 값이 비었는지를 확인한 다음 두 값을 동일성으로 비교합니다.','두 값이 빈 채로 같다는 이유로 합격시키면 안 됩니다.','첫 번째 값을 바꿨을 때 즉시 일치 오류를 갱신하세요.',
    [password,field('confirm','비밀번호 확인','password')],"ctx.values.password && ctx.values.password === ctx.values.confirm ? '' : '비밀번호와 확인 값이 일치해야 합니다.'"],
  ['phone','전화번호 형식과 입력 방식','상담 폼에서 전화번호의 표시 형식을 검증합니다.','하이픈으로 구분한 휴대전화 번호만 통과합니다.','type=tel은 숫자 키보드 힌트를 주고 정규식이 형식을 검사합니다.','type=number는 선행 0과 구분 기호를 다루기 어렵습니다.','하이픈 없이 입력해도 같은 형식으로 변환해 보세요.',
    [phone],"/^01[016789]-[0-9]{3,4}-[0-9]{4}$/.test(ctx.values.phone || '') ? '' : '010-1234-5678 형식으로 입력하세요.'"],
  ['numeric','정수 수량 범위 검사','좌석 신청 수를 1에서 6으로 제한합니다.','소수점, 빈 값, 범위 밖은 모두 거절됩니다.','빈 문자열을 먼저 거른 뒤 Number와 Number.isInteger를 사용합니다.','Number(빈 문자열)은 0이므로 빈 값 검사와 범위 검사를 분리하세요.','재고 수량을 동적으로 상한에 사용하세요.',
    [field('count','좌석 수','number',{ min:1,max:6 })],"Number.isInteger(Number(ctx.values.count)) && Number(ctx.values.count) >= 1 && Number(ctx.values.count) <= 6 ? '' : '좌석 수는 1~6의 정수여야 합니다.'"],
  ['reset','초깃값과 폼 리셋','요청 작성 폼의 모든 입력을 처음 값으로 돌립니다.','초기화 후 기본 주제와 원래 이름이 표시됩니다.','초기값 사본으로 값을 교체하고 오류와 제출 상태를 같이 비웁니다.','네이티브 폼 초기화와 Vue의 모델 값이 어긋나지 않도록 단일 경로를 사용하세요.','편집 후 초기화를 확인하는 절차를 추가하세요.',
    [name,field('topic','주제','select',{options:['문의','개선 요청']})],"ctx.values.name?.trim() ? '' : '이름을 작성하세요.'", { name:'작성자',topic:'문의' }],
  ['dynamic','신청 종류에 따른 동적 필드','팀 신청일 때만 팀 이름을 입력받습니다.','개인으로 전환하면 팀 입력이 사라지고 팀 값 검사가 제외됩니다.','선택한 유형으로 필드 렌더링 조건과 검증 조건을 동일하게 구성합니다.','숨긴 값을 서버로 보내지 않을지 정책을 정하세요.','유형을 변경하면 사용하지 않는 값을 자동으로 비워 보세요.',
    [field('kind','신청 종류','select',{options:['개인','팀']}),field('team','팀 이름','text',{when:['kind','팀']})],"ctx.values.kind === '팀' && !ctx.values.team?.trim() ? '팀 이름을 입력하세요.' : ''", { kind:'개인' }],
  ['multi','다중 선택 개수 검사','희망 교육 분야를 두 개 선택합니다.','정확히 두 분야를 선택할 때만 신청이 완료됩니다.','체크박스 배열의 length로 선택 개수를 셉니다.','같은 값이 있는 선택지들이 하나로 합쳐질 수 있습니다.','세 번째 선택을 비활성화하되 기존 해제는 유지하세요.',
    [field('topics','희망 교육','checks',{options:['Vue','접근성','CSS','테스트']})],"ctx.values.topics?.length === 2 ? '' : '두 분야를 선택하세요.'", { topics:[] }],
  ['live','실시간 입력 오류 갱신','프로젝트 식별자의 형식을 작성 도중 안내합니다.','수정하는 즉시 유효 표시 또는 오류가 바뀝니다.','실시간 모드에서는 현재 입력으로부터 계산한 오류를 바로 보여 줍니다.','첫 화면부터 오류로 보이지 않도록 입력 시작 또는 포커스 이탈을 기준으로도 검토하세요.','서버 중복 검사에는 디바운스를 적용해 보세요.',
    [field('slug','프로젝트 식별자')],"/^[a-z][a-z0-9-]{2,19}$/.test(ctx.values.slug || '') ? '' : '영문 소문자로 시작하는 3~20자를 입력하세요.'", { slug:'vueex' }, { live:true }],
  ['address','주소와 우편번호 검사','배송지의 필수 필드와 우편번호 형식을 확인합니다.','주소와 5자리 우편번호를 모두 쓰면 제출됩니다.','우편번호는 수치가 아닌 선행 0을 유지하는 문자열로 검사합니다.','주소 형식을 특정 구두점이나 공백 형태로 제한하지 마세요.','별도 상세주소 필드를 추가해 보세요.',
    [field('zip','우편번호','text',{ autocomplete:'postal-code', inputmode:'numeric' }),field('address','주소','text',{ autocomplete:'street-address' })],"/^[0-9]{5}$/.test(ctx.values.zip || '') && ctx.values.address?.trim() ? '' : '5자리 우편번호와 주소를 작성하세요.'"],
  ['file','파일 형식과 크기 검사','신청서 첨부 PDF를 2MB 이하로 제한합니다.','비어 있거나 크기·형식이 잘못된 파일에 안내가 표시됩니다.','File의 type과 size에서 검증에 필요한 값을 읽습니다.','accept는 안내용 필터이고 서버에서도 실제 파일을 검사해야 합니다.','여러 첨부물의 전체 크기를 계산해 보세요.',
    [field('attachment','첨부 신청서','file',{accept:'application/pdf'})],"ctx.values.attachment?.type === 'application/pdf' && ctx.values.attachment.size <= 2000000 ? '' : '2MB 이하의 PDF 파일을 선택하세요.'"],
  ['submit-state','제출 버튼 활성화 제어','필수 확인을 모두 해야 기록을 제출할 수 있습니다.','두 확인을 체크하면 버튼이 활성화되며 하나를 해제하면 비활성화됩니다.','현재 값에서 제출 가능 여부를 파생하고 제출 이벤트에서도 재검사합니다.','disabled는 서버 유효성 검사를 대체하지 않습니다.','비활성 상태의 조건을 컨트롤 근처에 표시하세요.',
    [field('checked','기록을 읽었습니다','checkbox'),field('verified','내용을 확인했습니다','checkbox')],"ctx.values.checked && ctx.values.verified ? '' : '두 가지 확인이 필요합니다.'", {}, { guard:true }],
  ['date-range','날짜 범위 폼 검증','휴가 신청의 시작일과 종료일 순서를 검사합니다.','종료일이 시작일과 같거나 이후일 때 통과합니다.','빈 날짜를 먼저 검사하고 HTML 날짜 문자열을 사전식으로 비교합니다.','UTC Date 객체로 바꾸면 시간대 문제로 로컬 날짜가 달라질 수 있습니다.','신청 가능 일수와 휴일을 검증해 보세요.',
    [field('from','시작일','date'),field('until','종료일','date')],"ctx.values.from && ctx.values.until && ctx.values.until >= ctx.values.from ? '' : '시작일 이후의 종료일을 선택하세요.'"],
  ['url','웹 링크 프로토콜 검증','팀 사이트로 연결되는 링크를 입력받습니다.','https 주소가 올바를 때만 제출됩니다.','URL 생성으로 구조를 검사하고 protocol을 허용 목록으로 제한합니다.','프로토콜만 검사하면 호스트 없는 잘못된 주소를 놓칠 수 있습니다.','사내 도메인 허용 목록을 추가하세요.',
    [field('url','사이트 주소','url')],"(() => { try { const url = new URL(ctx.values.url); return url.protocol === 'https:' && url.hostname.includes('.') ? '' : 'https 공개 도메인 주소를 입력하세요.' } catch { return 'https 공개 도메인 주소를 입력하세요.' } })()"],
  ['length','메시지 최대 길이 검증','고객 문의 내용을 10~120자로 제한합니다.','너무 짧은 내용과 긴 내용이 각각 안내됩니다.','공백을 정리한 길이를 구한 뒤 양 끝 경계를 검사합니다.','이모지와 한글 조합 문자에서는 단순 length와 보이는 글자 수가 다를 수 있습니다.','남은 길이를 실시간으로 표시해 보세요.',
    [field('body','문의 내용','textarea')],"(() => { const length = (ctx.values.body || '').trim().length; return length < 10 ? '10자 이상 입력하세요.' : length > 120 ? '120자 이내로 입력하세요.' : '' })()"],
  ['number-total','두 입력으로 합계 한도 검사','두 가지 유형의 티켓을 예약하며 전체 최대 수를 확인합니다.','두 티켓 수의 합이 1~5장이어야 합니다.','숫자 변환 후 각 값의 정수 여부와 범위, 총합을 모두 검사합니다.','합계만 확인하면 음수와 양수가 서로 상쇄될 수 있습니다.','유형별 최대 수를 별도로 적용하세요.',
    [field('adult','성인','number',{min:0}),field('child','어린이','number',{min:0})],"(() => { const values = [Number(ctx.values.adult || 0), Number(ctx.values.child || 0)]; const total = values[0] + values[1]; return values.every(n => Number.isInteger(n) && n >= 0) && total >= 1 && total <= 5 ? '' : '0 이상 정수를 사용하고 합계를 1~5장으로 맞추세요.' })()", { adult:0,child:0 }],
  ['consent','연락 채널 조건부 검증','SMS 또는 이메일 수신 동의에 따라 해당 연락처를 검사합니다.','선택한 채널에 맞는 형식만 검사합니다.','선택값을 기준으로 분기해 각 연락처의 형식 조건을 적용합니다.','선택한 채널의 필드에만 필요한 오류를 안내하세요.','수신 거부 선택지를 추가하면 입력 없이 제출할 수 있게 하세요.',
    [field('channel','채널','select',{options:['이메일','문자']}),{...email,when:['channel','이메일']},{...phone,when:['channel','문자']}],`ctx.values.channel === '이메일' ? (${validEmail} ? '' : '이메일 형식을 확인하세요.') : (/^010-[0-9]{4}-[0-9]{4}$/.test(ctx.values.phone || '') ? '' : '전화번호 형식을 확인하세요.')`, { channel:'이메일' }],
]

const template = `<form id="exercise-form" novalidate @submit.prevent="submit">
  <template v-for="field in $fields$" :key="field.key">
    <div v-if="!field.when || $values$[field.when[0]] === field.when[1]">
      <fieldset v-if="field.type === 'checks'"><legend>{{ field.label }}</legend>
        <label v-for="option in field.options" :key="option"><input type="checkbox" :value="option" v-model="$values$[field.key]"> {{ option }}</label>
      </fieldset>
      <label v-else-if="field.type === 'checkbox'"><input type="checkbox" v-model="$values$[field.key]"> {{ field.label }}</label>
      <label v-else>{{ field.label }}
        <select v-if="field.type === 'select'" v-model="$values$[field.key]"><option v-for="option in field.options" :key="option">{{ option }}</option></select>
        <textarea v-else-if="field.type === 'textarea'" v-model="$values$[field.key]" rows="3"></textarea>
        <input v-else-if="field.type === 'file'" type="file" :accept="field.accept" @change="rememberFile(field.key, $event)">
        <input v-else :type="field.type" v-model="$values$[field.key]" :min="field.min" :max="field.max" :autocomplete="field.autocomplete" :inputmode="field.inputmode">
      </label>
    </div>
  </template>
  <button type="submit" :disabled="$guard$ && Boolean(validation)">제출</button> <button type="button" @click="reset">초기화</button>
  <p v-if="($attempted$ || $live$ || $guard$) && validation" role="status">{{ validation }}</p>
  <p v-else-if="$attempted$" role="status">입력 검증을 통과했습니다.</p>
</form>`

export default guided('forms', rows.map(([slug,title,task,finish,guide,error,challenge,fields,validation,initial = {}, flags = {}]) => {
  const inputs = fields.map(field => field.type === 'select'
    ? `<label>${field.label} <select>${field.options.map(item => `<option>${item}</option>`).join('')}</select></label>`
    : field.type === 'checks'
      ? `<fieldset><legend>${field.label}</legend>${field.options.map(item => `<label><input type="checkbox"> ${item}</label>`).join('')}</fieldset>`
      : field.type === 'textarea'
        ? `<label>${field.label} <textarea rows="3"></textarea></label>`
        : `<label>${field.label} <input type="${field.type}"></label>`).join('\n')
  return [slug,title,['폼 검증', ...fields.map(field => field.type).filter((type,i,all) => all.indexOf(type) === i)],task,finish,guide,error,
    '포커스를 입력에 유지할지 오류 요약으로 이동할지 검토하고 실제 저장 전 서버 검증을 적용하세요.',challenge,
    { template, start: `<form @submit.prevent>\n${inputs}\n<button type="submit">제출</button> <button type="button">초기화</button><p role="status"></p>\n</form>`,
      data:{ fields, initial, values:initial, attempted:false, live:!!flags.live, guard:!!flags.guard },
      computed: { validation: `() { return ${validation} }` },
      methods: {
        submit: '() { ctx.attempted = true }',
        rememberFile: '(key, event) { const file = event.target.files[0]; ctx.values[key] = file ? { type: file.type, size: file.size, name: file.name } : null }',
        reset: '() { ctx.values = JSON.parse(JSON.stringify(ctx.initial)); ctx.attempted = false; document.getElementById("exercise-form").reset() }',
      },
    },
  ]
}))
