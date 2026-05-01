
export interface Song {
  titleMk: string;
  titleEn: string;
  titleRu: string;
  artistMk: string;
  artistEn: string;
  artistRu: string;
  descriptionMk: string;
  descriptionEn: string;
  descriptionRu: string;
}

export interface Insight {
  content: string;
}

export type Language = 'mk' | 'en' | 'ru';
