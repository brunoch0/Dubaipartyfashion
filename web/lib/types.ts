import type { MLText } from './i18n';

export interface SiteContent {
  key: string;
  data: Record<string, unknown>;
}

export interface LinkItem {
  id: string;
  label: MLText;
  url: string;
  link_type: 'sns' | 'event' | 'community' | 'other';
  platform: string | null;
  section_id: string;
  description: MLText;
  new_tab: boolean;
  sort: number;
}

export interface PreorderCampaign {
  id: string;
  title: MLText;
  summary: MLText;
  url: string | null;
  link_label: MLText;
  status: 'current' | 'upcoming' | 'hidden';
  starts_at: string | null;
  ends_at: string | null;
}

export interface Article {
  id: string;
  slug: string;
  title: MLText;
  summary: MLText;
  body: MLText;
  cover_image: string | null;
  og_image: string | null;
  tags: string[];
  author: string | null;
  reading_minutes: number | null;
  featured: boolean;
  published_at: string | null;
}

export interface Lookbook {
  id: string;
  slug: string;
  title: MLText;
  summary: MLText;
  cover_image: string | null;
  og_image: string | null;
  season: string | null;
  tags: string[];
  sort: number;
}

export interface LookbookImage {
  id: string;
  lookbook_id: string;
  image_url: string;
  caption: MLText;
  alt: MLText;
  sort: number;
}

export interface EventExternalLink {
  label: MLText;
  url: string;
  type?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  title: MLText;
  summary: MLText;
  description: MLText;
  starts_at: string;
  ends_at: string | null;
  venue: MLText;
  map_url: string | null;
  cover_image: string | null;
  tags: string[];
  capacity: number | null;
  price_note: MLText;
  external_links: EventExternalLink[];
  rsvp_status: 'open' | 'closed' | 'full';
}

export interface SnsPost {
  id: string;
  platform: string;
  post_url: string;
  image_url: string | null;
  caption: MLText;
  sort: number;
}
