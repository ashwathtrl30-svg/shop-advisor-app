# Phase 4: Insights & Alerts - Implementation Summary

## Overview
Implemented an intelligent insights engine that analyzes shop data and provides actionable, personalized recommendations. The system prioritizes insights by money impact, limits to 3 per day, and learns from user feedback.

## Key Features

### 1. Insight Types
- **Profit Insights**: Week-over-week comparisons, profit per ₹100 sales
- **Cost Insights**: Biggest expense categories, reduction suggestions
- **Udhaar Insights**: Overdue amounts, collection reminders
- **Stock Insights**: Low stock warnings, expiry alerts (for relevant shops)
- **Seasonal Insights**: Festival preparation, weather-based suggestions
- **Pricing Insights**: Margin analysis, competitive pricing guidance
- **Cash Safety**: Warning when expenses approach sales
- **Wins**: Celebrate good performance days

### 2. Insight Engine (`src/models/insights.ts`)
- **Data-driven**: All insights based on actual user data
- **Transparent**: Shows data source and whether it's an estimate
- **Prioritized**: Sorted by money impact (priority score)
- **Limited**: Max 3 insights per day to avoid overwhelm
- **Feedback-aware**: Learns from "Useful/Not useful" responses

### 3. Insight Card Component (`src/components/InsightCard.tsx`)
- **Clear structure**: Icon → Headline → Explanation → Action → Data source
- **Visual hierarchy**: Color-coded by insight type
- **Interactive feedback**: Users can mark insights as useful or not
- **Contextual icons**: 💰 profit, 💸 costs, 📒 udhaar, 📦 stock, etc.

### 4. Integration Points

#### Home Screen
- Shows top insight prominently below today's summary
- Automatically generates and displays most important insight
- Tracks shown insights to avoid repetition

#### Insights Screen (New Tab)
- Full list of today's insights
- Alert preferences management (toggle on/off each type)
- Settings accessible via gear icon

### 5. Data Flow
```
User Data → Insight Engine → Priority Sort → Display Top 3 → User Feedback → Learn
```

### 6. Alert Preferences
Users can toggle 8 insight categories:
- Profit 💰
- Costs 💸
- Udhaar 📒
- Stock 📦
- Season 🎉
- Pricing 🏷️
- Cash Safety ⚠️
- Wins 🎉

### 7. Feedback System
- **Useful (👍)**: Reinforces similar insights
- **Not useful (👎)**: Reduces similar insights in future
- Stored in `insightHistory.feedback`
- Influences insight generation priorities

## Technical Implementation

### State Management
Added to `AppContext`:
- `insightHistory`: Tracks shown insights and feedback
- `alertPreferences`: User's toggle preferences
- Actions: `ADD_INSIGHT`, `SET_INSIGHT_FEEDBACK`, `UPDATE_ALERT_PREFERENCES`

### Insight Generation Logic
1. Check data sufficiency (need 7+ days for trends)
2. Generate insights for enabled categories
3. Calculate priority scores based on money impact
4. Sort and return top 3
5. Mark as shown in history

### Data Transparency
Every insight includes:
- **Data source**: "From your last 14 days of sales" or "Industry estimate"
- **Estimate flag**: Clear marking if based on general data vs. user data
- **Actionable**: Specific next step, not just information

## Example Insights

### Profit Increase
```
💰 Your profit grew this week
You earned ₹15,200 profit this week, which is ₹3,200 more than last week. 
For every ₹100 in sales, you keep ₹32 as profit.

What to do: Keep tracking daily to see trends

📈 From your last 14 days of sales and expenses

[👍 Useful] [👎 Not useful]
```

### Udhaar Overdue
```
📒 3 customers haven't paid on time
You're owed ₹8,500 from 3 customers who promised to pay but haven't. 
Total pending udhaar is ₹12,000.

What to do: Send gentle reminders today

📈 From your udhaar entries

[👍 Useful] [👎 Not useful]
```

### Cash Safety Warning
```
⚠️ Expenses are close to sales
This week you spent ₹45,000 out of ₹48,000 in sales. That's 94% — 
very close to breaking even.

What to do: Check which expenses can be reduced this week

📈 From your last 7 days of sales and expenses

[👍 Useful] [👎 Not useful]
```

## Design Principles Applied

1. **Simplicity**: One insight at a time on home screen
2. **Transparency**: Always show data source
3. **Respect**: Never guess, only use actual data
4. **Actionable**: Every insight has a clear next step
5. **Learning**: Feedback system improves over time
6. **No overwhelm**: Max 3 insights per day
7. **User control**: Toggle any insight type off

## Files Modified/Created

### New Files
- `src/models/insights.ts` - Insight generation engine
- `src/components/InsightCard.tsx` - Insight display component
- `src/components/InsightsScreen.tsx` - Full insights view with settings

### Modified Files
- `src/context/AppContext.tsx` - Added insight state and actions
- `src/components/HomeScreen.tsx` - Integrated top insight display
- `src/App.tsx` - Added Insights tab to navigation

## Testing Checklist

- [ ] Insight generation with sufficient data (7+ days)
- [ ] Insight generation with insufficient data (shows "add more data" message)
- [ ] Priority sorting (highest money impact first)
- [ ] Daily limit enforcement (max 3 insights)
- [ ] Feedback collection and storage
- [ ] Alert preferences toggle
- [ ] Insight history tracking
- [ ] Data source transparency
- [ ] Estimate vs. actual data marking
- [ ] Integration with home screen
- [ ] Insights screen navigation

## Future Enhancements

1. **Stock tracking insights**: When user enables stock tracking
2. **Seasonal patterns**: More festival/weather-based suggestions
3. **Competitive analysis**: If user adds competitor data
4. **Goal tracking**: Set profit/sales goals and track progress
5. **Export insights**: Share insights via WhatsApp/SMS
6. **Voice insights**: Read insights aloud for accessibility

## Notes

- All insights are in English and Hindi
- Currency formatting uses Indian numbering (₹1,25,000)
- Insights persist across sessions via localStorage
- No external API calls - all analysis is local
- Privacy-first: No data leaves the device
