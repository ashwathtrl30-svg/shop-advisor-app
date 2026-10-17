# Phase D: Daily Lessons System - Sample Lessons & Selection Plan

## ✅ What Was Built

### 1. Lesson Library Structure (`src/models/lessons.ts`)

**Lesson Interface:**
```typescript
{
  id: string;                    // Unique ID (lesson-001, lesson-002, etc.)
  batch: number;                 // Batch number (1-6 for 300 lessons)
  topic: string;                 // Topic category
  title: string;                 // Short, plain title
  content: string;               // 3-5 sentences
  example: string;               // Real shop example with ₹
  action: string;                // "Try this today" action
  toolLink?: string;             // Link to matching tool/screen
  personalization?: function;    // Function to generate personalized line
}
```

**Daily Selection Interface:**
```typescript
{
  date: string;                  // YYYY-MM-DD
  lessons: Lesson[];             // 10 lessons for today
  startHere: string[];           // IDs of 3 "Start here" lessons
  completed: string[];           // IDs of completed lessons today
}
```

**Progress Interface:**
```typescript
{
  totalLessons: number;          // Total lessons in library
  lessonsShown: string[];        // All lesson IDs shown so far
  lessonsCompleted: string[];    // All lesson IDs completed
  dailySelections: DailyLessonSelection[];  // History of daily selections
  currentStreak: number;         // Days in a row with at least 1 lesson completed
  longestStreak: number;         // Longest streak ever
}
```

---

## 📚 5 Sample Lessons from First Batch (Batch 1)

### Lesson 1: Sales are not profit
**ID:** lesson-001  
**Topic:** profit-vs-sales  
**Batch:** 1

**Title:** Sales are not profit

**Content:**
Many shopkeepers see big sales numbers and feel rich. But sales is just money coming in. Profit is what stays after you pay for everything. A shop can do ₹1 lakh in sales but only keep ₹15,000 as profit. That is the real number that matters.

**Example:**
Ramesh's kirana did ₹85,000 in sales last month. After paying ₹60,000 for stock, ₹8,000 rent, and ₹5,000 for electricity, he had ₹12,000 left. That is his real profit, not ₹85,000.

**Action:**
Today, write down your total sales and total expenses. Subtract to see your real profit.

**Tool Link:** /tools/profit-calculator

**Personalized Line:**
"Your profit margin this month is 22.3%. For every ₹100 in sales, you keep ₹22."

---

### Lesson 2: Keep shop money separate from home money
**ID:** lesson-002  
**Topic:** money-separation  
**Batch:** 1

**Title:** Keep shop money separate from home money

**Content:**
When shop money and home money mix, you never know if you are making profit or losing money. Take a fixed salary from your shop every month. Put it in your personal account. Leave the rest in the shop account. This shows you the truth about your business.

**Example:**
Sunita used to take money from the till whenever she needed. She never knew if the shop was growing. She started paying herself ₹15,000 per month. Now she sees the shop made ₹22,000 profit last month after her salary.

**Action:**
Decide your monthly salary today. Transfer that amount to your personal account. Leave the rest for the shop.

**Personalized Line:**
"Your shop made ₹65,000 profit this month. Consider taking ₹39,000 as your salary."

---

### Lesson 3: Pay yourself a fixed salary every month
**ID:** lesson-003  
**Topic:** owner-salary  
**Batch:** 1

**Title:** Pay yourself a fixed salary every month

**Content:**
Your time has value. If you work 10 hours daily in your shop, that is work worth paying for. Set a fixed salary for yourself, just like you pay your staff. This helps you see if the shop can really support you. If it cannot, you need to grow sales or cut costs.

**Example:**
Mohan paid himself whatever was left at month end. Some months ₹30,000, some months ₹5,000. He changed to fixed ₹20,000 salary. Now he plans better and knows the shop must make at least ₹50,000 profit to pay everyone including himself.

**Action:**
Write down what you want to earn monthly. That is your salary. Make sure your shop profit covers it.

**Tool Link:** /tools/monthly-cost-planner

---

### Lesson 4: Never run out of cash in the shop
**ID:** lesson-004  
**Topic:** cash-management  
**Batch:** 1

**Title:** Never run out of cash in the shop

**Content:**
Cash is the life of your shop. If you run out, you cannot give change, cannot buy urgent stock, cannot handle emergencies. Always keep enough cash for 3 days of normal business. Check your cash every evening. If it is low, plan how to get more tomorrow.

**Example:**
Priya's medical store ran out of cash on a busy day. She could not give change to a customer buying ₹2,000 worth of medicines. The customer left and went to another shop. She lost the sale and the customer. Now she keeps ₹25,000 cash always.

**Action:**
Count your cash today. Is it enough for 3 days of business? If not, plan how to build it up.

**Tool Link:** /tools/break-even

**Personalized Line:**
"You have ₹15,000 cash now. That is 1.8 days of break-even sales."

---

### Lesson 5: Build an emergency fund for your shop
**ID:** lesson-005  
**Topic:** emergency-fund  
**Batch:** 1

**Title:** Build an emergency fund for your shop

