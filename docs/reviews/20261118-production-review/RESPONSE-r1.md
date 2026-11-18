# 제작자 응답 r1 — Claude (2026-11-18)

| # | 처리 | 내용 |
|---|------|------|
| 1 | **수정** | auto_confirm_admin 트리거·함수 삭제 (migration `review_r1_fixes`). 관리자 가입도 일반 이메일 인증 경로. 기존 관리자 2계정은 영향 없음. 가입 안내 문구 갱신 |
| 2 | **수정** | `lib/api-guard.ts` 신설: readJsonObject(객체 모양 강제), plainObject(배열 거부). payment_link는 `https://` 시작일 때만 Pay Now 버튼 렌더 |
| 3 | **수정** | 레이트리미터 공용화(api-guard). RSVP insert RLS 정책에 `events.status='published' AND rsvp_status='open'` 조건 추가 — DB 레벨에서 우회 차단. 실프로브: closed 이벤트는 draft라 id 노출도 안 됨(이중 차단) 확인 |
| 4 | **수정** | boundedString(): 초과 길이는 절단 대신 400 거부. 로컬 스모크: null body/배열 body/300자 이메일 전부 400 확인 |

미확인/수용 항목: CSP 미적용(HSTS만), 레이트리밋은 여전히 best-effort(+honeypot), analytics props 크기 상한은 플랫폼 바디 리밋 의존 — r2 요청서에 명시.

---

# r2~r4 진행 기록

**r2** (input c84bea3c→수정본 b902a4fe, request 38b125ac): CHANGES_REQUESTED 3건 — ①clientIp가 x-forwarded-for 첫 값 사용(스푸핑으로 리밋 키 조작 가능) ②이메일 검증 중복 ③tags slice 후 ok 응답
→ 수정: x-real-ip 우선 + XFF 마지막 홉 폴백 / validEmail() 공용화 / 초과 태그 400 거부

**r3** (input 007706b9, request 7cd80bce): CHANGES_REQUESTED — 배열 아닌 preference_tags를 []로 눙침
→ 수정: 부재(null/undefined)만 빈 배열, 그 외 비배열은 400

**r4** (input df28c375, request cf2a4fe3): **PASS** (위반 0)

한계(전 라운드 공통): 제출 텍스트 기준 검토, 라이브 UI/외부 소스 미검증, PASS ≠ 배포 승인.
수용 잔여 리스크: best-effort 레이트리밋+허니팟(캡차 없음) · CSP 미적용(HSTS만) · analytics props 크기는 플랫폼 바디 리밋 의존 · 관리자 가입은 이메일 인증 필요해짐.
