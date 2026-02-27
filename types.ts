
export interface Hadith {
  id: number;
  text: string;
  source: string;
  narrator: string;
  before: string;
  response: string;
  other: string;
}

export interface SearchResult {
  mainHadith: Hadith;
  similarHadiths: Hadith[];
}

export interface CategorizedResult {
    category: string;
    hadiths: Hadith[];
}

export type CategorizedHadiths = Record<string, Hadith[]>;

export enum SearchMode {
  EXACT = 'EXACT',
  ALL_WORDS = 'ALL_WORDS',
  SIMILAR = 'SIMILAR',
}

export enum View {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  CLASSIFY = 'CLASSIFY',
}
