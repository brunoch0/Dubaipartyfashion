/**
 * Config-driven admin resources. One config = one table's list + edit form.
 * Field types:
 *  text | number | bool | datetime | tags | select | image | json
 *  ml    — multilingual short text  {ko,en,ar}
 *  mltext— multilingual textarea
 *  mlmd  — multilingual markdown body
 */
export interface FieldDef {
  name: string;
  label: string;
  type:
    | 'text'
    | 'number'
    | 'bool'
    | 'datetime'
    | 'tags'
    | 'select'
    | 'image'
    | 'json'
    | 'ml'
    | 'mltext'
    | 'mlmd';
  options?: { value: string; label: string }[];
  required?: boolean;
  hint?: string;
}

export interface ResourceDef {
  table: string;
  label: string;
  /** column used as display title in lists — 'ml:title' means multilingual */
  titleField: string;
  orderBy: { column: string; ascending: boolean };
  fields: FieldDef[];
  readonly?: boolean;
  csv?: boolean;
}

const STATUS = [
  { value: 'published', label: '공개' },
  { value: 'draft', label: '초안' },
];

export const RESOURCES: Record<string, ResourceDef> = {
  articles: {
    table: 'articles',
    label: '아티클',
    titleField: 'ml:title',
    orderBy: { column: 'published_at', ascending: false },
    fields: [
      { name: 'slug', label: 'Slug (URL)', type: 'text', required: true, hint: '예: dubai-party-guide-2026 — 영문 소문자·하이픈만' },
      { name: 'status', label: '상태', type: 'select', options: STATUS },
      { name: 'title', label: '제목', type: 'ml', required: true },
      { name: 'summary', label: '요약', type: 'mltext' },
      { name: 'body', label: '본문 (마크다운)', type: 'mlmd' },
      { name: 'cover_image', label: '커버 이미지', type: 'image' },
      { name: 'og_image', label: 'OG 이미지 (공유용, 선택)', type: 'image' },
      { name: 'tags', label: '태그', type: 'tags', hint: '쉼표로 구분' },
      { name: 'author', label: '저자', type: 'text' },
      { name: 'reading_minutes', label: '읽기 시간(분)', type: 'number' },
      { name: 'featured', label: '추천 글', type: 'bool' },
      { name: 'published_at', label: '발행일', type: 'datetime' },
    ],
  },
  events: {
    table: 'events',
    label: '이벤트',
    titleField: 'ml:title',
    orderBy: { column: 'starts_at', ascending: false },
    fields: [
      { name: 'slug', label: 'Slug (URL)', type: 'text', required: true },
      { name: 'status', label: '상태', type: 'select', options: STATUS },
      {
        name: 'rsvp_status',
        label: 'RSVP 상태',
        type: 'select',
        options: [
          { value: 'open', label: '모집중' },
          { value: 'closed', label: '마감' },
          { value: 'full', label: '정원 마감' },
        ],
      },
      { name: 'title', label: '제목', type: 'ml', required: true },
      { name: 'summary', label: '요약', type: 'mltext' },
      { name: 'description', label: '상세 설명 (마크다운)', type: 'mlmd' },
      { name: 'starts_at', label: '시작 일시', type: 'datetime', required: true },
      { name: 'ends_at', label: '종료 일시', type: 'datetime' },
      { name: 'venue', label: '장소', type: 'ml' },
      { name: 'map_url', label: '지도 링크', type: 'text' },
      { name: 'cover_image', label: '커버 이미지', type: 'image' },
      { name: 'tags', label: '태그', type: 'tags' },
      { name: 'capacity', label: '정원', type: 'number' },
      { name: 'price_note', label: '가격 안내', type: 'ml' },
      { name: 'external_links', label: '관련 링크 (JSON)', type: 'json', hint: '[{"label":{"ko":"티켓"},"url":"https://...","type":"ticket"}]' },
      { name: 'sort', label: '정렬', type: 'number' },
    ],
  },
  lookbooks: {
    table: 'lookbooks',
    label: '룩북',
    titleField: 'ml:title',
    orderBy: { column: 'sort', ascending: true },
    fields: [
      { name: 'slug', label: 'Slug (URL)', type: 'text', required: true },
      { name: 'status', label: '상태', type: 'select', options: STATUS },
      { name: 'title', label: '제목', type: 'ml', required: true },
      { name: 'summary', label: '요약', type: 'mltext' },
      { name: 'cover_image', label: '커버 이미지', type: 'image' },
      { name: 'og_image', label: 'OG 이미지 (선택)', type: 'image' },
      { name: 'season', label: '시즌/드롭', type: 'text', hint: '예: SS26' },
      { name: 'tags', label: '태그', type: 'tags' },
      { name: 'sort', label: '정렬', type: 'number' },
    ],
  },
  links: {
    table: 'links',
    label: 'SNS/링크',
    titleField: 'ml:label',
    orderBy: { column: 'sort', ascending: true },
    fields: [
      { name: 'label', label: '표시명', type: 'ml', required: true },
      { name: 'url', label: 'URL', type: 'text', required: true },
      {
        name: 'link_type',
        label: '종류',
        type: 'select',
        options: [
          { value: 'sns', label: 'SNS' },
          { value: 'event', label: '이벤트' },
          { value: 'community', label: '커뮤니티' },
          { value: 'other', label: '기타' },
        ],
      },
      { name: 'platform', label: '플랫폼', type: 'text', hint: 'instagram / snapchat / tiktok …' },
      {
        name: 'section_id',
        label: '노출 위치',
        type: 'select',
        options: [
          { value: 'landing_links', label: '랜딩 링크 섹션' },
          { value: 'footer', label: '푸터' },
        ],
      },
      { name: 'new_tab', label: '새 탭에서 열기', type: 'bool' },
      { name: 'sort', label: '정렬', type: 'number' },
      { name: 'is_visible', label: '노출', type: 'bool' },
    ],
  },
  sns: {
    table: 'sns_posts',
    label: 'SNS 피드',
    titleField: 'platform',
    orderBy: { column: 'sort', ascending: true },
    fields: [
      { name: 'platform', label: '플랫폼', type: 'text', required: true },
      { name: 'post_url', label: '게시물 URL', type: 'text', required: true },
      { name: 'image_url', label: '썸네일 이미지', type: 'image' },
      { name: 'caption', label: '캡션', type: 'ml' },
      { name: 'sort', label: '정렬', type: 'number' },
      { name: 'is_visible', label: '노출', type: 'bool' },
    ],
  },
  preorder: {
    table: 'preorder_campaigns',
    label: '사전예약',
    titleField: 'ml:title',
    orderBy: { column: 'sort', ascending: true },
    fields: [
      { name: 'title', label: '제목', type: 'ml', required: true },
      { name: 'summary', label: '요약', type: 'mltext' },
      { name: 'url', label: '외부 링크', type: 'text' },
      { name: 'link_label', label: '버튼 문구', type: 'ml' },
      {
        name: 'status',
        label: '상태',
        type: 'select',
        options: [
          { value: 'current', label: '진행중' },
          { value: 'upcoming', label: '예정' },
          { value: 'hidden', label: '숨김' },
        ],
      },
      { name: 'starts_at', label: '시작', type: 'datetime' },
      { name: 'ends_at', label: '종료', type: 'datetime' },
      { name: 'sort', label: '정렬', type: 'number' },
    ],
  },
  waitlist: {
    table: 'waitlist_submissions',
    label: '대기명단',
    titleField: 'name',
    orderBy: { column: 'created_at', ascending: false },
    readonly: true,
    csv: true,
    fields: [],
  },
  rsvps: {
    table: 'rsvp_submissions',
    label: 'RSVP 신청',
    titleField: 'name',
    orderBy: { column: 'created_at', ascending: false },
    readonly: true,
    csv: true,
    fields: [],
  },
};

