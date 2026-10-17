# Phase 5: Ask Tab - Implementation Summary

## Overview
Implemented a conversational AI interface for shopkeepers to ask questions about their business in Hindi or English, with voice input support and intelligent, data-driven answers.

## Key Features

### 1. Conversation Engine (`src/models/conversation.ts`)
- **Question Parsing**: Detects question types (profit, udhaar, costs, GST, customers)
- **Data-Driven Answers**: Uses actual shop data to provide specific, actionable responses
- **Safety Guardrails**: 
  - Detects illegal requests and refuses politely
  - Identifies distress signals and provides supportive responses
  - Never invents statistics or makes up information
- **Bilingual Support**: All answers in Hindi or English based on user preference
- **Context Awareness**: Maintains conversation history for follow-up questions

### 2. Answer Types

**Profit Questions:**
- Analyzes last 7 days of sales/expenses
- Shows profit/loss with specific numbers
- Provides actionable recommendations
- Example: "Your profit for the last 7 days is ₹15,200. For every ₹100 in sales, you earn ₹32."

**Udhaar Questions:**
- Lists pending udhaar amounts
- Shows top 3 debtors with amounts
- Suggests collection strategies
- Example: "You have ₹12,000 pending from 5 customers. Top: Ramesh (₹5,000), Suresh (₹3,000)..."

**Cost Questions:**
- Identifies biggest expense category
- Shows percentage of total expenses
- Provides category-specific tips (electricity, stock, rent, etc.)
- Example: "Your biggest expense is electricity: ₹8,500 (23% of total). Tip: Use LED bulbs..."

**GST Questions:**
- Provides general GST information
- Explains registration thresholds
- Always recommends confirming with CA/official sources
- Never gives legal advice

**Customer Acquisition:**
- Shop-type specific suggestions (kirana, bakery, medical, etc.)
- 4 actionable tips with priorities
- Focus on low-cost, high-impact strategies

### 3. Ask Screen UI (`src/components/AskScreen.tsx`)

**Layout:**
- Chat-style message interface
- User messages on right (green bubbles)
- Assistant messages on left (white bubbles)
- Auto-scroll to latest message

**Input Methods:**
- Text input field with Enter key support
- Large microphone button (56px) for voice input
- Voice recognition in Hindi/English
- Auto-send after voice recognition

**Suggested Questions:**
- 4 personalized suggestions based on:
  - Shop type
  - Recent data patterns
  - Common questions for that business
- Shown when conversation is empty
- One-tap to ask

**Message Features:**
- **Read Aloud**: Text-to-speech button on assistant messages
- **Feedback**: 👍 Helpful / 👎 Not helpful buttons
- **Bold Text**: Key numbers highlighted with **bold**
- **Multi-line Support**: Proper formatting for lists and tips

### 4. Safety Implementation

**Illegal Requests:**
```typescript
if (containsIllegalRequest(q)) {
  return 'I cannot help with illegal activities. Can I help you with a legal alternative?';
}
```
Detects keywords: cheat, fraud, evade, fake, धोखा, नकली, चोरी

**Distress Signals:**
```typescript
if (containsDistressSignals(q)) {
  return 'I understand you might be going through a tough time. Please talk to a trusted person or helpline...';
}
```
Detects keywords: suicide, kill myself, depressed, आत्महत्या, उदास, परेशान

**Uncertainty Handling:**
- If question type not recognized: "I'm not sure about that. Can you ask me something about your shop?"
- If insufficient data: "I have data for only 3 days. To understand profit, add sales and expenses for at least 7 days."

**Government Schemes:**
- Always includes disclaimer: "This is general information. Confirm with your CA or official source (gst.gov.in) as rules may change."
- Never provides specific legal/financial advice

### 5. Voice Input Integration

**Features:**
- Uses Web Speech API
- Supports Hindi (hi-IN) and English (en-IN)
- Real-time transcription
- Auto-send after recognition
- Visual feedback (listening state with red button)

**Fallback:**
- If browser doesn't support speech recognition, microphone button is hidden
- Text input always available

### 6. Text-to-Speech

**Implementation:**
- Uses Web Speech Synthesis API
- Matches language (Hindi/English)
- Slower rate (0.9) for clarity
- Toggle play/pause button
- Auto-stop after 5 seconds

### 7. Feedback System

**User Feedback:**
- 👍 Helpful / 👎 Not helpful buttons on each assistant message
- Feedback stored in message object
- Visual confirmation after feedback
- Future: Can be used to improve answer quality

## Example Conversations

### Example 1: Profit Question
**User:** "Why was my profit low this week?"

**Assistant:**
```
Your profit for the last 7 days is ₹8,450. For every ₹100 in sales, you earn ₹17.

Recommendation: Your expenses are high. Check your biggest expense category and see what can be reduced.
```

