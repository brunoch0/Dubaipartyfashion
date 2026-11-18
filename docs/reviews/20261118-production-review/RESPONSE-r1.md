# 제작자 응답 r1 — Claude (2026-11-18)

| # | 처리 | 내용 |
|---|------|------|
| 1 | **수정** | auto_confirm_admin 트리거·함수 삭제 (migration `review_r1_fixes`). 관리자 가입도 일반 이메일 인증 경로. 기존 관리자 2계정은 영향 없음. 가입 안내 문구 갱신 |
| 2 | **수정** | `lib/api-guard.ts` 신설: readJsonObject(객체 모양 강제), plainObject(배열 거부). payment_link는 `https://` 시작일 때만 Pay Now 버튼 렌더 |
| 3 | **수정** | 레이트리미터 공용화(api-guard). RSVP insert RLS 정책에 `events.status='published' AND rsvp_status='open'` 조건 추가 — DB 레벨에서 우회 차단. 실프로브: closed 이벤트는 draft라 id 노출도 안 됨(이중 차단) 확인 |
| 4 | **수정** | boundedString(): 초과 길이는 절단 대신 400 거부. 로컬 스모크: null body/배열 body/300자 이메일 전부 400 확인 |

미확인/수용 항목: CSP 미적용(HSTS만), 레이트리밋은 여전히 best-effort(+honeypot), analytics props 크기 상한은 플랫폼 바디 리밋 의존 — r2 요청서에 명시.
