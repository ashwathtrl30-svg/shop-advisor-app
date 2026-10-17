# DukaanDost - Data Storage Verification

## Where is the data stored?

**Location:** Browser localStorage (on the user's device)
**Key:** `dukaandost-app-state`
**Format:** JSON file with version number and timestamp

**What this means:**
- Data is stored locally on the phone/browser
- No data is sent to any server
- Data stays on the device until explicitly deleted
- Each browser has its own localStorage (Chrome, Firefox, Safari are separate)

---

## What can make data disappear?

### 1. User Actions (Intentional)
✅ **"Delete All Data" button in Profile**
   - Requires two-step confirmation
   - Completely wipes all saved data
   - App returns to initial state

✅ **Clearing browser data/cache**
   - User clears browser data manually
   - "Clear browsing data" in browser settings
   - Deletes all localStorage for the site

✅ **Using private/incognito window**
   - Data is NOT saved in private mode
   - Data disappears when window is closed
   - This is expected browser behavior

### 2. Browser/Device Actions
⚠️ **Browser storage quota exceeded**
   - localStorage has a limit (typically 5-10 MB)
   - If full, new data cannot be saved
   - App shows warning: "Storage is full. Your data may not be saved."
   - App remains usable, but new changes may be lost

⚠️ **Storage blocked by browser settings**
   - Some browsers allow blocking localStorage
   - App shows warning: "Storage is blocked on this device."
   - App remains usable, but data is not saved

⚠️ **Browser data cleared by system**
   - Some phones auto-clear browser data to save space
   - Android "Smart Storage" or similar features
   - iOS "Offload Unused Apps" may affect web apps
   - Data is lost without warning

⚠️ **Uninstalling the app/website**
   - Removing the PWA or clearing site data
   - All localStorage is deleted
   - Data is permanently lost

### 3. Device Changes
❌ **Changing phones**
   - Data stays on the old phone
   - Does NOT transfer to new phone automatically
   - User must export data and import on new phone

❌ **Factory reset**
   - All data on device is erased
   - localStorage is cleared
   - Data is permanently lost

❌ **Switching browsers**
   - Chrome data is separate from Firefox/Safari
   - Data does not transfer between browsers
   - Each browser has its own localStorage

### 4. Technical Issues (Rare)
⚠️ **localStorage corruption**
   - Very rare, but possible
   - Can happen due to browser bugs
   - Data may become unreadable
   - App will start fresh (data lost)

⚠️ **Browser bugs**
   - Extremely rare
   - Could cause data loss
   - Usually affects all websites, not just this app

---

## What is needed for data to follow the user to a new phone?

### Current State: NOT POSSIBLE
❌ Data does NOT automatically transfer to new phone
❌ No cloud sync
❌ No account system
❌ No backup to cloud storage

### Manual Transfer (Available Now)
✅ **Export data on old phone**
   - Go to Profile → Data → Export Data
   - Saves JSON file with all data
   - File includes: sales, expenses, udhaar, lessons, preferences

✅ **Transfer file to new phone**
   - Email the file to yourself
   - Upload to Google Drive/Dropbox
   - Use USB cable or Bluetooth
   - Any file transfer method works

✅ **Import data on new phone**
   - Go to Profile → Data → Import Data
   - Select the JSON file
   - All data is restored
   - App continues from where you left off

### Future: Automatic Cloud Sync (Not Yet Implemented)
To make data follow the user automatically, we would need:

1. **User Authentication**
   - Phone number + OTP login
   - User account created in cloud database
   - Each user has unique ID

2. **Cloud Database**
   - Firebase, Supabase, or similar
   - Stores user data securely
   - Encrypted for privacy

3. **Sync Service**
   - Upload data after every change
   - Download data on app start
   - Handle conflicts if data changed on multiple devices

4. **Conflict Resolution**
   - If user edits on two phones simultaneously
   - Need rules for which data wins
   - Typically: most recent change wins

**Good news:** The app is already structured to support this!
- Storage logic is centralized in one file (`src/services/storage.ts`)
- Can swap localStorage for cloud sync without changing any screens
- Just need to add backend and authentication

---

## How to verify data is saved correctly?

### Test 1: Add data and refresh
1. Add 3 sales entries
2. Add 2 expense entries
3. Add 1 udhaar entry
4. Complete 2 lessons
5. **Refresh the page (F5 or pull-to-refresh)**
6. ✅ All data should still be there

### Test 2: Close and reopen app
1. Add some data
2. **Close the browser tab completely**
3. **Reopen the app**
4. ✅ All data should still be there

### Test 3: Change settings
1. Change language to Hindi
2. Enable dark mode
3. **Refresh the page**
4. ✅ Language should still be Hindi
5. ✅ Dark mode should still be on

### Test 4: Export and import
1. Add some data
2. Go to Profile → Export Data
3. Save the JSON file
4. Go to Profile → Delete All Data
5. ✅ App should be empty (back to onboarding)
6. Go to Profile → Import Data
7. Select the JSON file
8. ✅ All data should be restored

---

## Privacy & Security

### Where does the data go?
✅ **Nowhere.** All data stays on the user's device.
✅ No data is sent to any server.
✅ No analytics or tracking.
✅ No third-party access.

### Who can see the data?
✅ **Only the user** (on their device)
✅ If someone borrows the phone, they can see the data
✅ Use PIN lock to prevent this (available in Profile)

### Can other apps access the data?
❌ **No.** localStorage is isolated per website.
❌ Other apps/websites cannot read this data.
❌ Only this app (on this domain) can access it.

### Is the data encrypted?
⚠️ **No.** localStorage is plain text.
⚠️ If someone has physical access to the phone, they could read it.
⚠️ Use PIN lock to protect the app.
⚠️ For cloud sync (future), data would be encrypted.

---

## Recommendations for Users

### To prevent data loss:
1. ✅ **Export data regularly** (Profile → Export Data)
2. ✅ **Save backup file** in safe place (email, cloud storage)
3. ✅ **Don't clear browser data** unless you have a backup
4. ✅ **Use PIN lock** if sharing phone with others
5. ✅ **Bookmark the app** for easy access

### Before changing phones:
1. ✅ **Export data** on old phone
2. ✅ **Transfer file** to new phone
3. ✅ **Import data** on new phone
4. ✅ **Verify** all data is present

### If data disappears unexpectedly:
1. ⚠️ Check if browser data was cleared
2. ⚠️ Check if using private/incognito mode
3. ⚠️ Check if storage is blocked in browser settings
4. ⚠️ Import from backup file if available
5. ⚠️ Contact support if issue persists

---

## Summary

**Current State:**
✅ All data saved locally on device
✅ Data persists across refreshes and app restarts
✅ Export/Import available for backup/restore
❌ Data does NOT transfer to new phone automatically
❌ No cloud sync (yet)

**To transfer to new phone:**
1. Export data on old phone
2. Transfer JSON file
3. Import data on new phone

**To add cloud sync in future:**
- Add user authentication
- Add cloud database
- Add sync service
- No screen changes needed (storage is centralized)

**Data safety:**
- Stored locally (private)
- No server access
- User controls everything
- Can export/delete anytime
