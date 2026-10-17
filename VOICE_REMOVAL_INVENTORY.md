# Voice Features Removal - Complete Inventory

## Files Containing Voice Features

### 1. src/hooks/useVoiceInput.ts
**Status:** DELETE ENTIRE FILE
- Complete voice input hook with Web Speech API
- Functions: useVoiceInput(), parseVoiceEntry()
- Handles speech recognition for Hindi/English
- Used by: AskScreen, SaleEntryScreen, ExpenseEntryScreen

### 2. src/components/AskScreen.tsx
**Voice Elements to Remove:**
- Line 4: Import useVoiceInput
- Line 10-11: Import speakText, stopSpeaking
- Line 19: State: isSpeaking
- Line 23: useVoiceInput hook call
- Lines 36-41: Voice input effect handler
- Lines 80-87: handleSpeak function
- Lines 168-178: Read-aloud button (🔊) in message bubbles
- Lines 288-307: Microphone button (🎤) in input area
- Layout: Text input needs to expand to full width after mic removal

### 3. src/components/learn/LessonCard.tsx
**Voice Elements to Remove:**
- Line 17: State: isSpeaking
- Lines 50-62: handleSpeak function with speechSynthesis
- Lines 95-100: Audio narration button (🔊) in header
- Layout: Header needs adjustment after button removal

### 4. src/components/data/SaleEntryScreen.tsx
**Voice Elements to Remove:**
- Line 4: Import useVoiceInput, parseVoiceEntry
- Line 18: State: showVoice
- Line 19: State: voicePreview
- Line 21: useVoiceInput hook call
- Lines 32-41: handleVoiceResult function
- Lines 65-136: Entire voice input screen (showVoice conditional)
  - Microphone button (🎤)
  - Listening state display
  - Transcript display
  - "This is correct" button
  - "Type instead" button
- Lines 250-252: Voice input button at bottom
- Layout: Bottom buttons need adjustment

### 5. src/components/data/ExpenseEntryScreen.tsx
**Voice Elements to Remove:**
- Line 4: Import useVoiceInput, parseVoiceEntry
- Line 18: State: showVoice
- Line 20: useVoiceInput hook call
- Lines 31-48: handleVoiceResult function
- Lines 72-140: Entire voice input screen (showVoice conditional)
  - Microphone button (🎤)
  - Listening state display
  - Transcript display
  - "This is correct" button
  - "Type instead" button
- Lines 239-241: Voice input button at bottom
- Layout: Bottom buttons need adjustment

### 6. src/models/conversation.ts
**Voice Elements to Remove:**
- Lines 283-290: speakText function (text-to-speech)
- Lines 293-296: stopSpeaking function

### 7. src/models/pricing.ts
**Voice Elements to Remove:**
- Line 26: 'Voice input and output' in free plan features (English)
- Line 90: 'voice-input' in freeFeatures array

### 8. src/i18n/translations.ts
**Voice Elements to Remove:**

English translations:
- Line 134: homeVoice: 'Or tell me by voice'
- Line 146: voiceInput: 'Voice input'
- Line 164: enterByVoice: 'Enter by voice'
- Line 165: tellByVoice: 'Tell me by voice'
- Line 166: sayExample: 'Say: "aaj 4500 ka maal bika" or "5000 ki bikri"'
- Line 167: listening: 'Listening...'
- Line 168: iHeard: 'I heard:'
- Line 169: thisIsCorrect: 'This is correct'
- Line 170: typeInstead: 'Type instead'

Hindi translations:
- Line 334: homeVoice: 'या आवाज़ से बताएं'
- Line 346: voiceInput: 'आवाज़ से'
- Line 364: enterByVoice: 'आवाज़ से डालें'
- Line 365: tellByVoice: 'बोलकर बताएं'
- Line 366: sayExample: 'बोलें: "आज 4500 का माल बिका" या "5000 की बिक्री"'
- Line 367: listening: 'सुन रहा हूँ...'
- Line 368: iHeard: 'मैंने सुना:'
- Line 369: thisIsCorrect: 'यह सही है'
- Line 370: typeInstead: 'टाइप करके डालें'

### 9. src/index.css
**Voice Elements to Remove:**
- Lines 530-554: .mic-button styles (64px diameter button)
- Lines 556-563: .mic-button:active styles
- Lines 565-571: .mic-button.recording styles
- Lines 573-577: @keyframes pulse-recording animation

## Layout Adjustments Needed

### AskScreen
- **Before:** Text input (flex: 1) + Mic button (56px)
- **After:** Text input (full width) + Send button (where mic was)
- Spacing: Maintain 8-point scale, no gaps

### SaleEntryScreen & ExpenseEntryScreen
- **Before:** Save button + Voice button (side by side)
- **After:** Save button only (full width)
- Remove entire voice input screen conditional block

### LessonCard
- **Before:** Header with 🔊 listen button
- **After:** Header without listen button
- Adjust header layout

## Copy Updates Needed

### HomeScreen
- Line with "Or tell me by voice" → Remove or change to "Type to add"
- Check if this text exists in actual component

### AskScreen
- Any placeholder text mentioning voice → Change to "Type your question"
- Suggested questions remain unchanged (already tappable)

### Entry Screens
- Any helper text mentioning voice → Remove or change to typing instructions

## Verification Checklist

After removal, verify:
- [ ] No microphone emoji (🎤) anywhere
- [ ] No speaker emoji (🔊) anywhere
- [ ] No "voice", "speak", "listen", "audio" in code or copy
- [ ] No Web Speech API usage
- [ ] No microphone permission requests
- [ ] All layouts have no gaps where voice buttons were
- [ ] Text inputs expand to full width where needed
- [ ] All buttons maintain 48px minimum touch target
- [ ] 8-point spacing scale maintained
- [ ] English and Hindi both work
- [ ] Light and dark mode both work
- [ ] System font scaling to 200% works

## Files NOT Changed (Confirmed No Voice)

These files were checked and contain no voice features:
- All onboarding screens
- All tool screens
- All insight screens
- Profile screen
- Help screen
- Privacy screen
- Alerts screen
- All data models (except conversation.ts)
- All context/state management
- Bottom navigation
- Top bar
- Number pad
- Weekly chart
- Undo bar
- Community benchmarks

## Summary

**Total Files to Modify:** 9
**Total Files to Delete:** 1 (useVoiceInput.ts)
**Total Voice Buttons to Remove:** 6
  - AskScreen: 1 mic button + 1 read-aloud button
  - LessonCard: 1 audio button
  - SaleEntryScreen: 1 mic button + entire voice flow
  - ExpenseEntryScreen: 1 mic button + entire voice flow
**Total Translation Keys to Remove:** 18 (9 English + 9 Hindi)
**Total Functions to Remove:** 4
  - useVoiceInput hook
  - parseVoiceEntry function
  - speakText function
  - stopSpeaking function

**Estimated Lines of Code Removed:** ~400 lines
**Estimated Layout Adjustments:** 4 screens
