/**
 * Type definitions for the Hebrew Bible application
 */

/**
 * A single Hebrew word with its translation and metadata
 */
export interface HebrewWord {
  /** The Hebrew text */
  hebrew: string;

  /** Transliteration with syllable breaks (e.g., "qo-he-let") */
  transliteration: string;

  /** English translation/gloss */
  english: string;

  /** Optional scholarly note or contextual tidbit */
  tidbit?: string;

  /** Link ID to connect Hebrew and English words */
  linkId?: string;

  /** Strong's number for concordance reference */
  strongs?: string;
}

/**
 * A single verse containing Hebrew words and English translation
 */
export interface Verse {
  /** Verse number within the chapter */
  number: number;

  /** Array of Hebrew words in reading order (RTL) */
  hebrew: HebrewWord[];

  /** Full English translation text */
  englishText: string;

  /** English words (for word-by-word alignment) */
  englishWords?: string[];
}

/**
 * A chapter containing multiple verses
 */
export interface Chapter {
  /** Chapter number */
  number: number;

  /** Array of verses */
  verses: Verse[];
}

/**
 * A book of the Bible
 */
export interface Book {
  /** English name */
  name: string;

  /** Hebrew name */
  hebrewName: string;

  /** Transliteration of Hebrew name */
  transliteration: string;

  /** Number of chapters */
  chapterCount: number;

  /** Testament: 'old' or 'new' */
  testament: 'old' | 'new';

  /** Book order in canon */
  order: number;
}

/**
 * Bible reference (book, chapter, verse)
 */
export interface BibleReference {
  book: string;
  chapter: number;
  verse?: number;
}

/**
 * Word tooltip data
 */
export interface TooltipData {
  word: HebrewWord;
  position: { x: number; y: number };
  direction: 'above' | 'below';
}

/**
 * Animation state for a verse
 */
export interface VerseAnimationState {
  isVisible: boolean;
  isRevealed: boolean;
  wordProgress: number; // 0-1
}

/**
 * Scroll position info
 */
export interface ScrollInfo {
  progress: number;
  direction: 'up' | 'down';
  velocity: number;
}