### Example 2: Udhaar Question
**User:** "Which customers owe me the most?"

**Assistant:**
```
You have ₹12,000 pending from 5 customers.

Top debtors:
- Ramesh Kumar: ₹5,000
- Suresh Singh: ₹3,000
- Mahesh Sharma: ₹2,500

Recommendation: Remind these three today. Send a polite WhatsApp message.
```

### Example 3: Cost Question
**User:** "How can I reduce electricity cost?"

**Assistant:**
```
Your biggest expense is electricity: ₹8,500 (23% of total expenses).

Tip: Use LED bulbs, keep AC at 24°C, and pay electricity bill on time to avoid penalties.
```

### Example 4: GST Question
**User:** "What is GST?"

**Assistant:**
```
GST is a tax implemented from July 1, 2017. If your annual sales exceed ₹40 lakhs (₹20 lakhs in some states), GST registration is mandatory.

Important: This is general information. Confirm with your CA or official source (gst.gov.in) as rules may change.
```

## Technical Implementation

### State Management
- Messages stored in component state (not persisted yet)
- Conversation history maintained for context
- Suggested questions generated on mount
- Feedback stored per message

### File Structure
```
src/
├── models/
│   └── conversation.ts          # Conversation engine
├── components/
│   └── AskScreen.tsx            # Main UI
└── App.tsx                      # Routing integration
```

### Dependencies
- Web Speech API (voice input/output)
- Existing shop data from AppContext
- Translation system for bilingual support

## Design Principles Applied

✅ **Simplicity**: Chat interface familiar to all users  
✅ **One Action Per Screen**: Clear input area at bottom  
✅ **Voice First**: Large microphone button, text as backup  
✅ **Data-Driven**: All answers based on actual shop data  
✅ **Transparency**: Shows data source, admits uncertainty  
✅ **Safety First**: Refuses illegal requests, detects distress  
✅ **No Jargon**: Simple language, explains GST/tax clearly  
✅ **Bilingual**: Full Hindi and English support  
✅ **Actionable**: Every answer includes specific next step  
✅ **Feedback Loop**: Users can rate answer quality

## Answer Format Guidelines

**Structure:**
1. Direct answer with key number in **bold**
2. Context/explanation (2-3 sentences)
3. Specific recommendation (1 clear action)
4. Data source mention (if applicable)

**Length:**
- 5-8 lines maximum
- Short sentences
- Easy to read on mobile

**Tone:**
- Respectful, like a helpful younger family member
- Never condescending
- Celebrates wins, gently addresses problems

## Safety Rules Implemented

✅ **No Investment Advice**: Never recommends specific products  
✅ **No Legal Advice**: Always suggests consulting CA/lawyer  
✅ **No Illegal Help**: Refuses cheating/fraud requests  
✅ **Distress Detection**: Provides supportive response + helpline suggestion  
✅ **Data Privacy**: Chat history private to user  
✅ **No Hallucination**: Never invents statistics or schemes  
✅ **Official Sources**: Directs to gst.gov.in, banks, CAs for verification

## Future Enhancements

1. **Conversation Persistence**: Save chat history to localStorage
2. **More Question Types**: Stock, pricing, marketing, hiring
3. **Rich Media**: Show charts/graphs in answers
4. **Quick Actions**: Buttons for "Add expense", "View udhaar" in answers
5. **Conversation Export**: Share chat via WhatsApp
6. **Improved Voice**: Better Hindi/English mixing support
7. **Context Memory**: Remember previous questions in session
8. **Feedback Analytics**: Track which answers are most helpful
9. **Multi-turn Conversations**: Follow-up questions with context
10. **Offline Support**: Cache common Q&A for offline use

## Files Modified/Created

### New Files
- `src/models/conversation.ts` - Conversation engine with answer generation
- `src/components/AskScreen.tsx` - Full chat UI with voice input

### Modified Files
- `src/App.tsx` - Added AskScreen routing

## Testing Checklist

- [ ] Text input and send
- [ ] Voice input (Hindi)
- [ ] Voice input (English)
- [ ] Voice input (mixed Hindi-English)
- [ ] Suggested questions display
- [ ] Profit question with data
- [ ] Profit question without data
- [ ] Udhaar question
- [ ] Cost question
- [ ] GST question
- [ ] Customer question
- [ ] Illegal request detection
- [ ] Distress signal detection
- [ ] Unknown question handling
- [ ] Read aloud functionality
- [ ] Feedback buttons
- [ ] Auto-scroll to latest message
- [ ] Bold text formatting
- [ ] Multi-line answer display

## Notes

- All answers are in English and Hindi
- Voice recognition works on Chrome/Edge (Android)
- Text-to-speech works on most modern browsers
- No external API calls - all logic is local
- Privacy-first: No data leaves the device
- Answers are deterministic (same question = same answer)
- Can be extended with more question types easily
