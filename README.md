# VueEx

Vue 3, HTML5와 CSS·SCSS를 한국어로 연습하는 실무 코딩 플레이그라운드입니다. 문제를 열어 완성 화면을 조작하고, 시작 코드로 실습한 뒤 Options API와 Composition API 정답을 비교할 수 있습니다.

- [GitHub 저장소](https://github.com/parkjise/VueEx)
- [GitHub Pages](https://parkjise.github.io/VueEx/)

## 시작하기

Node.js 22.12 이상이 필요합니다.

```sh
npm install
npm run dev
npm test
npm run build
npm run preview
```

Vite가 출력한 주소에서 `/VueEx/` 경로를 엽니다. 검색 창은 macOS에서 **Command + K**, 그 외 환경에서 **Ctrl + K**로 열 수 있습니다. 학습 완료, 최근 학습 문제, 즐겨찾기와 테마는 현재 브라우저에 저장됩니다.

## 실습 콘텐츠

| 카테고리 | 문제 |
| --- | ---: |
| UI 인터랙션 | 50 |
| HTML5 실무 | 20 |
| CSS3 / SCSS 실무 | 40 |
| Vue 3 기본 문법 | 30 |
| 반응형 데이터 및 이벤트 | 30 |
| 배열 및 데이터 처리 | 30 |
| 컴포넌트 설계 | 25 |
| 폼 및 유효성 검사 | 20 |
| API 및 비동기 통신 | 20 |
| 관리자 페이지 UI | 25 |
| 실무 미니 프로젝트 | 10 |
| **합계** | **300** |

각 문제에는 완료 조건, 시작 마크업과 스타일, 두 방식의 Vue SFC 정답, 코드 해설과 응용 과제가 있습니다. 앱의 학습 완료 표시는 사용자가 직접 기록합니다.

## 미리보기와 에디터

- 완성 미리보기는 Composition API 정답으로 렌더링됩니다. 데스크톱, 태블릿, 모바일은 실습 프레임의 너비를 바꾸고, 좁은 화면에서는 프레임을 맞춰 표시합니다.
- Vue SFC 탭은 JS 기반 Vue SFC 하나를 실행합니다. HTML, CSS, JavaScript 탭은 세 코드를 함께 실행합니다. Vue와 Axios를 사용할 수 있습니다.
- SCSS 정답 및 SCSS 시작 코드는 Sass가 설치된 Vue 프로젝트에서 사용할 수 있습니다. 브라우저 에디터에서는 CSS 실행을 지원하고 SCSS 문제의 완성 미리보기에는 변환된 CSS를 사용합니다.
- API 및 미니 프로젝트는 예제용 데이터를 사용합니다. 실습의 입력 및 변경은 브라우저에서 이루어집니다.
- 관리자 다운로드 실습은 Excel에서 열 수 있는 UTF-8 CSV를 만듭니다.

브라우저 실행은 메인 앱과 출처가 분리된 iframe에서 이루어집니다. iframe은 부모의 저장소에 직접 접근할 수 없고, 샌드박스 실행 환경에서 외부 HTTP 요청 대신 내장된 예제 데이터를 사용합니다.

## 문제 추가하기

`src/data/exercises/<category>/index.js`에서 문제 정의와 정답 템플릿을 관리합니다. 카테고리 모듈의 기본 내보내기에 `defineExercise()`로 만든 문제를 더하면 카탈로그, 검색 및 관련 문제 탐색에 반영됩니다. 기존 문제의 ID와 slug는 저장된 학습 기록 및 공유 URL에 사용합니다.

`npm test`는 고유 ID, 경로, 필수 학습 데이터 및 검색 일치를 확인한 다음, 각 문제의 시작 SFC와 두 정답을 컴파일하고 서버 렌더링합니다. 상호작용은 대표 문제에서 브라우저로 검증합니다.

## GitHub Pages

`.github/workflows/deploy.yml`은 `main`에 푸시되거나 수동으로 실행될 때 테스트와 프로덕션 빌드를 실행하고 `dist/`를 배포합니다. 저장소 **Settings → Pages → Build and deployment → Source**는 **GitHub Actions**입니다. Vite의 base는 `/VueEx/`이며 Vue Router는 해시 경로를 사용합니다.

## 추가 개발 범위

SCSS 브라우저 컴파일, 자동 채점 및 기기 간 학습 기록 동기화는 후속 확장 대상입니다. 인증과 실제 주문·예약·문서 저장은 연습 UI와 별도의 서비스 연동이 필요합니다.
