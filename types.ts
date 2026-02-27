
export interface Hadith {
  id: number;
  text: string;
  source: string;
  narrator: string;
  before: string;
  response: string;
  other: string;
}

export interface User {
  username: string;
  isAdmin: boolean;
}

export interface Question {
  id: string;
  text: string;
  author: string;
  timestamp: number;
  answer?: string;
  answeredBy?: string;
  answerTimestamp?: number;
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
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  HOME = 'HOME', // This will be the Hadith Search view
  SEARCH = 'SEARCH',
  CLASSIFY = 'CLASSIFY',
  QA = 'QA',
}
