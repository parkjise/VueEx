import { guided, starterMarkup } from '../guided'

const rows = [
  ['todo','투두 리스트','상태 관리 · 필터','할 일을 기록하고 완료 상태와 목록 필터를 관리합니다.',
    '항목을 등록하고 하나를 완료한 뒤 미완료 필터를 선택하세요. 항목 삭제도 확인하세요.',
    '입력 초안과 항목 배열, 상태 필터를 분리합니다. 남은 항목과 표시할 배열은 computed로 파생합니다.',
    '항목 이름이나 배열 길이를 고유 ID로 쓰지 마세요.', '마감일과 필터별 개수, 브라우저 저장 기능을 추가하세요.',
    { data:{ draft:'',items:[{id:1,title:'실습 노트 읽기',done:false},{id:2,title:'탭 구현',done:true}],filter:'전체',next:3 },
      computed:{ visible:'() { return ctx.items.filter(item => ctx.filter === "전체" || item.done === (ctx.filter === "완료")) }', remaining:'() { return ctx.items.filter(item=>!item.done).length }' },
      methods:{ add:'() { const title=ctx.draft.trim();if(!title)return;ctx.items.push({id:ctx.next++,title,done:false});ctx.draft="" }', remove:'(id){ctx.items=ctx.items.filter(item=>item.id!==id)}' },
      template:`<form @submit.prevent="add"><label>새 할 일 <input v-model="$draft$" required></label><button>등록</button></form>
<label>보기 <select v-model="$filter$"><option>전체</option><option>미완료</option><option>완료</option></select></label>
<p role="status">남은 할 일: {{ remaining }}</p><ul v-if="visible.length">
  <li v-for="item in visible" :key="item.id"><label><input type="checkbox" v-model="item.done"> {{ item.title }}</label>
    <button :aria-label="item.title + ' 삭제'" @click="remove(item.id)">삭제</button></li>
</ul><p v-else>표시할 할 일이 없습니다.</p>` }],
  ['board','게시판 시스템','게시글 CRUD · 검색','글 목록과 읽기, 작성, 편집 화면을 소규모 게시판으로 조립합니다.',
    '제목과 글을 등록한 뒤 상세 화면에서 수정하고 검색으로 다시 찾으세요.',
    '현재 보고 있는 게시글 ID를 별도로 저장하고 사본을 작성·수정 양식에 사용합니다.',
    '현재 상세 글을 삭제하면 활성 ID도 초기화해야 합니다.', '카테고리별 검색, 작성자와 작성 시각을 추가하세요.',
    { data:{ posts:[{id:1,title:'첫 공지',body:'게시판을 연습합니다.'}],view:'list',current:0,subject:'',draft:'',query:'',next:2 },
      computed:{ selected:'() { return ctx.posts.find(post=>post.id===ctx.current) }', results:'() { return ctx.posts.filter(post=>post.title.includes(ctx.query.trim())) }' },
      methods:{
        open:'(post) { ctx.current=post.id;ctx.view="detail" }',
        compose:'(post) { ctx.current=post?.id ?? 0;ctx.subject=post?.title ?? "";ctx.draft=post?.body ?? "";ctx.view="form" }',
        save:'() { const title=ctx.subject.trim(), body=ctx.draft.trim();if(!title||!body)return;if(!ctx.current){ctx.current=ctx.next++;ctx.posts.push({id:ctx.current,title,body})}else{ctx.posts=ctx.posts.map(post=>post.id===ctx.current?{...post,title,body}:post)}ctx.view="detail" }',
        remove:'() { ctx.posts=ctx.posts.filter(post=>post.id!==ctx.current);ctx.current=0;ctx.view="list" }',
      },
      template:`<section v-if="$view$ === 'list'"><h2>게시판</h2><label>제목 검색 <input type="search" v-model="$query$"></label>
  <button @click="compose()">글 작성</button><ul><li v-for="post in results" :key="post.id"><button @click="open(post)">{{ post.title }}</button></li></ul>
  <p v-if="!results.length">일치하는 글이 없습니다.</p></section>
<article v-else-if="$view$ === 'detail' && selected"><h2>{{ selected.title }}</h2><p>{{ selected.body }}</p>
  <button @click="$view$ = 'list'">목록</button> <button @click="compose(selected)">수정</button> <button @click="remove">삭제</button></article>
<form v-else @submit.prevent="save"><label>제목 <input v-model="$subject$" required></label><label>내용 <textarea v-model="$draft$" required></textarea></label>
  <button>저장</button> <button type="button" @click="$view$ = 'list'">취소</button></form>` }],
  ['shopping','쇼핑몰 장바구니','재고 · 수량 · 배송비','상품 선택, 수량 변경과 주문 요약을 한 화면에서 처리합니다.',
    '재고까지만 상품을 담고 소계를 확인하세요. 배송비 무료 기준과 수량 삭제를 검증하세요.',
    '상품 ID별 수량을 저장하고 상품의 단가와 재고를 합쳐 소계와 배송비를 계산합니다.',
    '장바구니가 비어 있을 때 배송비를 요금에 추가하면 잘못된 합계를 표시합니다.', '쿠폰과 품절 시 장바구니 재검사를 추가하세요.',
    { data:{ products:[{id:1,name:'머그컵',price:9000,stock:4},{id:2,name:'메모지',price:4500,stock:6},{id:3,name:'파우치',price:16000,stock:2}], cart:{},order:null },
      computed:{ lines:'() { return ctx.products.filter(item=>ctx.cart[item.id]>0) }', total:'() { return ctx.lines.reduce((sum,item)=>sum+item.price*ctx.cart[item.id],0) }', delivery:'() { return ctx.total && ctx.total < 30000 ? 3000 : 0 }' },
      methods:{ change:'(item, delta) { ctx.cart[item.id]=Math.min(item.stock,Math.max(0,(ctx.cart[item.id] ?? 0)+delta));ctx.order=null }', checkout:'() { if(ctx.total){ctx.order={lineCount:ctx.lines.length,total:ctx.total+ctx.delivery};ctx.cart={}} }' },
      template:`<h2>상품 목록</h2><ul><li v-for="item in $products$" :key="item.id">{{ item.name }} · {{ item.price.toLocaleString() }}원
  <button :disabled="($cart$[item.id] ?? 0) >= item.stock" @click="change(item, 1)">담기</button></li></ul>
<article><h3>장바구니</h3><p v-if="!lines.length">담은 상품이 없습니다.</p>
  <ul><li v-for="item in lines" :key="item.id">{{ item.name }} {{ $cart$[item.id] }}개
    <button :aria-label="item.name + ' 수량 빼기'" @click="change(item, -1)">−</button></li></ul>
  <p>소계 {{ total.toLocaleString() }}원 · 배송비 {{ delivery.toLocaleString() }}원</p>
  <button class="primary" :disabled="!lines.length" @click="checkout">모의 주문</button></article>
<p v-if="$order$" role="status">{{ $order$.lineCount }}개 품목 · {{ $order$.total.toLocaleString() }}원 모의 주문 완료</p>` }],
  ['product-management','상품 관리 시스템','재고 관리 · SKU','상품을 등록하고 재고를 조정하며 SKU 충돌을 검사합니다.',
    '같은 SKU를 다시 등록하면 오류가 표시되고 재고 버튼으로 상품별 재고가 갱신됩니다.',
    'SKU를 trim과 대문자 변환으로 정규화하고, 중복을 검사한 뒤 등록합니다.',
    '수량을 문자열로 더하면 실제 값이 커지지 않고 두 문자가 이어질 수 있습니다.', '상품 상태와 변경 이력을 모델에 추가하세요.',
    { data:{ rows:[{sku:'M001',name:'머그컵',qty:4}],sku:'',name:'',error:'' },
      methods:{ add:'() { const sku=ctx.sku.trim().toUpperCase(),name=ctx.name.trim();if(!sku||!name){ctx.error="SKU와 이름을 입력하세요.";return}if(ctx.rows.some(row=>row.sku===sku)){ctx.error="같은 SKU가 이미 있습니다.";return}ctx.rows.push({sku,name,qty:0});ctx.sku="";ctx.name="";ctx.error="" }' },
      template:`<form @submit.prevent="add"><label>SKU <input v-model="$sku$"></label><label>상품명 <input v-model="$name$"></label><button>상품 등록</button></form>
<p v-if="$error$" role="alert">{{ $error$ }}</p><table><caption>재고 관리</caption><thead><tr><th scope="col">SKU</th><th scope="col">상품</th><th scope="col">재고</th></tr></thead>
<tbody><tr v-for="row in $rows$" :key="row.sku"><td>{{ row.sku }}</td><td>{{ row.name }}</td><td>{{ row.qty }}개
<button :aria-label="row.name + ' 재고 줄이기'" :disabled="row.qty === 0" @click="row.qty--">−</button>
<button :aria-label="row.name + ' 재고 늘리기'" @click="row.qty++">+</button></td></tr></tbody></table>` }],
  ['membership','회원 관리 시스템','권한 · 활성화 · 검색','회원 검색과 권한 변경, 계정 활성화를 모의 관리합니다.',
    '이메일로 검색하고 권한을 변경하세요. 마지막 활성 관리자는 비활성화할 수 없어야 합니다.',
    '권한 변경과 계정 비활성화 전에 남은 활성 관리자 수를 검사합니다.',
    'UI 조건만으로 권한을 보호할 수 없으므로 실서비스에서는 서버에서 같은 검사를 거쳐야 합니다.', '변경 내역을 기록하고 활성 사용자 수를 대시보드에 표시하세요.',
    { data:{ members:[{id:1,email:'admin@example.com',role:'관리자',active:true},{id:2,email:'writer@example.com',role:'편집자',active:true},{id:3,email:'viewer@example.com',role:'조회자',active:false}], query:'',message:'' },
      computed:{ visible:'() { return ctx.members.filter(row=>row.email.includes(ctx.query.trim().toLowerCase())) }',
        admins:'() {return ctx.members.filter(row=>row.active&&row.role==="관리자").length}' },
      methods:{ role:'(row,event) { const value=event.target.value;if(row.role==="관리자"&&row.active&&ctx.admins===1&&value!=="관리자"){ctx.message="활성 관리자 한 명은 유지해야 합니다.";event.target.value=row.role;return}row.role=value;ctx.message="권한을 변경했습니다." }',
        toggle:'(row) { if(row.active&&row.role==="관리자"&&ctx.admins===1){ctx.message="마지막 관리자 계정을 끌 수 없습니다.";return}row.active=!row.active;ctx.message="계정 상태를 변경했습니다." }' },
      template:`<label>이메일 검색 <input type="search" v-model="$query$"></label><p role="status">{{ $message$ }}</p>
<article v-for="row in visible" :key="row.id"><h3>{{ row.email }}</h3><label>권한
  <select :value="row.role" @change="role(row, $event)"><option>관리자</option><option>편집자</option><option>조회자</option></select></label>
  <button :aria-pressed="row.active" @click="toggle(row)">{{ row.active ? '활성 상태' : '보류 상태' }}</button></article>
<p v-if="!visible.length">검색 결과가 없습니다.</p>` }],
  ['work-requests','업무 요청 관리 시스템','상태 흐름 · 담당자','업무를 접수하고 담당자를 지정한 뒤 처리 상태를 변경합니다.',
    '담당자 없이 처리 시작을 시도한 뒤 담당자를 지정해 처리 중과 완료 상태로 이동하세요.',
    '가능한 전이 순서를 선언하고 시작 전에 담당자 지정 조건을 검사합니다.',
    '완료된 요청이 아무 조건 없이 초기 단계로 돌아가지 않도록 전이 계약을 정하세요.', '우선순위와 기한 초과 목록을 추가하세요.',
    { data:{ title:'',rows:[{id:1,title:'접근성 검토',owner:'',state:'접수'}],next:2,message:'' },
      methods:{ add:'() { const title=ctx.title.trim();if(!title)return;ctx.rows.push({id:ctx.next++,title,owner:"",state:"접수"});ctx.title="" }', advance:'(row) { if(row.state==="접수"&&!row.owner){ctx.message="담당자를 먼저 선택하세요.";return}if(row.state==="접수")row.state="처리 중";else if(row.state==="처리 중")row.state="완료";ctx.message=row.title+" 상태: "+row.state }' },
      template:`<form @submit.prevent="add"><label>업무 제목 <input v-model="$title$" required></label><button>접수</button></form>
<p role="status">{{ $message$ }}</p><article v-for="row in $rows$" :key="row.id"><h3>{{ row.title }}</h3><p>{{ row.state }}</p>
  <label>담당자 <select v-model="row.owner" :disabled="row.state === '완료'"><option value="">미지정</option><option>지우</option><option>민호</option></select></label>
  <button :disabled="row.state === '완료'" @click="advance(row)">{{ row.state === '접수' ? '처리 시작' : row.state === '처리 중' ? '완료 처리' : '완료됨' }}</button></article>` }],
  ['cms','CMS 콘텐츠 관리','미리보기 · 게시 버전','초안을 입력하고 미리보기, 게시 및 공개 철회로 이어지는 콘텐츠 흐름을 구현합니다.',
    '초안을 게시하고 변경해도 기존 공개 버전이 유지되는지 확인하세요. 공개를 철회해 보세요.',
    '공개 시점의 제목·본문을 새 객체로 복사하고 편집 중 초안과 분리합니다.',
    '본문을 사용자 입력으로 받아 v-html로 출력하지 않도록 주의하세요.', '여러 버전을 비교하고 이전 버전으로 복구하세요.',
    { data:{ draft:{title:'11월 학습 소식',body:'새로운 실습이 추가되었습니다.'}, mode:'초안', version:0,published:null },
      methods:{ publish:'() { if(!ctx.draft.title.trim()||!ctx.draft.body.trim())return;ctx.published={...ctx.draft,revision:++ctx.version};ctx.mode="공개" }' },
      template:`<nav aria-label="CMS 보기"><button v-for="item in ['초안','미리보기','공개']" :key="item" :aria-pressed="$mode$ === item" @click="$mode$ = item">{{ item }}</button></nav>
<section v-if="$mode$ === '초안'"><label>제목 <input v-model="$draft$.title"></label><label>본문 <textarea rows="4" v-model="$draft$.body"></textarea></label>
  <button :disabled="!$draft$.title.trim() || !$draft$.body.trim()" @click="publish">공개 버전 만들기</button></section>
<article v-else-if="$mode$ === '미리보기'"><h2>{{ $draft$.title || '제목 없음' }}</h2><p>{{ $draft$.body }}</p></article>
<article v-else-if="$published$"><small>공개 버전 {{ $published$.revision }}</small><h2>{{ $published$.title }}</h2><p>{{ $published$.body }}</p>
  <button @click="$published$ = null">공개 철회</button></article><p v-else>공개한 콘텐츠가 없습니다.</p>` }],
  ['operations-dashboard','관리자 대시보드 프로젝트','KPI · 기간 · 차트','기간 변경이 KPI와 차트를 동시에 갱신하는 운영 대시보드를 구현합니다.',
    '기간과 지표를 바꾸어 총계와 타임라인이 올바르게 갱신되는지 검증하세요.',
    '단일 기간 상태에서 원자료를 선택한 뒤 지표, 합계, 막대 차트의 크기를 각각 계산합니다.',
    '서로 다른 단위의 지표를 같은 축으로 비교하지 마세요.', '이전 기간 대비 변화량과 빈 기간 선택을 구현하세요.',
    { data:{ period:'이번 주',metric:'요청',stats:{ '이번 주':[{day:'월',요청:12,완료:10},{day:'화',요청:18,완료:15},{day:'수',요청:14,완료:14}], '지난 주':[{day:'월',요청:6,완료:6},{day:'화',요청:11,완료:9},{day:'수',요청:16,완료:11}] } },
      computed:{ rows:'() {return ctx.stats[ctx.period]}', requested:'() {return ctx.rows.reduce((total,row)=>total+row.요청,0)}', done:'() {return ctx.rows.reduce((total,row)=>total+row.완료,0)}', cap:'() {return Math.max(1, ...ctx.rows.map(row=>row[ctx.metric]))}' },
      template:`<label>기간 <select v-model="$period$"><option>이번 주</option><option>지난 주</option></select></label>
<div class="kpis"><article>요청 {{ requested }}건</article><article>완료 {{ done }}건</article><article>완료율 {{ Math.round(done / (requested || 1) * 100) }}%</article></div>
<label>차트 지표 <select v-model="$metric$"><option>요청</option><option>완료</option></select></label>
<ul class="bars"><li v-for="row in rows" :key="row.day">{{ row.day }}요일 · {{ row[$metric$] }}건
  <div aria-hidden="true" :style="{ width: row[$metric$] / cap * 100 + '%' }"></div></li></ul>`, css:'.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(100px,1fr));gap:7px}.bars{list-style:none;padding:0}.bars li{margin:9px 0}.bars div{height:14px;border-radius:5px;background:#42b883}' }],
  ['approval','전자결재 시스템','승인 · 반려 · 이력','지출 품의서를 제출하고 모의 승인자 역할로 처리합니다.',
    '작성자가 상신한 뒤 승인자 모드에서 반려 사유를 입력하거나 승인하세요. 이력이 보존됩니다.',
    '초안, 결재 대기, 승인, 반려 상태를 나누고 허용된 역할과 전이에서만 기록을 갱신합니다.',
    '실제 접근 권한은 클라이언트 상태에 있는 역할 선택으로 부여하면 안 됩니다.', '2단계 결재와 반려 후 재상신을 지원하세요.',
    { data:{ role:'작성자', title:'회의실 기자재 구매', status:'초안', reason:'', log:[] },
      methods:{ submit:'() { if(ctx.role!=="작성자"||ctx.status!=="초안"||!ctx.title.trim())return;ctx.status="결재 대기";ctx.log.push("작성자 상신") }', decide:'(decision) { if(ctx.role!=="승인자"||ctx.status!=="결재 대기"||(decision==="반려"&&!ctx.reason.trim()))return;ctx.status=decision;ctx.log.push(decision+(decision==="반려"?": "+ctx.reason.trim():"")) }' },
      template:`<label>연습 역할 <select v-model="$role$"><option>작성자</option><option>승인자</option></select></label>
<label>품의 제목 <input v-model="$title$" :readonly="$status$ !== '초안' || $role$ !== '작성자'"></label><p role="status">결재 상태: {{ $status$ }}</p>
<button v-if="$role$ === '작성자'" :disabled="$status$ !== '초안' || !$title$.trim()" @click="submit">상신</button>
<div v-if="$role$ === '승인자' && $status$ === '결재 대기'"><label>반려 사유 <input v-model="$reason$"></label>
<button @click="decide('승인')">승인</button> <button :disabled="!$reason$.trim()" @click="decide('반려')">반려</button></div>
<h3>처리 이력</h3><ol><li v-for="(entry,i) in $log$" :key="i">{{ entry }}</li></ol>` }],
  ['reservations','예약 관리 시스템','충돌 검사 · 예약 취소','예약 날짜와 시간, 장소를 등록하고 중복을 확인합니다.',
    '같은 날짜·시간·공간으로 두 번 예약하면 충돌이 표시됩니다. 취소하면 다시 예약할 수 있습니다.',
    '날짜와 슬롯, 공간이 모두 일치하는 기존 예약을 some으로 찾습니다.',
    '실서비스의 동시 예약 충돌은 서버 트랜잭션으로 제한해야 합니다.', '연속 슬롯을 예약하거나 날짜별 예약 현황을 표시하세요.',
    { data:{ day:'2026-11-25',time:'09:00',room:'회의실 A',who:'',entries:[],next:1,message:'' },
      methods:{ book:'() { if(!ctx.day||!ctx.who.trim()){ctx.message="날짜와 예약자를 입력하세요.";return}if(ctx.entries.some(row=>row.day===ctx.day&&row.time===ctx.time&&row.room===ctx.room)){ctx.message="같은 공간과 시간에 예약이 있습니다.";return}ctx.entries.push({id:ctx.next++,day:ctx.day,time:ctx.time,room:ctx.room,who:ctx.who.trim()});ctx.message="예약했습니다.";ctx.who="" }',
        cancel:'(id) { ctx.entries=ctx.entries.filter(row=>row.id!==id);ctx.message="예약을 취소했습니다." }' },
      template:`<form @submit.prevent="book"><label>날짜 <input type="date" v-model="$day$"></label>
  <label>시간 <select v-model="$time$"><option>09:00</option><option>10:00</option><option>11:00</option></select></label>
  <label>공간 <select v-model="$room$"><option>회의실 A</option><option>회의실 B</option></select></label>
  <label>예약자 <input v-model="$who$"></label><button>예약</button></form><p role="status">{{ $message$ }}</p>
<ul><li v-for="row in $entries$" :key="row.id">{{ row.day }} {{ row.time }} · {{ row.room }} · {{ row.who }}
  <button :aria-label="row.room + ' ' + row.time + ' 예약 취소'" @click="cancel(row.id)">취소</button></li></ul>` }],
]

export default guided('projects', rows.map(([slug,title,keyword,task,finish,guide,error,challenge,demo]) => [
  slug,title,[keyword,'미니 프로젝트'],task,finish,guide,error,
  '각 상태에서 가능한 동작을 먼저 정하고, 빈 상태와 실패 후 돌아오는 흐름을 함께 실습하세요.',
  challenge,{...demo, start:starterMarkup(demo.template), level:'고급',time:45},
]))
