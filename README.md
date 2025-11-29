# vapourware.ai

An interactive meditation on Ecclesiastes 1:1–3, presenting the Hebrew text alongside English translation with scholarly annotations. The interface invites slow, contemplative exploration—each word a point of entry into deeper meaning.

---

## Style Guide

### Design Philosophy

**Minimalism in service of meaning.** Every visual choice supports the text rather than competing with it. The interface should feel like a quiet room—spare, warm, and attentive.

**Hebrew is primary.** The original language takes precedence in size, position, and emphasis. English serves as a scholarly aid, not a replacement.

**Motion should feel natural.** Animations follow spring physics rather than linear timing. Elements breathe, settle, and respond—never snap or jolt.

---

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--gold` | `#daa520` | Highlights, active states, significance |
| `--gold-lit` | `#f0d060` | Intensified glow, tooltips |
| `--cream` | `#f5f2eb` | Primary text |
| `--cream-dim` | `rgba(245, 242, 235, 0.68)` | Secondary text, inactive words |
| `--bg` | `#0a0a0a` | Background |

**Rationale:** Gold against black evokes illumination—words lighting up from darkness. Cream provides warmth without the harshness of pure white. The palette is deliberately constrained; adding colors dilutes the symbolic resonance.

---

### Typography

**Typeface:** Cormorant Garamond (serif)

| Context | Weight | Size | Notes |
|---------|--------|------|-------|
| Hebrew title (קֹהֶלֶת) | 400 | `clamp(50px, 12vw, 78px)` | Largest element |
| Hebrew words | 400 | `clamp(30px, 7.5vw, 40px)` | Generous for legibility |
| English title | 300 | `clamp(24px, 5vw, 34px)` | Light weight, smaller than Hebrew |
| English words | 300 | `clamp(20px, 5vw, 26px)` | Italic, supportive role |

**Spacing:**
- Hebrew line-height: `1.6`
- English line-height: `2.2`
- Word gaps: `0.3em` vertical, `0.45em` horizontal
- Letter-spacing: `0.02em`–`0.2em` depending on context

**Rationale:** A serif typeface honors the sacred nature of the text. Light weights for English create visual hierarchy without diminishing readability. Generous sizing prioritizes eye comfort, especially on mobile.

---

### Animation Principles

**Spring physics over keyframes.** User input feeds into a spring system with tension and friction. The interface responds proportionally—gentle scroll yields gentle motion; quick gestures snap with purpose.

**Staggered reveals.** When multiple elements animate together, they enter in sequence (60–150ms delays). This creates rhythm and draws the eye through content.

**Ambient motion at rest.** Subtle breathing (scale oscillation, gentle drift) signals that the interface is alive without demanding attention.

**Easing vocabulary:**
- Entry: `cubic-bezier(0.34, 1.56, 0.64, 1)` — overshoot, then settle
- Exit: `cubic-bezier(0.4, 0, 0.2, 1)` — smooth departure
- Glow pulse: `ease-in-out` over 2.5s — meditative rhythm

---

### Interaction Model

**State-based navigation.** The experience comprises discrete anchors (title → verses) with smooth interpolation between them. Scrolling doesn't move a page; it transitions between states.

**Word-level interactivity.** Each word is a portal. Tapping or hovering reveals:
1. The Hebrew word (if viewing English, and vice versa)
2. Transliteration with syllable breaks (e.g., `qo·he·let`)
3. A "tidbit"—etymological or theological context

**Coordinated highlighting.** Selecting a word illuminates all semantically linked words across both languages. The connection between הֶבֶל and "vanity" becomes visible.

**Generous touch targets.** Hit detection extends 8px beyond visual boundaries. Mobile users should never struggle to select a word.

---

### Translation Choices

**Scholarly rather than devotional.** Annotations explain linguistic roots and interpretive nuance. We do not preach; we illuminate.

**Conservative English rendering:**
- קֹהֶלֶת → "Teacher" (not "Preacher")
- הֶבֶל → "Vanity" with annotation explaining the literal meaning (breath, vapor, mist)

**Transliteration conventions:**
- Use centered dots for syllable breaks: `qo·he·let`
- Preserve guttural sounds: `hā·ḇel` (with macrons and dots as appropriate)
- Aim for phonetic accessibility to English readers

**Tidbit voice:** Present tense, explanatory, collegial. Tidbits should feel like a knowledgeable friend leaning over to share an insight—not a footnote from a dusty commentary.

Example:
> From "qahal" (assembly). One who gathers people to teach—less a title than a role.

---

### Toolkit

| Layer | Technology | Notes |
|-------|------------|-------|
| Markup | HTML5 | Single file, semantic structure |
| Styling | CSS3 | Custom properties, keyframe animations |
| Interactivity | Vanilla JavaScript | No frameworks; ~860 lines |
| Typography | Google Fonts | Cormorant Garamond |
| Deployment | GitHub Pages | Static hosting via CNAME |

**No build step.** The project ships as authored. This constraint enforces simplicity and ensures anyone can read, understand, and modify the source.

**No dependencies.** Animation, state management, and physics are implemented from scratch. External libraries add weight and obscure intent.

---

### Code Organization

CSS and JavaScript are organized by component with clear section markers:

```css
/* ===== HEBREW TITLE (קֹהֶלֶת) ===== */
/* ===== VERSES ===== */
/* ===== WORD TOOLTIP ===== */
```

```javascript
// ===== SPRING =====
// ===== STATE =====
// ===== RENDER =====
```

**Naming conventions:**
- CSS classes: `word-he`, `word-en`, `verse`, `tooltip`
- IDs for unique elements: `qohelet-floating`, `tooltip`, `nav-dots`
- Data attributes for linking: `data-link="vanity"`

---

### Mobile Considerations

Mobile is not secondary. Half of all visitors will arrive on phones.

- **Font sizes:** Minimum 20px for body text
- **Safe areas:** Respect `env(safe-area-inset-bottom)` for notched devices
- **Touch events:** Handle `touchstart`, `touchmove`, `touchend` explicitly
- **Navigation hints:** Provide "swipe to explore" affordance on first visit
- **Viewport:** Lock scale to prevent accidental zoom during interaction

---

### Guiding Principles

1. **Serve the text.** If a design choice doesn't help someone engage with Ecclesiastes, reconsider it.

2. **Prefer removal to addition.** When in doubt, take something away. Complexity should be earned.

3. **Honor the original.** Hebrew comes first—in size, in sequence, in emphasis.

4. **Reward curiosity.** Interaction should reveal depth. Each tap should teach something.

5. **Breathe.** Allow whitespace. Allow silence. Allow the reader to sit with a word.

---

## Development

Open `index.html` in a browser. There is no build process.

For local development with live reload:
```bash
python -m http.server 8000
# or
npx serve .
```

---

## License

The text of Ecclesiastes belongs to no one and everyone.

The code is offered freely. Use it, learn from it, make something contemplative.
