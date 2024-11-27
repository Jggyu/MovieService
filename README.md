# MovieService 🎬

> TMDb API를 활용한 영화 정보 및 컨텐츠 관리 서비스

이 프로젝트는 사용자가 영화 정보를 탐색하고 관리할 수 있는 웹 애플리케이션입니다. TMDb API를 통해 다양한 영화 정보를 제공하며, 사용자별 위시리스트 기능을 포함하고 있습니다.

## 주요 기능 🌟

* **인증 시스템**: 이메일 기반 회원가입 및 로그인
* **영화 탐색**: 인기/최신/장르별 영화 목록 제공
* **위시리스트**: 개인화된 영화 컬렉션 관리
* **검색 기능**: 영화 제목 기반 검색
* **반응형 디자인**: 모든 디바이스에 최적화된 UI/UX

## 기술 스택 🛠

### Frontend
* React 18
* TailwindCSS
* Framer Motion

### 상태 관리 & 라우팅
* React Router v6
* LocalStorage

### API & 통신
* Axios
* TMDb API

### 개발 도구
* npm
* Git
* GitHub Actions

## 설치 및 실행 가이드 🚀

1. 저장소 클론
```bash
git clone https://github.com/jggyu/MovieService.git
cd MovieService
```

2. 의존성 설치
```bash
npm install
```

3. 환경 설정
* TMDb API 키 발급 (TMDb 웹사이트)
* 회원가입 시 API 키 입력 필요

4. 개발 서버 실행
```bash
npm start
```

5. 프로덕션 빌드
```bash
npm run build
```
## 프로젝트 구조 📁
```bash
MovieService/
├── public/
│   ├── index.html
│   └── 404.html
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── SignIn.js
│   │   ├── home/
│   │   │   ├── Banner.js
│   │   │   ├── MovieRow.js
│   │   │   └── Home.js
│   │   ├── popular/
│   │   │   ├── Popular.js
│   │   │   ├── TableView.js
│   │   │   └── InfiniteView.js
│   │   ├── search/
│   │   │   ├── MovieSearch.js
│   │   │   ├── SearchFilters.js
│   │   │   └── SearchResults.js
│   │   └── layout/
│   │       └── Header.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── urlService.js
│   │   └── wishlistService.js
│   ├── guards/
│   │   └── AuthGuard.js
│   ├── App.js
│   └── index.js
├── package.json
└── tailwind.config.js
```

## 주요 컴포넌트 설명 📌
### Auth
* `SignIn.js`: 로그인/회원가입 기능 제공
* `AuthGuard.js`: 인증 상태 관리 및 보호된 라우트 처리

### Auth
* `Banner.js`: 메인 페이지 상단 배너 및 추천 영화 표시
* `MovieRow.js`: 카테고리별 영화 목록 슬라이더 구현

### Popular
* `TableView.js`: 테이블 형식의 영화 목록 뷰
* `InfiniteView.js`: 무한 스크롤 형식의 영화 목록 뷰

## 인증 시스템 🔐
* 이메일 형식 검증
* TMDb API 키 유효성 검사
* Remember Me 기능
* 자동 로그인 지원
* 세션/로컬 스토리지 기반 상태 관리

## UI/UX 특징 🎨
* 반응형 디자인 구현
* Framer Motion을 활용한 부드러운 애니메이션
* 다크 테마 기반의 모던한 디자인
* 직관적인 사용자 인터페이스

## 배포 프로세스 🔄
* GitHub Actions를 통한 자동 배포 구현:
* develop 브랜치 푸시 시 자동 배포
* GitHub Pages를 통한 호스팅
* SPA 라우팅 지원을 위한 404 페이지 구성

## 추가 참고사항 📝
* TMDb API 키는 회원가입 시 필수로 입력해야 합니다
* 모든 API 요청은 한국어(ko-KR) 기반으로 설정되어 있습니다
* 위시리스트 데이터는 로컬 스토리지에 저장됩니다

## 기여 방법 👥
1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 라이선스 📜
이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 LICENSE 파일을 참조하세요.