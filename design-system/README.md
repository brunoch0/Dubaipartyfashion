# BellinaGrigia Design System

Claude Design(claude.ai/design) 프로젝트와 동기화되는 브랜드 시스템 소스.

- `foundations/` — 컬러 토큰, 타이포, 로고 사용 규칙, 이미지 톤 가이드
- `components/` — 버튼, 폼, 콘텐츠 카드, 히어로, 내비게이션
- `assets/` — 로고: `logo-original.jpeg`(파트너 제공 목업) · `logo-full.png`(재제작 투명 로크업) · `logo-mark.png`(B 모노그램, 파비콘용). 웹 배포용 사본은 `web/public/brand/` + `web/app/icon.png`

## 원칙
- 여기의 값은 `web/app/globals.css`의 디자인 토큰과 1:1 대응 — 사이트가 단일 소스, 이 문서는 시각화.
- 토큰 변경 시: globals.css 수정 → 이 카드들 갱신 → DesignSync로 재푸시.
- 각 카드는 자체 완결 HTML (첫 줄 `<!-- @dsCard group="…" -->` 마커 필수).

## 브랜드 표기
- 워드마크: **Bellinagrigia** (B만 대문자) · Est. 2016
- 스크립트 근사 폰트: Pinyon Script / UI 디스플레이: Marcellus / 본문: Noto Sans KR / RTL: Noto Sans Arabic
