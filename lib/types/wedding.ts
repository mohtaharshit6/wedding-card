export type EmblemType = 'ganesha' | 'custom' | 'monogram' | 'none';
export type WeddingStatus = 'draft' | 'published' | 'archived';
export type RsvpMode = 'database' | 'whatsapp' | 'disabled';

export interface Wedding {
  id: string;
  slug: string;
  status: WeddingStatus;
  couple_name1: string;
  couple_name2: string;
  monogram?: string | null;
  grandparents1?: string | null;
  parents1?: string | null;
  grandparents2?: string | null;
  parents2?: string | null;
  hashtag?: string | null;
  emblem_type: EmblemType;
  emblem_url?: string | null;
  has_shloka: boolean;
  shloka_line1?: string | null;
  shloka_line2?: string | null;
  shloka_line3?: string | null;
  blessing_text?: string | null;
  wedding_date_time: string; // ISO String
  venue_name: string;
  venue_address: string;
  venue_image_url?: string | null;
  venue_maps_link?: string | null;
  music_url?: string | null;
  footer_line1?: string | null;
  footer_line2?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ThemeConfig {
  id?: string;
  wedding_id: string;
  color_primary: string;
  color_secondary: string;
  color_accent: string;
  color_accent_soft: string;
  color_background: string;
  color_background_alt: string;
  color_rose: string;
  color_ink: string;
}

export interface WeddingEvent {
  id: string;
  wedding_id: string;
  sort_order: number;
  name: string;
  day?: string | null;
  date: string;
  time: string;
  image_url?: string | null;
  description?: string | null;
  dress_code_label?: string | null;
  dress_code_colors: string[];
  venue?: string | null;
  maps_link?: string | null;
}

export interface GalleryPhoto {
  id: string;
  wedding_id: string;
  sort_order: number;
  image_url: string;
  caption?: string | null;
  is_bw: boolean;
}

export interface RsvpConfig {
  id?: string;
  wedding_id: string;
  mode: RsvpMode;
  whatsapp_number?: string | null;
  email?: string | null;
  deadline_date?: string | null;
  meal_options: string[];
}

export interface RsvpSubmission {
  id?: string;
  wedding_id: string;
  guest_name: string;
  contact?: string | null;
  attending_status: 'Joyfully accepts' | 'Regretfully declines';
  guest_count: number;
  meal_preference?: string | null;
  message?: string | null;
  submitted_at?: string;
}

export interface WeddingFullData {
  wedding: Wedding;
  theme: ThemeConfig;
  events: WeddingEvent[];
  gallery: GalleryPhoto[];
  rsvpConfig: RsvpConfig;
}
