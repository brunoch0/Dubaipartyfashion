import type { Locale } from './i18n';

/** Static UI strings (chrome/labels). Content copy lives in Supabase. */
const dict = {
  nav_about: { en: 'About', ko: '브랜드 소개', ar: 'من نحن' },
  nav_journal: { en: 'Journal', ko: '아티클', ar: 'مقالات' },
  nav_lookbook: { en: 'Lookbook', ko: '룩북', ar: 'لوك بوك' },
  nav_events: { en: 'Events', ko: '이벤트', ar: 'فعاليات' },
  nav_shop: { en: 'Shop', ko: '쇼핑몰', ar: 'المتجر' },
  join_waitlist: { en: 'Join the Waitlist', ko: '대기명단 가입', ar: 'انضم إلى قائمة الانتظار' },
  waitlist_name: { en: 'Name', ko: '이름', ar: 'الاسم' },
  waitlist_email: { en: 'Email', ko: '이메일', ar: 'البريد الإلكتروني' },
  waitlist_tags: { en: 'Interests (optional)', ko: '관심 취향 (선택)', ar: 'الاهتمامات (اختياري)' },
  waitlist_submit: { en: 'Join', ko: '가입하기', ar: 'انضم' },
  waitlist_submitting: { en: 'Submitting…', ko: '제출 중…', ar: 'جارٍ الإرسال…' },
  waitlist_success: {
    en: "You're on the list. We'll be in touch soon.",
    ko: '대기명단에 등록되었습니다. 곧 소식을 전해드릴게요.',
    ar: 'تم تسجيلك في القائمة. سنتواصل معك قريباً.',
  },
  waitlist_duplicate: {
    en: 'This email is already on the waitlist.',
    ko: '이미 등록된 이메일입니다.',
    ar: 'هذا البريد الإلكتروني مسجل بالفعل.',
  },
  form_error: {
    en: 'Something went wrong. Please try again.',
    ko: '오류가 발생했습니다. 다시 시도해주세요.',
    ar: 'حدث خطأ ما. يرجى المحاولة مرة أخرى.',
  },
  form_retry: { en: 'Retry', ko: '다시 시도', ar: 'إعادة المحاولة' },
  invalid_email: { en: 'Please enter a valid email.', ko: '올바른 이메일을 입력해주세요.', ar: 'يرجى إدخال بريد إلكتروني صحيح.' },
  required_field: { en: 'This field is required.', ko: '필수 입력 항목입니다.', ar: 'هذا الحقل مطلوب.' },
  privacy_note: {
    en: 'By submitting, you agree to our privacy policy.',
    ko: '제출 시 개인정보 처리방침에 동의하는 것으로 간주됩니다.',
    ar: 'بإرسال النموذج، فإنك توافق على سياسة الخصوصية.',
  },
  read_more: { en: 'Read more', ko: '더 알아보기', ar: 'اقرأ المزيد' },
  view_all: { en: 'View all', ko: '전체 보기', ar: 'عرض الكل' },
  back_to_list: { en: 'Back to list', ko: '목록으로 돌아가기', ar: 'العودة إلى القائمة' },
  all: { en: 'All', ko: '전체', ar: 'الكل' },
  load_more: { en: 'Load more', ko: '더보기', ar: 'تحميل المزيد' },
  no_results: { en: 'Nothing here yet.', ko: '아직 콘텐츠가 없습니다.', ar: 'لا يوجد محتوى بعد.' },
  upcoming_events: { en: 'Upcoming Events', ko: '다가오는 이벤트', ar: 'الفعاليات القادمة' },
  event_date: { en: 'Date', ko: '일시', ar: 'التاريخ' },
  event_venue: { en: 'Venue', ko: '장소', ar: 'المكان' },
  event_open: { en: 'Open', ko: '모집중', ar: 'مفتوح' },
  event_closed: { en: 'Closed', ko: '마감', ar: 'مغلق' },
  event_full: { en: 'Fully booked', ko: '정원 마감', ar: 'اكتمل العدد' },
  rsvp_title: { en: 'RSVP', ko: 'RSVP / 신청', ar: 'تأكيد الحضور' },
  rsvp_contact: { en: 'Email or phone', ko: '이메일 또는 연락처', ar: 'البريد الإلكتروني أو الهاتف' },
  rsvp_party_size: { en: 'Guests', ko: '인원', ar: 'عدد الضيوف' },
  rsvp_note: { en: 'Note (optional)', ko: '메모 (선택)', ar: 'ملاحظة (اختياري)' },
  rsvp_submit: { en: 'Submit RSVP', ko: '신청하기', ar: 'إرسال' },
  rsvp_success: {
    en: 'Your RSVP is confirmed. See you there!',
    ko: '신청이 완료되었습니다. 현장에서 만나요!',
    ar: 'تم تأكيد حضورك. نراك هناك!',
  },
  rsvp_duplicate: {
    en: 'You have already RSVPed to this event.',
    ko: '이미 이 이벤트에 신청하셨습니다.',
    ar: 'لقد قمت بتأكيد حضورك لهذه الفعالية بالفعل.',
  },
  rsvp_closed_notice: {
    en: 'This event is closed. Join the waitlist to hear about the next one.',
    ko: '마감된 이벤트입니다. 대기명단에 가입하고 다음 소식을 받아보세요.',
    ar: 'هذه الفعالية مغلقة. انضم إلى قائمة الانتظار لمعرفة الفعالية القادمة.',
  },
  map_link: { en: 'View map', ko: '지도 보기', ar: 'عرض الخريطة' },
  shop_coming_soon: { en: 'Coming Soon', ko: '커밍 순', ar: 'قريباً' },
  shop_notice: {
    en: 'Our shop is opening soon — fashion, partywear and fragrance.',
    ko: '쇼핑몰이 곧 오픈합니다 — 패션, 파티복, 향수까지.',
    ar: 'متجرنا يفتح قريباً — أزياء وملابس حفلات وعطور.',
  },
  founders_message: { en: "Founder's Message", ko: '창업자 메시지', ar: 'رسالة المؤسس' },
  sns_feed: { en: 'Follow the Journey', ko: 'SNS 피드', ar: 'تابع رحلتنا' },
  preorder: { en: 'Pre-order', ko: '사전예약', ar: 'الطلب المسبق' },
  preorder_upcoming: { en: 'Opening soon', ko: '오픈 예정', ar: 'قريباً' },
  published: { en: 'Published', ko: '발행일', ar: 'تاريخ النشر' },
  min_read: { en: 'min read', ko: '분 소요', ar: 'دقيقة قراءة' },
  related_articles: { en: 'Related articles', ko: '관련 아티클', ar: 'مقالات ذات صلة' },
  external_notice: { en: 'Opens in a new tab', ko: '새 탭에서 열립니다', ar: 'يفتح في تبويب جديد' },
} as const;

export type DictKey = keyof typeof dict;

export function t(key: DictKey, locale: Locale): string {
  return dict[key][locale] || dict[key].en;
}
