<script setup>
import { computed } from 'vue'
import WordHebrew from './WordHebrew.vue'
import WordEnglish from './WordEnglish.vue'

const props = defineProps({
  verse: Object,
  verseIndex: Number,
  state: Object,
  wordProgress: Number,
  enOpacity: Number,
  litLink: String,
  litStagger: Boolean,
  touchActiveLink: String
})

const emit = defineEmits(['word-click', 'word-hover', 'word-leave', 'word-touchstart'])

// Parse English text into segments (plain text and linked words)
const englishSegments = computed(() => {
  const segments = []
  const regex = /<(\w+)>/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(props.verse.english)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: props.verse.english.slice(lastIndex, match.index) })
    }
    // Add the linked word
    segments.push({ type: 'link', link: match[1], content: match[1] })
    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < props.verse.english.length) {
    segments.push({ type: 'text', content: props.verse.english.slice(lastIndex) })
  }

  return segments
})

// Calculate word styles based on reveal progress
function getWordStyle(wordIndex) {
  const totalWords = props.verse.hebrew.length
  const progress = props.wordProgress * (totalWords + 1)
  const wordT = Math.max(0, Math.min(1, progress - wordIndex))

  return {
    opacity: wordT,
    transform: wordT < 1 ? `translateY(${(1 - wordT) * 10}px)` : 'none'
  }
}
</script>

<template>
  <div
    class="verse"
    :style="{
      opacity: state?.opacity ?? 0,
      transform: `translateY(${state?.y ?? 25}px)`,
      pointerEvents: (state?.opacity ?? 0) > 0.2 ? 'auto' : 'none'
    }"
  >
    <div class="verse-he">
      <template v-for="(word, i) in verse.hebrew" :key="i">
        <span v-if="word.isPlaceholder" class="placeholder" :ref="el => $emit('placeholder-ref', verseIndex, el)">
          {{ word.text }}
        </span>
        <WordHebrew
          v-else
          :text="word.text"
          :link="word.link"
          :is-lit="litLink === word.link && !litStagger"
          :is-lit-stagger="litLink === word.link && litStagger"
          :is-touch-active="touchActiveLink === word.link"
          :style="getWordStyle(i)"
          @click="$emit('word-click', { el: $event.target, link: word.link, event: $event })"
          @mouseenter="$emit('word-hover', word.link)"
          @mouseleave="$emit('word-leave')"
          @touchstart="$emit('word-touchstart', { el: $event.target, link: word.link, event: $event })"
        />
      </template>
    </div>

    <div class="verse-en" :style="{ opacity: enOpacity }">
      <template v-for="(seg, i) in englishSegments" :key="i">
        <span v-if="seg.type === 'text'">{{ seg.content }}</span>
        <WordEnglish
          v-else
          :text="seg.content"
          :link="seg.link"
          :is-lit="litLink === seg.link && !litStagger"
          :is-lit-stagger="litLink === seg.link && litStagger"
          :is-touch-active="touchActiveLink === seg.link"
          @click="$emit('word-click', { el: $event.target, link: seg.link, event: $event })"
          @mouseenter="$emit('word-hover', seg.link)"
          @mouseleave="$emit('word-leave')"
          @touchstart="$emit('word-touchstart', { el: $event.target, link: seg.link, event: $event })"
        />
      </template>
    </div>
  </div>
</template>
