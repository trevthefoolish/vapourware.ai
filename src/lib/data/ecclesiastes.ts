/**
 * Ecclesiastes (קֹהֶלֶת - Qohelet) - Chapter 1
 *
 * Hebrew text with word-by-word metadata for interactive exploration
 */

import type { Verse, HebrewWord } from '$lib/types';

/**
 * Word definitions with Hebrew, transliteration, and scholarly tidbits
 */
export const wordData: Record<string, HebrewWord> = {
  words: {
    hebrew: 'דִּבְרֵי',
    transliteration: 'div·rei',
    english: 'words',
    tidbit: 'The construct form of "devarim" (words/things). In Hebrew, words and things share the same root — speech has substance, creating reality.',
    linkId: 'words',
  },
  teacher: {
    hebrew: 'קֹהֶלֶת',
    transliteration: 'qo·he·let',
    english: 'Teacher',
    tidbit: 'From "qahal" (assembly). One who gathers people to teach. Traditionally identified as Solomon in his old age, reflecting on life\'s meaning.',
    linkId: 'teacher',
  },
  son: {
    hebrew: 'בֶּן־דָּוִד',
    transliteration: 'ben-da·vid',
    english: 'son of David',
    tidbit: 'Son of David — a title claiming royal Davidic lineage. The hyphen (maqef) binds the words as one concept: a unified identity.',
    linkId: 'son',
  },
  king: {
    hebrew: 'מֶלֶךְ',
    transliteration: 'me·lekh',
    english: 'king',
    tidbit: 'King — from a root meaning "to counsel." The king wasn\'t merely a ruler but an advisor to the nation, responsible for wisdom and justice.',
    linkId: 'king',
  },
  jerusalem: {
    hebrew: 'בִּירוּשָׁלָֽםִ',
    transliteration: 'bi·ru·sha·la·yim',
    english: 'Jerusalem',
    tidbit: 'In Jerusalem — literally "foundation of peace" (or "teaching of peace"). The city where heaven and earth meet, seat of wisdom and worship.',
    linkId: 'jerusalem',
  },
  vanity: {
    hebrew: 'הֶבֶל',
    transliteration: 'he·vel',
    english: 'vanity',
    tidbit: 'Often translated "vanity" but literally means breath, vapor, or mist. Something that appears and quickly vanishes — not worthless, but fleeting and ungraspable.',
    linkId: 'vanity',
  },
  says: {
    hebrew: 'אָמַר',
    transliteration: 'a·mar',
    english: 'says',
    tidbit: 'He said — the basic Hebrew word for speech. Its placement here gives Qohelet\'s words prophetic weight, like "thus says the LORD."',
    linkId: 'says',
  },
  all: {
    hebrew: 'הַכֹּל',
    transliteration: 'ha·kol',
    english: 'all',
    tidbit: 'The all, everything — with the definite article. Not just "everything" but THE everything: the totality of human experience under the sun.',
    linkId: 'all',
  },
  gain: {
    hebrew: 'מַה־יִּתְרוֹן',
    transliteration: 'mah-yit·ron',
    english: 'gain',
    tidbit: 'What profit/advantage? "Yitron" appears only in Ecclesiastes — a commercial term asking what remains after all costs are counted.',
    linkId: 'gain',
  },
  man: {
    hebrew: 'לָאָדָם',
    transliteration: 'la·a·dam',
    english: 'man',
    tidbit: 'To/for the human — "adam" connects to "adamah" (earth/ground). Humanity is earthbound, made from dust and returning to it.',
    linkId: 'man',
  },
  labor: {
    hebrew: 'בְּכָל־עֲמָלוֹ',
    transliteration: 'be·khol-a·ma·lo',
    english: 'labor',
    tidbit: 'In all his toil — "amal" implies wearisome, exhausting labor. Not just work, but the grinding effort that wears down body and soul.',
    linkId: 'labor',
  },
  toils: {
    hebrew: 'שֶׁיַּעֲמֹל',
    transliteration: 'she·ya·a·mol',
    english: 'toils',
    tidbit: 'That he toils — the same root as "amal" intensified. The repetition emphasizes life\'s endless cycle of effort upon effort.',
    linkId: 'toils',
  },
  under: {
    hebrew: 'תַּחַת',
    transliteration: 'ta·chat',
    english: 'under',
    tidbit: 'Under/beneath — establishes a boundary. Everything "under the sun" is earthly, temporal. What lies above remains a mystery.',
    linkId: 'under',
  },
  sun: {
    hebrew: 'הַשָּׁמֶשׁ',
    transliteration: 'ha·sha·mesh',
    english: 'sun',
    tidbit: 'The sun — "under the sun" appears 29 times in Ecclesiastes. It defines the book\'s scope: life as experienced in this visible world, under heaven\'s watchful eye.',
    linkId: 'sun',
  },
  generation: {
    hebrew: 'דּוֹר',
    transliteration: 'dor',
    english: 'generation',
    tidbit: 'Generation — from a root meaning "to circle" or "to dwell." Each generation inhabits its moment, then yields to the next in an endless cycle.',
    linkId: 'generation',
  },
  goes: {
    hebrew: 'הֹלֵךְ',
    transliteration: 'ho·lekh',
    english: 'goes',
    tidbit: 'Goes/walks away — the present participle of "halakh" (to walk). Life is movement toward departure; every generation is always already leaving.',
    linkId: 'goes',
  },
  comes: {
    hebrew: 'בָּא',
    transliteration: 'ba',
    english: 'comes',
    tidbit: 'Comes/arrives — the counterpart to "goes." While one generation departs, another enters. The stage is never empty, yet the actors always change.',
    linkId: 'comes',
  },
  earth: {
    hebrew: 'וְהָאָרֶץ',
    transliteration: 've·ha·a·retz',
    english: 'earth',
    tidbit: 'But the earth — "eretz" is the land, the ground, the world itself. Against human transience, it stands as silent witness to all comings and goings.',
    linkId: 'earth',
  },
  forever: {
    hebrew: 'לְעוֹלָם',
    transliteration: 'le·o·lam',
    english: 'forever',
    tidbit: 'Forever — "olam" means hidden time, eternity, or age. The earth endures into time beyond human reckoning, a permanence we can name but never know.',
    linkId: 'forever',
  },
  remains: {
    hebrew: 'עֹמָדֶת',
    transliteration: 'o·me·det',
    english: 'remains',
    tidbit: 'Stands/remains — from "amad" (to stand firm). While generations flow like water, the earth stands like a rock. The verb suggests quiet, steadfast presence.',
    linkId: 'remains',
  },
};

