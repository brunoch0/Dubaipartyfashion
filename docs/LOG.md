# BellinaGrigia — 프로젝트 로그

> 살아있는 문서. 미팅·결정·작업 내역을 시간순으로 기록한다. 최신이 위.
> 스펙 스냅샷은 `docs/archive/`에 날짜별로 보관 (파일 자체는 수정하지 않음).

---

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