**Content:**
Shops face unexpected problems: refrigerator breaks, roof leaks, supplier demands advance payment, customer takes big udhaar and does not return. An emergency fund protects you from these shocks. Save 1 month of expenses in a separate account. Touch it only for real emergencies.

**Example:**
When Arun's deep freezer broke during summer, he needed ₹35,000 for repair. He had emergency fund ready. He fixed it same day. His ice cream stock was safe. Other shops without fund had to take loan at 24% interest.

**Action:**
Calculate your 1 month expenses. Start saving that amount in a separate account. Add to it every month.

**Tool Link:** /tools/savings-goal

**Personalized Line:**
"Your last month expenses were ₹1,80,000. That is your emergency fund target."

---

## 📅 Day-by-Day Selection Plan

### How Daily Selection Works

**Step 1: Filter Available Lessons**
- Get all lessons not yet shown to user
- If all lessons shown, reset (start over from beginning)

**Step 2: Sort by Relevance**
Each lesson gets a relevance score based on:
- **Shop type match** (+10 points)
  - Kirana: stock, suppliers, dead-stock topics
  - Medical: expiry, regulations topics
  - Bakery: fresh items, festival topics
- **Current challenges** (+15-20 points)
  - High udhaar → udhaar lessons
  - Negative profit → profit lessons
- **Shop experience** (+10 points for beginners)
  - Under 1 year → fundamental lessons

**Step 3: Select 10 Lessons with Variety**
- Maximum 2 lessons from same topic per day
- Ensure coverage of different areas
- Prioritize by relevance score

**Step 4: Mark 3 as "Start Here"**
- Top 3 most relevant lessons
- Highlighted with saffron border
- Shown first in the list

**Step 5: Save Selection**
- Save to state and localStorage
- Same lessons shown all day
- New selection tomorrow

---

### Sample Day 1: Kirana Store (New Shopkeeper, High Udhaar)

**Shop Profile:**
- Type: Kirana
- Duration: Under 1 year
- Udhaar pending: ₹28,000 (high)
- Profit: Positive but low margin

**Today's 10 Lessons (Ranked by Relevance):**

**"Start Here" (Top 3):**
1. **lesson-008** - How to say no to bad udhaar requests (Score: 35)
   - Personalized: "Your udhaar is ₹28,000, which is 11% of last month's sales."
   
2. **lesson-001** - Sales are not profit (Score: 30)
   - Personalized: "Your profit margin this month is 18.5%."
   
3. **lesson-004** - Never run out of cash in the shop (Score: 25)
   - Personalized: "You have ₹15,000 cash now. That is 1.8 days of break-even sales."

**Remaining 7:**
4. **lesson-002** - Keep shop money separate from home money (Score: 20)
5. **lesson-003** - Pay yourself a fixed salary every month (Score: 20)
6. **lesson-011** - Dead stock is cash stuck on shelves (Score: 15)
7. **lesson-012** - Negotiate with suppliers like a pro (Score: 15)
8. **lesson-013** - One loyal customer is worth ten new ones (Score: 10)
9. **lesson-018** - Build trust with your staff (Score: 10)
10. **lesson-020** - Plan for slow months in advance (Score: 10)

**Topics Covered:** udhaar, profit, cash, money separation, salary, dead stock, suppliers, customers, staff, planning

**Variety Check:** ✅ No topic repeated more than 2 times

---

### Sample Day 2: Medical Store (Experienced, Good Profit)

**Shop Profile:**
- Type: Medical
- Duration: 5-10 years
- Profit: Good (25% margin)
- Udhaar: Low

**Today's 10 Lessons:**

**"Start Here" (Top 3):**
1. **lesson-005** - Build an emergency fund for your shop (Score: 30)
   - Personalized: "Your last month expenses were ₹1,20,000. That is your emergency fund target."
   
2. **lesson-007** - How small savings grow over years (Score: 25)
   
3. **lesson-006** - How to judge if a loan is good or bad (Score: 25)

**Remaining 7:**
4. **lesson-009** - Price with confidence, not fear (Score: 20)
5. **lesson-010** - Know the margin on every item you sell (Score: 20)
6. **lesson-014** - Word of mouth is your best marketing (Score: 15)
7. **lesson-015** - Do a few things better than everyone else (Score: 15)
8. **lesson-016** - Stay inside what you understand (Score: 10)
9. **lesson-017** - Avoid fashionable trends and risky shortcuts (Score: 10)
10. **lesson-019** - Learn to hand work to others (Score: 10)

**Topics Covered:** emergency fund, savings, loans, pricing, margins, marketing, excellence, focus, trends, delegation

---

### Sample Day 3: Bakery (Festival Season)

**Shop Profile:**
- Type: Bakery
- Duration: 1-5 years
- Season: Festival approaching (Diwali in 1 month)
- Sales: Increasing

**Today's 10 Lessons:**

**"Start Here" (Top 3):**
1. **lesson-020** - Plan for slow months in advance (Score: 35)
   - Festival relevance boost
   
2. **lesson-010** - Know the margin on every item you sell (Score: 30)
   - Bakery relevance boost
   
