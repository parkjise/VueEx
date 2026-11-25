import { guided, starterMarkup } from '../guided'

const rows = [
  ['props','Props로 데이터 전달','props','부모가 상품 이름을 바꿀 때 카드 제목이 반영됩니다.','이름을 편집하면 자식 카드의 제목이 변경됩니다.','정의한 props 인터페이스를 통해 자식 컴포넌트가 부모 데이터를 읽습니다.','자식에서 prop을 직접 변경하면 부모 값이 덮어쓸 수 있습니다.','별점이나 가격 prop을 추가하세요.',
    { label:'키보드' }, '<label>상품명 <input v-model="state.label"></label><Widget :title="state.label" />',
    "{ props:{ title:String }, setup(props){ return () => h('article', [h('h3',props.title || '이름 없음'), h('p','상품 정보')]) } }"],
  ['emit','Emit으로 자식 클릭 알리기','emit','자식의 알림 버튼 클릭을 부모에서 집계합니다.','버튼을 누르면 부모의 누적 횟수가 증가합니다.','자식이 approve 이벤트를 보내고 부모가 @approve에서 값을 수정합니다.','자식이 부모 이벤트 이름과 다른 이름을 보내면 핸들러가 호출되지 않습니다.','이벤트에 승인 ID를 포함해 보세요.',
    { total:0 }, '<Widget @approve="state.total++" /><p aria-live="polite">승인 {{ state.total }}건</p>',
    "{ emits:['approve'], setup(_, {emit}) { return () => h('button',{onClick:()=>emit('approve')},'승인') } }"],
  ['slot','기본 슬롯으로 내용 교체','default slot','공지 카드에 부모가 별도의 문구를 삽입합니다.','작성한 알림 문구가 카드의 본문에 들어갑니다.','기본 슬롯은 카드의 레이아웃과 소비자가 채우는 본문을 분리합니다.','기본 슬롯의 범위에는 부모 상태만 바로 노출됩니다.','슬롯이 비었을 때 기본 문구를 바꾸세요.',
    { message:'점검이 완료되었습니다.' }, '<label>안내 <input v-model="state.message"></label><Widget><strong>{{ state.message }}</strong></Widget>',
    "{ setup(_, {slots}) { return () => h('article',[h('h3','공지'), ...(slots.default?.() ?? ['안내 없음'])]) } }"],
  ['named-slot','이름 있는 슬롯으로 헤더와 바닥글','named slot','카드 헤더와 푸터를 화면마다 다르게 구성합니다.','저장 버튼은 푸터에 남고 제목을 편집할 수 있습니다.','슬롯 이름으로 동일한 부모 콘텐츠를 정확한 자리에 배치합니다.','슬롯 이름의 대소문자나 철자가 다르면 기본값이 나올 수 있습니다.','헤더 오른쪽에 보조 버튼 슬롯을 추가하세요.',
    { title:'편집자', saved:false }, '<Widget><template #heading><label>이름 <input v-model="state.title"></label></template><p>{{ state.title }}</p><template #actions><button @click="state.saved = true">저장</button></template></Widget><p v-if="state.saved" role="status">저장됨</p>',
    "{ setup(_, {slots}) { return () => h('article',[h('header', slots.heading?.()), h('section',slots.default?.()), h('footer',slots.actions?.())]) } }"],
  ['scoped-slot','Scoped Slot으로 행 데이터 노출','scoped slot','자식이 관리하는 항목을 부모가 원하는 형식으로 표시합니다.','강조를 켜거나 끄면 같은 항목의 표시 방식이 바뀝니다.','자식 슬롯 함수에 item을 넘기고 부모가 구조 분해로 읽습니다.','슬롯 props는 부모가 자유롭게 치환하는 읽기용 계약으로 생각하세요.','각 항목에 설명 슬롯을 추가해 보세요.',
    { emphasis:false }, '<label><input type="checkbox" v-model="state.emphasis"> 강조</label><Widget v-slot="{ item }"><strong v-if="state.emphasis">{{ item.name }}</strong><span v-else>{{ item.name }}</span></Widget>',
    "{ setup(_, {slots}) { const items=[{id:1,name:'검색'},{id:2,name:'알림'}]; return () => h('ul',items.map(item=>h('li',{key:item.id},slots.default?.({item})))) } }"],
  ['dynamic','동적 컴포넌트 선택','component :is','리포트와 안내 컴포넌트를 번갈아 장착합니다.','뷰를 바꾸면 같은 자리에 다른 컴포넌트가 나타납니다.','선택 상태가 컴포넌트 정의를 바꾸도록 computed로 연결합니다.','반응형 객체에 컴포넌트 정의를 그대로 넣으면 프록시 경고가 날 수 있습니다.','동적 컴포넌트에 공통 props를 전달하세요.',
    { report:true }, '<button @click="state.report = !state.report">보기 전환</button><component :is="selectedWidget" />',
    "{ render(){ return h('article','분기 보고서') } }",
    "const Alternate = { render(){ return h('article','보고서 작성 안내') } }", "selectedWidget(){return this.state.report ? Widget : Alternate}", "const selectedWidget = computed(() => state.report ? Widget : Alternate)"],
  ['model','컴포넌트 v-model 계약','update:modelValue','사용자 입력 컴포넌트가 부모의 문자열 모델과 동기화됩니다.','입력을 바꾸거나 부모의 초기화를 눌러도 두 값이 일치합니다.','기본 v-model은 modelValue와 update:modelValue를 연결합니다.','부모 값을 직접 수정하는 대신 이벤트로 새 값을 전달하세요.','모델에 trim을 적용해 보세요.',
    { profile:'지우' }, '<Widget v-model="state.profile" /><button @click="state.profile = \'\'">초기화</button><p>부모 상태: {{ state.profile }}</p>',
    "{ props:{modelValue:String},emits:['update:modelValue'],setup(props,{emit}){return ()=>h('label',['프로필 ',h('input',{value:props.modelValue,onInput:event=>emit('update:modelValue',event.target.value)})])} }"],
  ['provide-inject','Provide / Inject로 공통 테마 공유','inject','직접 props를 전달하지 않고 중첩된 위젯에서 테마를 읽습니다.','테마 스위치를 바꾸면 위젯의 상태가 갱신됩니다.','상위 컴포넌트가 상태 객체를 제공하고 자식이 같은 키로 읽습니다.','키가 다르면 기본값 또는 undefined가 나옵니다.','테마 수정은 제공자에서만 수행하도록 유지하세요.',
    { theme:'밝음' }, '<label>테마 <select v-model="state.theme"><option>밝음</option><option>어두움</option></select></label><Widget />',
    "{ setup(){const context=inject('exercise-theme',{theme:'기본'});return ()=>h('article','위젯 테마: '+context.theme)} }",
    '', '', '', "provide(){return {'exercise-theme':this.state}}", "provide('exercise-theme', state)"],
  ['composable','독립적인 카운터 Composable','composable','같은 카운터 두 개의 상태를 분리합니다.','A와 B를 눌러도 다른 쪽 카운트는 바뀌지 않습니다.','useCounter 호출 안에서 ref를 만들어 컴포넌트 인스턴스마다 값을 분리합니다.','ref를 함수 밖에 선언하면 모든 인스턴스가 공유합니다.','초기 값을 인자로 받도록 확장하세요.',
    {}, '<Widget name="프론트엔드" /><Widget name="디자인" />',
    "{ props:{name:String},setup(props){const {count,increase}=useCounter();return ()=>h('button',{onClick:increase},props.name+' '+count.value)} }",
    "function useCounter(){const count=ref(0); return {count,increase:()=>count.value++} }"],
  ['keep-alive','KeepAlive로 편집 상태 보존','KeepAlive','탭을 전환해도 임시 입력을 보존합니다.','메모를 작성하고 탭을 바꿨다가 돌아오면 메모가 남습니다.','KeepAlive가 동적 컴포넌트 인스턴스를 제거하는 대신 캐시합니다.','활성 상태와 마운트 상태는 다르므로 필요한 경우 onActivated를 사용하세요.','캐시 개수를 제한해 보세요.',
    { edit:true }, '<button @click="state.edit = !state.edit">보기 전환</button><KeepAlive><component :is="selectedWidget" /></KeepAlive>',
    "{ setup(){const note=ref('');return ()=>h('label',['메모 ',h('input',{value:note.value,onInput:event=>note.value=event.target.value})])} }",
    "const Alternate={ render(){return h('p','열어 본 자료가 없습니다.')} }", "selectedWidget(){return this.state.edit?Widget:Alternate}", "const selectedWidget=computed(()=>state.edit?Widget:Alternate)"],
  ['teleport','Teleport로 모달 레이어 이동','Teleport','툴바가 잘린 영역 안에 있어도 안내가 최상위에 렌더됩니다.','도움말을 열면 겹침 영역 밖에 안내가 보입니다.','Teleport가 실제 DOM 위치를 바꿔도 컴포넌트 상태의 부모 관계는 유지합니다.','Teleport 대상이 아직 DOM에 없으면 이동에 실패할 수 있습니다.','모달 키보드 초점 복원도 연결하세요.',
    { open:false }, '<div class="clip"><button @click="state.open = true">도움말 열기</button><Teleport to="body"><Widget v-if="state.open" @close="state.open = false" /></Teleport></div>',
    "{ emits:['close'],setup(_,{emit}){return ()=>h('aside',{ class:'floating-help',role:'status'},[h('p','기록은 현재 브라우저에 저장됩니다.'),h('button',{onClick:()=>emit('close')},'닫기')])} }",
    '', '', '', '', '', '.clip { overflow:hidden; height:48px; }.floating-help { position:fixed; bottom:10px; inset-inline:10px; padding:12px; background:#e5f6ee; border-radius:8px; }'],
  ['transition','Transition으로 안내 바꾸기','Transition','저장 안내가 나타날 때 투명도를 전환합니다.','버튼으로 상태를 토글하면 전환하고 닫힙니다.','Transition은 나타날 때와 사라질 때 각각 CSS 클래스를 지정합니다.','여러 루트 노드를 그대로 감싸면 의도한 요소의 전환을 찾기 어렵습니다.','운영체제의 움직임 감소 설정을 적용해 보세요.',
    { show:false }, '<button :aria-expanded="state.show" @click="state.show = !state.show">저장 안내</button><Transition name="note-fade"><Widget v-if="state.show" /></Transition>',
    "{render(){return h('article','변경 내역이 저장되었습니다.')} }",
    '', '', '', '', '', '.note-fade-enter-active,.note-fade-leave-active { transition:opacity 220ms; }.note-fade-enter-from,.note-fade-leave-to { opacity:0; } @media(prefers-reduced-motion:reduce){.note-fade-enter-active,.note-fade-leave-active{transition:none}}'],
  ['transition-group','TransitionGroup 목록 변경','TransitionGroup','축소 애니메이션을 사용해 목록에서 항목을 지웁니다.','각 항목을 클릭하면 자기 항목만 전환과 함께 제거됩니다.','TransitionGroup은 각각의 고유 키를 사용해 추가 또는 제거를 추적합니다.','인덱스 키는 배열이 바뀔 때 다른 항목에 배정될 수 있습니다.','추가 전환과 위치 이동 전환을 구현해 보세요.',
    { items:['알림','보고서','가이드'] }, '<TransitionGroup name="row-fade" tag="ul"><li v-for="item in state.items" :key="item"><Widget :name="item" @remove="state.items = state.items.filter(value => value !== item)" /></li></TransitionGroup>',
    "{props:{name:String},emits:['remove'],setup(props,{emit}){return ()=>h('button',{onClick:()=>emit('remove')},props.name+' 삭제')} }",
    '', '', '', '', '', '.row-fade-leave-active { transition:opacity 190ms; }.row-fade-leave-to { opacity:0; }'],
  ['button','공통 버튼 변형과 속성 전달','$attrs','동일한 버튼 구성에서 스타일과 disabled 상태를 제어합니다.','변형에 따라 색이 달라지고 비활성 버튼은 클릭할 수 없습니다.','상속 속성과 prop을 별도로 명시해 실제 button에 전달합니다.','disabled가 감싸는 div에 붙으면 실제 버튼은 비활성화되지 않습니다.','로딩 변형을 추가하고 aria-busy를 연결하세요.',
    { disabled:false, hits:0 }, '<label><input type="checkbox" v-model="state.disabled"> 저장 막기</label><Widget variant="primary" :disabled="state.disabled" @click="state.hits++">저장</Widget><Widget @click="state.hits++">미리보기</Widget><p>{{ state.hits }}회 실행</p>',
    "{inheritAttrs:false,props:{variant:String},setup(props,{slots,attrs}){return ()=>h('button',{type:'button',...attrs,class:props.variant==='primary'?'primary':''},slots.default?.())} }"],
  ['input','레이블과 오류가 있는 공통 Input','aria-describedby','재사용 입력이 에러 메시지와 모델을 연결합니다.','사용자명을 입력하면 현재 값과 오류가 갱신됩니다.','공통 입력마다 useId로 서로 다른 연결 ID를 만듭니다.','페이지의 모든 input에 같은 고정 ID를 사용하지 마세요.','도움말과 오류 양쪽 ID를 연결하세요.',
    { name:'' }, '<Widget v-model="state.name" label="사용자 이름" :error="state.name.length < 3 ? \'3자 이상 입력하세요.\' : \'\'" /><p>{{ state.name }}</p>',
    "{props:{modelValue:String,label:String,error:String},emits:['update:modelValue'],setup(props,{emit}){const id=useId();return ()=>h('section',[h('label',{for:id},props.label),h('input',{id,value:props.modelValue,'aria-describedby':props.error?id+'-error':undefined,'aria-invalid':Boolean(props.error),onInput:e=>emit('update:modelValue',e.target.value)}),props.error&&h('p',{id:id+'-error'},props.error)])} }"],
  ['modal','재사용 모달의 열림 계약','dialog · watch','모달 자식이 열림 상태를 받고 부모는 닫힘을 통지받습니다.','확인 버튼과 Escape가 부모의 열린 상태를 모두 해제합니다.','부모 값을 감시해 dialog 메서드를 호출하고 닫힘 이벤트를 부모 모델로 전달합니다.','HTML open 속성만 쓰면 showModal의 포커스 동작을 잃습니다.','모달에 동작 슬롯을 추가해 보세요.',
    { open:false }, '<button @click="state.open = true">정책 열기</button><Widget v-model="state.open" title="서비스 정책"><p>구독은 언제든 취소할 수 있습니다.</p></Widget><p>열림: {{ state.open }}</p>',
    "{props:{modelValue:Boolean,title:String},emits:['update:modelValue'],setup(props,{emit,slots}){const dialog=ref(null);watch(()=>props.modelValue,value=>{const el=dialog.value;if(value&&!el.open)el.showModal();if(!value&&el.open)el.close()});return ()=>h('dialog',{ref:dialog,'aria-label':props.title,onClose:()=>emit('update:modelValue',false)},[h('h2',props.title),slots.default?.(),h('button',{onClick:()=>emit('update:modelValue',false)},'닫기')])} }"],
  ['data-table','재사용 Data Table 컬럼 정의','동적 컬럼','컬럼 배열을 전달하여 표의 구조를 바꿉니다.','권한 열의 표시 여부가 헤더와 셀에 함께 반영됩니다.','자식 테이블은 행과 열을 받아 열 key로 각 행의 값을 읽습니다.','헤더와 데이터 셀이 다른 순서가 되면 연결이 끊깁니다.','열별 scoped slot을 추가하세요.',
    { extra:false, rows:[{id:1,name:'지우',role:'편집자'},{id:2,name:'민호',role:'관리자'}], columns:[{key:'name',label:'이름'},{key:'role',label:'권한'}] },
    '<label><input type="checkbox" v-model="state.extra"> 권한 열 표시</label><Widget :columns="state.extra ? state.columns : state.columns.slice(0,1)" :rows="state.rows" />',
    "{props:{columns:Array,rows:Array},setup(props){return ()=>h('table',[h('caption','사용자'),h('thead',[h('tr',props.columns.map(column=>h('th',{key:column.key,scope:'col'},column.label)))]),h('tbody',props.rows.map(row=>h('tr',{key:row.id},props.columns.map(column=>h('td',{key:column.key},row[column.key])))))])} }"],
  ['pagination','재사용 페이지 이동 컴포넌트','props · emit','페이지 이동을 컴포넌트 밖의 데이터에 연결합니다.','페이지 변경 이벤트가 부모의 표시 데이터를 바꿉니다.','자식은 이동 가능한 번호를 결정해 emit하고 부모가 실제 페이지 상태를 소유합니다.','페이지 자식과 부모가 각각 페이지 값을 저장하면 불일치하기 쉽습니다.','페이지 크기가 바뀌면 경계를 다시 맞추세요.',
    { page:1, pages:3, content:['개요 안내','설정 방법','문제 해결'] }, '<p>{{ state.content[state.page - 1] }}</p><Widget :page="state.page" :pages="state.pages" @change="state.page = $event" />',
    "{props:{page:Number,pages:Number},emits:['change'],setup(props,{emit}){return ()=>h('nav',{'aria-label':'페이지'},[h('button',{disabled:props.page===1,onClick:()=>emit('change',props.page-1)},'이전'),h('span',' '+props.page+' / '+props.pages+' '),h('button',{disabled:props.page===props.pages,onClick:()=>emit('change',props.page+1)},'다음')])} }"],
  ['fallthrough','Fallthrough 속성의 대상 정하기','inheritAttrs','복합 입력의 placeholder를 실제 입력 엘리먼트에 적용합니다.','힌트 입력을 변경하면 검색 필드 placeholder가 변경됩니다.','inheritAttrs를 끄고 원하는 자식 요소에 attrs를 전달합니다.','다중 루트 컴포넌트는 기본 상속 대상이 명확하지 않습니다.','이벤트와 aria-describedby도 실제 입력으로 전달하세요.',
    { placeholder:'문서를 검색하세요.' }, '<label>힌트 <input v-model="state.placeholder"></label><Widget :placeholder="state.placeholder" type="search" />',
    "{inheritAttrs:false,setup(_,{attrs}){return ()=>h('div',{class:'panel'},[h('label',['문서 검색 ',h('input',attrs)])])} }"],
  ['expose','공개된 컴포넌트 메서드 호출','expose · template ref','부모 버튼에서 자식 검색 입력으로 초점을 이동합니다.','포커스 버튼을 누른 뒤 바로 입력할 수 있습니다.','자식 setup의 expose에 제한된 focus 메서드를 등록합니다.','내부 구현 객체 전체를 노출하면 자식 구조 변경이 어려워집니다.','값을 지우는 별도의 메서드도 공개하세요.',
    {}, '<button @click="focusChild">검색 입력으로 이동</button><Widget ref="child" />',
    "{setup(_,{expose}){const input=ref(null);expose({focus:()=>input.value?.focus()});return ()=>h('label',['검색 ',h('input',{ref:input,type:'search'})])} }",
    '', '', 'const child = ref(null)\nfunction focusChild(){ child.value?.focus() }', "methods:{focusChild(){this.$refs.child?.focus()}}"],
  ['named-model','이름을 지정한 두 개의 v-model','v-model:','가격 범위의 최소값과 최대값을 독립적으로 모델링합니다.','각 입력 변경이 맞는 부모 필드에 반영됩니다.','두 모델은 서로 다른 prop과 update 이벤트를 갖습니다.','두 값을 모두 update:modelValue로 보내면 어느 필드인지 알 수 없습니다.','최댓값이 최솟값보다 낮을 때 오류 메시지를 추가하세요.',
    { min:1000,max:5000 }, '<Widget v-model:min="state.min" v-model:max="state.max" /><p>{{ state.min }} ~ {{ state.max }}원</p>',
    "{props:{min:Number,max:Number},emits:['update:min','update:max'],setup(props,{emit}){return ()=>h('fieldset',[h('legend','가격 범위'),...['min','max'].map((key,i)=>h('label',{key},[i?'최대 ':'최소 ',h('input',{type:'number',value:props[key],onInput:e=>emit('update:'+key,Number(e.target.value))})]))])} }"],
  ['recursive','재귀 폴더 컴포넌트','재귀 컴포넌트','중첩 개수가 다른 폴더 트리를 하나의 컴포넌트로 출력합니다.','폴더를 펼치면 하위 노드가 재귀적으로 표시됩니다.','자식 노드가 있을 때만 같은 컴포넌트를 더 작은 입력으로 호출합니다.','끝 조건이 없으면 무한 재귀로 렌더링이 끝나지 않습니다.','각 파일에 선택 이벤트를 전달해 보세요.',
    { node:{id:'root',name:'프로젝트',children:[{id:'src',name:'src',children:[{id:'app',name:'App.vue'}]},{id:'readme',name:'README.md'}]} }, '<Widget :node="state.node" />',
    "{name:'FolderNode',props:{node:{type:Object,required:true}},setup(props){return ()=>props.node.children?.length ? h('details',[h('summary',props.node.name),h('ul',props.node.children.map(node=>h('li',{key:node.id},[h(Widget,{node})])))]) : h('span',props.node.name)} }"],
  ['renderless','렌더리스 상태 컴포넌트','scoped slot · renderless','공통 토글 기능을 다른 레이아웃에서 사용합니다.','버튼으로 여닫고 부모가 작성한 본문을 표시합니다.','자식은 화면 구조 없이 슬롯에 open과 toggle만 전달합니다.','항상 UI를 렌더하는 컴포넌트와 상태만 제공하는 컴포넌트를 구분해 설계하세요.','같은 토글 상태를 이용하는 모바일 드로어 예제를 만들어 보세요.',
    {}, '<Widget v-slot="{ open, toggle }"><button :aria-expanded="open" @click="toggle">보기 전환</button><article v-if="open">사용 안내</article></Widget>',
    "{setup(_,{slots}){const open=ref(false);const toggle=()=>open.value=!open.value;return ()=>slots.default?.({open:open.value,toggle})} }"],
  ['slot-fallback','슬롯 기본값으로 빈 상태 제공','slot fallback','사용자에게 지정 문구가 없을 때 공통 빈 상태를 표시합니다.','전환 버튼으로 기본 문구와 사용자 지정 내용을 비교합니다.','슬롯이 없거나 의미 있는 VNode가 없을 때 기본 내용을 반환합니다.','공백 슬롯이나 조건부 주석 노드를 그대로 표시 데이터로 처리하지 않습니다.','기본 상태의 아이콘을 사용자 슬롯으로 바꿔 보세요.',
    { custom:false }, '<button :aria-pressed="state.custom" @click="state.custom = !state.custom">지정 문구</button><Widget><p v-if="state.custom">필터를 바꿔 다시 검색하세요.</p></Widget>',
    "{setup(_,{slots}){return ()=>{const content=slots.default?.().filter(node=>node.type!==Comment);return h('article',content?.length?content:[h('p','표시할 항목이 없습니다.')])}} }"],
  ['prop-defaults','기본 Props 값과 유효성 계약','prop defaults','필요한 경우에만 색상 변형을 덮어씁니다.','기본 값과 경고 색상을 전환할 수 있습니다.','prop 기본값을 설정하고 가능한 변형에 validator를 정의합니다.','객체를 기본값으로 쓰면 함수로 새 인스턴스를 반환해야 합니다.','제목 기본값을 프로젝트 공통 문구로 변경하세요.',
    { warning:false }, '<label><input type="checkbox" v-model="state.warning"> 경고 스타일</label><Widget :tone="state.warning ? \'warn\' : undefined" />',
    "{props:{tone:{type:String,default:'info',validator:value=>['info','warn'].includes(value)},title:{type:String,default:'문서 상태'}},setup(props){return ()=>h('article',{class:'tone-'+props.tone},[h('strong',props.title),h('p',props.tone==='warn'?'검토 필요':'정상')])} }",
    '', '', '', '', '', '.demo .tone-warn { background:#fff0d5; color:#813c19; }'],
]

