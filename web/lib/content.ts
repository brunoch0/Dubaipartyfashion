import { supabase } from './supabase';
import type {
  Article,
  EventItem,
  LinkItem,
  Lookbook,
  LookbookImage,
  PreorderCampaign,
  SnsPost,
} from './types';
import type { MLText } from './i18n';

/** Hero / about / footer copy slots stored in site_content */
export interface HeroContent {
  badge?: MLText;
  headline?: MLText;
  subcopy?: MLText;
  cta_label?: MLText;
  cta_href?: string;
  secondary_label?: MLText;
  secondary_href?: string;
  visual_url?: string;
  visual_alt?: MLText;
}

export interface AboutSection {
  title?: MLText;
  body?: MLText;
  image_url?: string;
}

export async function getSiteContent<T>(key: string): Promise<T | null> {
  const { data } = await supabase.from('site_content').select('data').eq('key', key).maybeSingle();
  return (data?.data as T) ?? null;
}

export async function getLinks(sectionId?: string): Promise<LinkItem[]> {
  let q = supabase.from('links').select('*').order('sort');
  if (sectionId) q = q.eq('section_id', sectionId);
  const { data } = await q;
  return (data as LinkItem[]) ?? [];
}

export async function getPreorderCampaigns(): Promise<PreorderCampaign[]> {
  const { data } = await supabase
    .from('preorder_campaigns')
    .select('*')
    .neq('status', 'hidden')
    .order('sort');
  return (data as PreorderCampaign[]) ?? [];
}

export async function getArticles(limit?: number): Promise<Article[]> {
  let q = supabase
    .from('articles')
    .select('id,slug,title,summary,cover_image,og_image,tags,author,reading_minutes,featured,published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data as Article[]) ?? [];
}

export async function getArticle(slug: string): Promise<Article | null> {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();
  return (data as Article) ?? null;
}

export async function getLookbooks(limit?: number): Promise<Lookbook[]> {
  let q = supabase
    .from('lookbooks')
    .select('id,slug,title,summary,cover_image,og_image,season,tags,sort')
    .eq('status', 'published')
    .order('sort');
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data as Lookbook[]) ?? [];
}

export async function getLookbook(
  slug: string
): Promise<{ lookbook: Lookbook; images: LookbookImage[] } | null> {
  const { data: lookbook } = await supabase
    .from('lookbooks')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();
  if (!lookbook) return null;
  const { data: images } = await supabase
    .from('lookbook_images')
    .select('*')
    .eq('lookbook_id', lookbook.id)
    .order('sort');
  return { lookbook: lookbook as Lookbook, images: (images as LookbookImage[]) ?? [] };
}

export async function getEvents(limit?: number): Promise<EventItem[]> {
  let q = supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .order('starts_at', { ascending: false });
  if (limit) q = q.limit(limit);
  const { data } = await q;
  return (data as EventItem[]) ?? [];
}

export async function getEvent(slug: string): Promise<EventItem | null> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'published')
    .eq('slug', slug)
    .maybeSingle();
  return (data as EventItem) ?? null;
}

export async function getSnsPosts(): Promise<SnsPost[]> {
  const { data } = await supabase.from('sns_posts').select('*').order('sort');
  return (data as SnsPost[]) ?? [];
}