/**
 * Helper to create a HebrewWord from a link ID
 */
function word(linkId: string, hebrewOverride?: string): HebrewWord {
  const base = wordData[linkId];
  if (!base) {
    throw new Error(`Unknown word link: ${linkId}`);
  }
  return hebrewOverride ? { ...base, hebrew: hebrewOverride } : base;
}

/**
 * Ecclesiastes Chapter 1, Verses 1-4
 */
export const ecclesiastes1: Verse[] = [
  {
    number: 1,
    hebrew: [
      word('words'),
      word('teacher'), // Placeholder in original - the floating qohelet
      word('son'),
      word('king'),
      word('jerusalem'),
    ],
    englishText: 'The words of the Teacher, son of David, king in Jerusalem',
    englishWords: ['The', 'words', 'of the', 'Teacher', 'son of David', 'king', 'in', 'Jerusalem'],
  },
  {
    number: 2,
    hebrew: [
      word('vanity', 'הֲבֵל'),
      word('vanity', 'הֲבָלִים'),
      word('says'),
      word('teacher'),
      word('vanity', 'הֲבֵל'),
      word('vanity', 'הֲבָלִים'),
      word('all'),
      word('vanity', 'הָבֶל'),
    ],
    englishText: 'Vanity of vanities, says the Teacher, vanity of vanities! All is vanity.',
    englishWords: ['Vanity', 'of', 'vanities', 'says', 'the', 'Teacher', 'vanity', 'of', 'vanities', 'All', 'is', 'vanity'],
  },
  {
    number: 3,
    hebrew: [
      word('gain'),
      word('man'),
      word('labor'),
      word('toils'),
      word('under'),
      word('sun'),
    ],
    englishText: 'What gain has man from all his toil at which he toils under the sun?',
    englishWords: ['What', 'gain', 'has', 'man', 'from', 'all his toil', 'at which he', 'toils', 'under', 'the', 'sun'],
  },
  {
    number: 4,
    hebrew: [
      word('generation'),
      word('goes'),
      word('generation', 'וְדוֹר'), // "and a generation"
      word('comes'),
      word('earth'),
      word('forever'),
      word('remains'),
    ],
    englishText: 'A generation goes, and a generation comes, but the earth remains forever.',
    englishWords: ['A', 'generation', 'goes', 'and a', 'generation', 'comes', 'but the', 'earth', 'remains', 'forever'],
  },
];

/**
 * Book metadata
 */
export const ecclesiastesBook = {
  name: 'Ecclesiastes',
  hebrewName: 'קֹהֶלֶת',
  transliteration: 'Qohelet',
  chapterCount: 12,
  testament: 'old' as const,
  order: 21,
};