/** site_content slots edited with the same form engine (upsert by key) */
export const CONTENT_SLOTS: Record<string, { label: string; fields: FieldDef[] }> = {
  hero: {
    label: '랜딩 히어로',
    fields: [
      { name: 'badge', label: '배지 문구', type: 'ml' },
      { name: 'headline', label: '헤드라인', type: 'ml', required: true },
      { name: 'subcopy', label: '서브카피', type: 'mltext' },
      { name: 'cta_label', label: 'CTA 버튼 문구', type: 'ml' },
      { name: 'cta_href', label: 'CTA 링크', type: 'text', hint: '#waitlist 또는 URL' },
      { name: 'secondary_label', label: '보조 버튼 문구', type: 'ml' },
      { name: 'secondary_href', label: '보조 버튼 링크', type: 'text' },
      { name: 'visual_url', label: '배경 이미지', type: 'image' },
      { name: 'video_url', label: '배경 영상 URL', type: 'text', hint: '/hero/hero.mp4 또는 업로드 URL' },
      { name: 'visual_alt', label: '비주얼 대체 텍스트', type: 'ml' },
    ],
  },
  landing_intro: {
    label: '랜딩 브랜드 소개',
    fields: [
      { name: 'title', label: '제목', type: 'ml' },
      { name: 'body', label: '본문', type: 'mltext' },
    ],
  },
  about_brand: {
    label: 'About — 브랜드 소개',
    fields: [
      { name: 'title', label: '제목', type: 'ml' },
      { name: 'image_url', label: '이미지', type: 'image' },
      { name: 'body', label: '본문 (마크다운)', type: 'mlmd' },
    ],
  },
  about_founder: {
    label: 'About — 창업자 메시지',
    fields: [
      { name: 'title', label: '제목', type: 'ml' },
      { name: 'image_url', label: '이미지', type: 'image' },
      { name: 'body', label: '본문 (마크다운)', type: 'mlmd' },
    ],
  },
};
