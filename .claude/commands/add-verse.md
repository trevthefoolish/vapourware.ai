# Add Next Verse to Ecclesiastes

You are a verse-adding agent for the vapourware.ai Bible display project.

## Step 1: Detect Current State

Read `index.html` and find:
1. The current verse count (look at the `verses` array)
2. The last verse number (e.g., "1:4" means we're adding 1:5 next)
3. Existing words in `wordData` (to reuse links where appropriate)

## Step 2: Fetch Next Verse

For Ecclesiastes chapter 1, use this reference data:

**Verse 5:** וְזָרַח הַשֶּׁמֶשׁ וּבָא הַשָּׁמֶשׁ וְאֶל־מְקוֹמוֹ שׁוֹאֵף זוֹרֵחַ הוּא שָׁם
"The sun rises and the sun sets, and hurries back to the place where it rises."

**Verse 6:** הוֹלֵךְ אֶל־דָּרוֹם וְסוֹבֵב אֶל־צָפוֹן סוֹבֵב סֹבֵב הוֹלֵךְ הָרוּחַ וְעַל־סְבִיבֹתָיו שָׁב הָרוּחַ
"The wind goes to the south and circles to the north; round and round goes the wind, and on its circuits the wind returns."

**Verse 7:** כָּל־הַנְּחָלִים הֹלְכִים אֶל־הַיָּם וְהַיָּם אֵינֶנּוּ מָלֵא אֶל־מְקוֹם שֶׁהַנְּחָלִים הֹלְכִים שָׁם הֵם שָׁבִים לָלָכֶת
"All streams flow to the sea, yet the sea is never full; to the place where the streams flow, there they flow again."

**Verse 8:** כָּל־הַדְּבָרִים יְגֵעִים לֹא־יוּכַל אִישׁ לְדַבֵּר לֹא־תִשְׂבַּע עַיִן לִרְאוֹת וְלֹא־תִמָּלֵא אֹזֶן מִשְּׁמֹעַ
"All things are wearisome, more than one can say. The eye is not satisfied with seeing, nor the ear filled with hearing."

(Continue pattern for remaining verses as needed)

## Step 3: Analyze Words

For each Hebrew word in the new verse:
1. Check if the root/concept already exists in `wordData` → reuse that `data-link`
2. If new, create a unique link key and generate a tidbit

Tidbit style guide (match existing tone):
- 2-3 sentences max
- Start with literal meaning, then theological/etymological depth
- End with connection to Ecclesiastes themes (cycles, breath, toil)

## Step 4: Present for Approval

Show the user:
1. Hebrew text with word breakdown
2. English translation with linked words
3. New tidbits that will be added
4. Which existing words are being reused

Ask: "Approve this verse? (yes/no/edit)"

## Step 5: On Approval

1. Add verse HTML after the last verse div
2. Add entry to verses array
3. Add new word data entries
4. Update page title (1:1-N)
5. Commit with message: "Add Ecclesiastes 1:N"
6. Push to branch
7. Immediately ask: "Continue to verse N+1?"

## Step 6: On "Continue"

Loop back to Step 1 with the new state.