3. **lesson-013** - One loyal customer is worth ten new ones (Score: 25)

**Remaining 7:**
4. **lesson-001** - Sales are not profit (Score: 20)
5. **lesson-004** - Never run out of cash in the shop (Score: 20)
6. **lesson-011** - Dead stock is cash stuck on shelves (Score: 15)
7. **lesson-014** - Word of mouth is your best marketing (Score: 15)
8. **lesson-015** - Do a few things better than everyone else (Score: 10)
9. **lesson-018** - Build trust with your staff (Score: 10)
10. **lesson-019** - Learn to hand work to others (Score: 10)

**Topics Covered:** planning, margins, customers, profit, cash, dead stock, marketing, excellence, staff, delegation

---

## 🔄 Lesson Rotation Strategy

### 30-Day Plan (First 300 Lessons)

**Week 1 (Days 1-7): Fundamentals**
- Focus: Profit, cash, money separation, salary
- Lessons: 001-070 (70 lessons)
- Topics: profit-vs-sales, money-separation, owner-salary, cash-management, emergency-fund, loans, savings

**Week 2 (Days 8-14): Operations**
- Focus: Udhaar, pricing, margins, stock, suppliers
- Lessons: 071-140 (70 lessons)
- Topics: udhaar, pricing, margins, dead-stock, suppliers, negotiation

**Week 3 (Days 15-21): Growth**
- Focus: Customers, marketing, excellence, focus
- Lessons: 141-210 (70 lessons)
- Topics: customers, reviews, excellence, focus, trends, staff, delegation

**Week 4 (Days 22-28): Strategy**
- Focus: Planning, festivals, insurance, records, targets
- Lessons: 211-280 (70 lessons)
- Topics: planning, festivals, insurance, records, numbers, targets

**Week 5+ (Days 29+): Advanced**
- Focus: Risk, growth, long-term, patience, honesty, expansion
- Lessons: 281-300+ (20+ lessons)
- Topics: risk, growth, long-term, patience, honesty, expansion

### No Repetition Rule
- Each lesson shown only once until all 300 shown
- After 300 lessons, library resets and starts over
- User sees 10 new lessons every day for 30 days

---

## 🎯 Key Features Implemented

### ✅ 10 Lessons Per Day
- Fresh lessons every day
- Never repeat until all shown
- Varied topics (max 2 from same topic)

### ✅ "Start Here" Marking
- Top 3 most relevant lessons
- Highlighted with saffron border
- Shown first in the list

### ✅ Progress Tracking
- "X of 10 done today" counter
- Total progress (completed/total)
- Streak counter (days in a row)
- No guilt for skipped days

### ✅ Personalized Lines
- Uses exact-numbers engine
- Shows user's actual data
- Makes lessons relevant and actionable

### ✅ Tool Integration
- "Do it in my shop" button
- Links to matching tool/screen
- Encourages immediate action

### ✅ Past Days Viewing
- View lessons from previous days
- See what was completed
- No pressure to complete same day

### ✅ Bilingual Support
- All lessons in English and Hindi
- Simple, everyday words
- No jargon or complex terms

---

## 📁 Files Created/Modified

### New Files:
1. **`src/models/lessons.ts`** (400+ lines)
   - Lesson library (first 20 lessons shown)
   - Daily selection logic
   - Relevance scoring
   - Personalization functions
   - Progress tracking

2. **`src/components/learn/DailyLessonCard.tsx`** (180+ lines)
   - Expandable lesson card
   - "Start here" badge
   - Personalized line display
   - "Do it in my shop" button
   - Completion tracking

### Modified Files:
1. **`src/components/learn/LearnScreen.tsx`**
   - Integrated daily lesson system
   - Shows 10 lessons per day
   - "X of 10 done today" counter
   - Past days selector
   - "See all 10" button

2. **`src/context/AppContext.tsx`**
   - Updated LessonProgress structure
   - Added UPDATE_LESSON_PROGRESS action
   - Integrated with storage service

---

## ✅ Build Status

✅ Build successful (373.86 kB JS, 18.95 kB CSS)  
✅ No TypeScript errors  
✅ Daily selection working  
✅ Personalization working  
✅ Progress tracking working  
✅ Past days viewing working

---

## 🚀 Ready for Next Batch

**First batch complete:** 20 lessons created (showing pattern)  
**Total needed:** 300 lessons for 30 days  
**Next step:** User says "next batch" to build lessons 21-50

**Lesson topics covered in first batch:**
1. profit-vs-sales
2. money-separation
3. owner-salary
4. cash-management
5. emergency-fund
6. loans
7. savings
8. udhaar
9. pricing
10. margins
11. dead-stock
12. suppliers
13. customers
14. reviews
15. excellence
16. focus
17. trends
18. staff
19. delegation
20. planning

**Topics for next batches:**
- Festival planning
- Insurance
- Records
- Reading numbers
- Setting targets
- Risk protection
- Slow growth
- Long-term thinking
- Patience
- Honesty and reputation
- When to expand

---

**Status:** ✅ Phase D Core System Complete - First Batch Sample Ready

Waiting for "next batch" command to build lessons 21-50.
