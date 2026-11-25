import { CodeXml, Palette, MousePointer2, Box, Zap, ListFilter, Blocks, ClipboardCheck, Cloud, LayoutPanelTop, FolderKanban } from 'lucide-vue-next'

export const categories = [
  { id: 'ui', name: 'UI 인터랙션', goal: 50, icon: MousePointer2, color: 'mint', description: '탭, 모달, 슬라이더처럼 자주 쓰이는 인터페이스를 구현합니다.' },
  { id: 'html', name: 'HTML5 실무', goal: 20, icon: CodeXml, color: 'peach', description: '의미 있는 마크업과 접근성의 기본기를 쌓습니다.' },
  { id: 'css', name: 'CSS3 / SCSS 실무', goal: 40, icon: Palette, color: 'blue', description: '반응형 레이아웃과 재사용 가능한 스타일을 작성합니다.' },
  { id: 'vue', name: 'Vue 3 기본 문법', goal: 30, icon: Box, color: 'violet', description: '템플릿과 디렉티브로 데이터를 화면에 연결합니다.' },
  { id: 'reactivity', name: '반응형 데이터 및 이벤트', goal: 30, icon: Zap, color: 'mint', description: '반응형 상태와 사용자 이벤트를 다룹니다.' },
  { id: 'javascript', name: '배열 및 데이터 처리', goal: 30, icon: ListFilter, color: 'peach', description: '검색, 정렬, 그룹화로 데이터를 가공합니다.' },
  { id: 'components', name: '컴포넌트 설계', goal: 25, icon: Blocks, color: 'blue', description: '재사용 가능한 컴포넌트와 상태 계약을 설계합니다.' },
  { id: 'forms', name: '폼 및 유효성 검사', goal: 20, icon: ClipboardCheck, color: 'violet', description: '실시간 검증과 제출 흐름을 만들고 개선합니다.' },
  { id: 'api', name: 'API 및 비동기 통신', goal: 20, icon: Cloud, color: 'mint', description: '요청, 응답, 로딩 및 오류 상태를 처리합니다.' },
  { id: 'admin', name: '관리자 페이지 UI', goal: 25, icon: LayoutPanelTop, color: 'peach', description: '데이터 중심의 관리 기능을 구현합니다.' },
  { id: 'projects', name: '실무 미니 프로젝트', goal: 10, icon: FolderKanban, color: 'blue', description: '여러 학습 주제를 실제 서비스 흐름으로 연결합니다.' },
]
export const categoryById = Object.fromEntries(categories.map(category => [category.id, category]))
export const difficulties = ['초급', '중급', '고급']
