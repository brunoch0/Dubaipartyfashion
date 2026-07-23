# BellinaGrigia — 프로젝트 로그

## 2026-07-23 — 어드민 보강: 셀프 가입 + 변경 기록(audit log)

- 로그인 페이지에 회원가입 탭 — admin_emails 화이트리스트 이메일은 DB 트리거로 자동 승인(인증 메일 불필요), 그 외는 가입해도 권한 없음
- /admin/account 비밀번호 변경 페이지
- **감사 로그**: 모든 콘텐츠 테이블 insert/update/delete를 트리거로 자동 기록(누가/언제/변경 전후) → /admin/audit 뷰어(변경 필드 요약 + before/after 펼침). 제출 데이터는 관리자의 수정/삭제만 기록
- 파트너 온보딩 안내문 작성 완료. 파트너 이메일(tinamin0530@gmail.com) admin_emails 등록 완료 — 가입 대기

## 2026-07-23 — 어드민 구축 (/admin)

- 인증: Supabase Auth 이메일 로그인 + `admin_emails` 화이트리스트 (가입해도 화이트리스트 밖이면 권한 없음). RLS `is_admin()` 함수로 콘텐츠 전 테이블 CRUD 허용
- 관리 화면: 대시보드(대기명단/RSVP 수, 최근 7일 방문 이벤트) · 사이트 문구(히어로/소개/About) · 아티클 · 이벤트 · 룩북(+이미지 정렬/캡션) · SNS 링크/피드 · 사전예약 · 대기명단/RSVP 조회+CSV
- 다국어 입력: ko/en/ar 탭 폼, 이미지 업로드는 Supabase Storage `media` 버킷(공개 읽기, 어드민만 쓰기)
- 구조: 설정 기반 제네릭 CRUD (`lib/admin/resources.ts`에 필드 추가만 하면 새 리소스 관리 가능)
- ⚠️ 관리자 계정은 Bruno가 Supabase 대시보드에서 직접 생성 필요 (Authentication → Add user, 이메일 chohj0228@gmail.com — 화이트리스트 등록됨). 파트너 계정 추가 시 admin_emails에 이메일 insert + 유저 생성

> 살아있는 문서. 미팅·결정·작업 내역을 시간순으로 기록한다. 최신이 위.
> 스펙 스냅샷은 `docs/archive/`에 날짜별로 보관 (파일 자체는 수정하지 않음).

---

## 2026-07-23 — 브랜드 시스템 사이트 적용

- 표기 통일: 코드·메타데이터·DB 콘텐츠 전체 "Bellinagrigia" (B만 대문자)
- 기본 OG 공유 이미지 추가 (`/brand/og.png` — 로크업 + 웜 페이퍼 배경) + og:site_name/트위터 카드
- 로고(푸터·파비콘), 스크립트 폰트, 필름톤은 기적용 상태 유지

## 2026-07-23 — 브랜드 시스템 완성 (Claude Design)

- Claude Design "BellinaGrigia Design System" 프로젝트를 완전한 브랜드 킷으로 확장 (14개 파일):
  - Foundations 6: Brand(정의·씬 브랜드 포지셔닝·보이스&톤), Colors, Typography, Logo(재제작본 + 사용 규칙), Imagery(필름톤 공식), Spacing/Layout(+RTL)
  - Components 5: Buttons, Forms, Cards, Hero, Navigation
  - Templates 1: Instagram 피드(1:1)/스토리(9:16) 프레임 — 공동 포스팅용
  - tokens.css 요약 (단일 소스는 web/app/globals.css)
- 소스는 리포 design-system/ — 수정 시 DesignSync로 재푸시

## 2026-07-23 — 로고 재제작 / 영어 기본 정책

- 파트너 제공 로고 목업(JPEG, 종이질감)을 기반으로 클린 버전 재제작 (Higgsfield nano_banana_pro + 배경 제거 + 화이트 키잉):
  - `logo-full.png` 투명 로크업(B + Bellinagrigia + Est. 2016), `logo-mark.png` B 모노그램
  - 적용: 푸터 로고 이미지, 파비콘(`web/app/icon.png`) — 벡터(SVG) 원본은 여전히 파트너 요청 항목
- 언어 정책: **영어 기본** — 첫 방문은 브라우저 언어 무관 `/en`, 토글 선택(쿠키)만 예외. 한국어 숨김은 `VISIBLE_LOCALES`에서 'ko' 제거 한 줄이면 됨 (파트너 요청 시)

## 2026-07-21 — 2회차 미팅 반영 / 브랜드 시스템 착수

**미팅 내용** ([Notion 2회차](https://app.notion.com/p/3a43ca2e0c29809e9176ee081cc3fce2)):
- 현황: 샘플 업체 선정 진행 중 (최소 수량 50개)
- 개발(브루노): 브랜드 시스템 구축, 관리자 기능, 도메인 구매
- 운영: Journal 게시글 SEO 관점으로 채우기
- 콘텐츠: 메이킹 필름 축적, 인스타 개인+브랜드 공동 포스팅
- 비즈니스: 플랫폼 입점으로 노하우 습득

**결정/작업:**
- 예전 스펙 문서 → `docs/archive/` 날짜별 스냅샷으로 전환, 본 로그를 단일 기록으로 운영
- 브랜드 시스템을 Claude Design 프로젝트로 구축 (사이트 디자인 토큰 기반, 소스는 `design-system/`)
- B2C 회원가입은 쇼핑몰 단계로 보류 확정. 어드민(관리자)이 개발 1순위

## 2026-07-08 — 1차 스펙 → 빌드 → 배포

- 1차 미팅 산출물(기능명세서/유저플로우/와이어프레임) 기반 사이트 구축
  - 스택: Next.js 16 (App Router) + Tailwind v4 + Supabase(`yrlcysaguyjrmgpqzckd`) + Vercel
  - 페이지: 랜딩 / About / Journal / Lookbook / Events(+RSVP) / Shop(Coming Soon)
  - ko·en·ar 3개 언어 + 아랍어 RTL, 콘텐츠 전부 Supabase 데이터 기반(하드코딩 0)
  - 디자인 토큰: `web/app/globals.css` `:root` 변수 — 브랜드 확정 시 값만 교체
  - 폼: 대기명단·RSVP (허니팟/중복 처리/rate limit), 자체 분석 이벤트(`analytics_events`)
- 히어로: Higgsfield 생성 흑백 필름톤 슬로우모션 파티 영상 (`web/public/hero/`, 재생 불가 환경 포스터 폴백)
- 배포: https://dubaipartyfashion.vercel.app (Vercel rootDirectory=`web`, GitHub 연동 — main 푸시 시 자동 배포)
- 시드 콘텐츠는 전부 placeholder (실 콘텐츠 교체 필요)

## 백로그 (다음 작업 후보)

- [ ] 관리자(어드민): Supabase Auth 로그인 + 콘텐츠 CRUD + 대기명단/RSVP 조회·CSV
- [ ] 브랜드 톤 확정: 벤치마킹 자료 수령 → 디자인 토큰 값 교체
- [ ] 도메인: 후보 검토 → 구매(파트너/브루노) → Vercel 연결
- [ ] Journal 실제 아티클 (SEO 키워드 기반, 3개 언어)
- [ ] 샘플 50개 확정 시: 사전예약 섹션 → 목표 수량 게이지로 업그레이드
- [ ] 인수인계 준비: 어드민 사용 가이드 + Claude로 사이트 관리하는 법 문서