export default guided('components', rows.map(([slug,title,keyword,task,finish,guide,error,challenge,state,template,widget,shared = '', computedOption = '', setupExtra = '', optionExtra = '', provider = '', css = '']) => {
  const imports = "import { h, ref, reactive, computed, watch, inject, provide, useId, Comment } from 'vue'"
  const child = `const Widget = ${widget}`
  const initial = JSON.stringify(state)
  const options = `${imports}\n${shared}\n${child}\n\nexport default {
  components: { Widget },
  data: () => ({ state: ${initial} }),
  ${computedOption ? `computed: { ${computedOption} },` : ''}
  ${optionExtra}
}`
  const setup = `${imports}\n${shared}\n${child}\n\nconst state = reactive(${initial})\n${setupExtra}\n${provider}`
  const starter = starterMarkup(template).replace(/<Widget\s*\/>/g, '<article><!-- TODO: 공통 컴포넌트 --></article>')
    .replace(/<Widget(?=[\s>])/g, '<article').replace(/<\/Widget>/g, '</article>')
    .replace(/\s#\w+/g, '')
    .replace(/<\/?(?:KeepAlive|TransitionGroup|Transition|Teleport)\b[^>]*>/g, '')
  return [slug,title,[keyword,'Vue 컴포넌트'],task,finish,guide,error,'공통 컴포넌트에는 외부에서 필요한 값과 동작만 명시적으로 공개하세요.',challenge,{
    template,start:starter,options,setup,css,mockData:state,level:'중급',
  }]
}))
