# 검수 r1 — Codex (2026-11-18)

- 도구: growtoday-codex-review MCP `review_with_codex` (kind=code)
- request_id: 2e6edb712c444707853041bd7c9e2f85
- input_sha256: c84bea3c090dfb1a706c712c273d428aad44da15084ac60090dd6750a3ff7643 (9,043자 검토, 잘림 없음)
- 판정: **CHANGES_REQUESTED** (위반 4건)
- 한계: 제출 텍스트만 검토 (라이브 UI·외부 소스 미검증). 통과≠배포 승인.
- 참고: 첫 호출(request dba6db23…)은 셸 치환 실수로 132자만 전달되어 **무효 처리**함.

## 지적 사항
1. auto_confirm_admin(): 이메일 소유 확인 없이 화이트리스트 이메일 가입을 자동 승인 → 선점 가입 시 관리자 탈취 가능
2. request.json() 모양 미검증 (null/배열), utm·props 배열 통과, payment_link 스킴 미검증
3. 레이트리미터 중복 + anon 직접 INSERT가 API 측 RSVP 마감 검사를 우회
4. 입력을 자른 뒤 성공 처리 (이메일 254자 절단 후 검증 등)
