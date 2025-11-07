# Testing Guide - ImpactCV Upgrades

## 🧪 Quick Testing Steps

### Prerequisites
1. Ensure PostgreSQL database is running
2. Backend server is running on port 5000
3. Frontend dev server is running on port 5173

### Start Servers

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## ✅ Test 1: Backend API Saving

### Steps:
1. Open a resume in the editor
2. Open browser DevTools (F12) → Console tab
3. Edit any text field (e.g., change your name)
4. Wait 1 second
5. Check console for: `"Resume auto-saved successfully"`

### Expected Result:
- ✅ Console shows success message
- ✅ No errors in console
- ✅ Network tab shows PUT request to `/api/resumes/:id`

### Troubleshooting:
- **Error 404:** Check resume ID is valid
- **Error 500:** Check database connection
- **No request:** Check ResumeContext is wrapping component

---

## ✅ Test 2: Data Persistence on Refresh

### Steps:
1. Make several changes:
   - Edit name in header
   - Change a company name
   - Add an achievement
   - Change font family
   - Change text color
2. Wait 1 second for autosave
3. Press F5 to refresh the page
4. Wait for page to load

### Expected Result:
- ✅ All text changes preserved
- ✅ Font family still applied
- ✅ Text color still applied
- ✅ No data loss

### Troubleshooting:
- **Data lost:** Check database has the resume
- **Styles lost:** Check `customStyles` in database
- **Old data shown:** Clear browser cache

---

## ✅ Test 3: Global Style Panel

### Steps:
1. Open sidebar
2. Scroll to "Global Styles" section
3. Test each control:

**Font Family:**
- Change to "Playfair Display"
- ✅ All text updates instantly
- ✅ Preview shows new font

**Font Size:**
- Move slider to 16px
- ✅ Text size increases
- ✅ Change is immediate

**Text Color:**
- Click color swatch
- Pick a new color (e.g., dark blue)
- ✅ All body text changes color
- ✅ Preview updates instantly

**Heading Color:**
- Enter hex value: `#e11d48`
- ✅ Name and section headings change
- ✅ Color applies immediately

**Background Color:**
- Enter hex value: `#f8fafc`
- ✅ Resume background changes
- ✅ Update is instant

**Reset Button:**
- Click reset icon
- ✅ All styles return to defaults
- ✅ Font: Inter, Size: 14px, Colors: default

### Expected Result:
- ✅ All controls work
- ✅ Changes are instant
- ✅ No page refresh needed
- ✅ Autosave triggers after 800ms

---

## ✅ Test 4: Inline Editing in Experience Section

### Steps:
1. Go to Experience section in sidebar
2. Click "Add Experience"
3. Fill in:
   - Role: "Senior Developer"
   - Company: "Tech Corp"
   - Start Date: "2020-01"
   - End Date: "2023-12"
4. Add achievement: "Led team of 5 developers"
5. Check preview panel
6. Click on "Senior Developer" in preview
7. Edit directly to "Lead Developer"
8. Press Enter

### Expected Result:
- ✅ Sidebar form works
- ✅ Preview shows changes
- ✅ Inline editing works in preview
- ✅ Both methods update the same data
- ✅ Autosave triggers
- ✅ Changes persist on refresh

---

## ✅ Test 5: Color Picker Functionality

### Steps:
1. Open "Global Styles" section
2. Click the text color swatch (colored square)
3. Color picker popup appears
4. Drag around the color picker
5. Click a color
6. Type hex value: `#10b981`
7. Close picker

### Expected Result:
- ✅ Picker opens on click
- ✅ Visual picker works
- ✅ Hex input accepts values
- ✅ Color updates in real-time
- ✅ Picker closes properly
- ✅ Changes persist

---

## ✅ Test 6: Multiple Resume Independence

### Steps:
1. Open Resume A
2. Change font to "Roboto"
3. Change text color to blue
4. Go back to dashboard
5. Open Resume B
6. Check font and color

### Expected Result:
- ✅ Resume B has its own styles
- ✅ Resume A changes don't affect Resume B
- ✅ Each resume independent
- ✅ Switching between resumes works

---

## ✅ Test 7: Error Handling (Offline Mode)

### Steps:
1. Open a resume
2. Stop the backend server (Ctrl+C in server terminal)
3. Make a change (edit name)
4. Wait 1 second
5. Check console

### Expected Result:
- ✅ Console shows error message
- ✅ Fallback to localStorage
- ✅ Data still saved locally
- ✅ No app crash
- ✅ User can continue editing

### Recovery:
1. Restart backend server
2. Make another change
3. ✅ Saves to database again

---

## ✅ Test 8: Undo/Redo with Autosave

### Steps:
1. Make a change (edit name)
2. Wait for autosave (800ms)
3. Make another change (edit role)
4. Click Undo button (or Ctrl+Z)
5. Click Redo button (or Ctrl+Y)

### Expected Result:
- ✅ Undo reverts to previous state
- ✅ Redo restores change
- ✅ Autosave still works
- ✅ History maintained
- ✅ Both versions saved to database

---

## ✅ Test 9: Rich Text in Achievements

### Steps:
1. Go to Experience section
2. Add new achievement
3. Use rich text editor:
   - Bold some text
   - Add bullet points
   - Format text
4. Save achievement
5. Check preview

### Expected Result:
- ✅ Rich text editor works
- ✅ Formatting preserved
- ✅ Preview shows formatting
- ✅ HTML saved correctly
- ✅ Formatting persists on refresh

---

## ✅ Test 10: Loading State

### Steps:
1. Clear browser cache
2. Navigate to a resume URL directly
3. Watch page load

### Expected Result:
- ✅ Loading spinner appears
- ✅ "Loading resume..." message shown
- ✅ Data loads from API
- ✅ Resume renders with all customizations
- ✅ No flash of unstyled content

---

## 🐛 Common Issues & Solutions

### Issue: Changes not saving
**Solution:**
- Check backend is running
- Check console for errors
- Verify resume ID is correct
- Check database connection

### Issue: Styles not applying
**Solution:**
- Check `customStyles` exists in data
- Verify CSS variables in DevTools
- Clear browser cache
- Check ResumeContext is wrapping component

### Issue: Color picker not opening
**Solution:**
- Check `react-colorful` is installed
- Verify Popover component works
- Check z-index conflicts
- Try clicking swatch again

### Issue: Autosave too frequent
**Solution:**
- Increase debounce time in ResumeContext
- Currently set to 800ms
- Can increase to 1000ms or more

### Issue: Data not loading on refresh
**Solution:**
- Check GET `/api/resumes/:id` endpoint
- Verify JSON parsing in backend
- Check resume exists in database
- Look for errors in console

---

## 📊 Performance Checks

### Autosave Performance
- ✅ Debounce prevents excessive saves
- ✅ Only saves after user stops typing
- ✅ No lag during typing
- ✅ Network requests minimized

### Style Update Performance
- ✅ CSS variables update instantly
- ✅ No re-render lag
- ✅ Smooth color transitions
- ✅ No flickering

### Loading Performance
- ✅ Resume loads in < 1 second
- ✅ API response time acceptable
- ✅ No blocking operations
- ✅ Smooth user experience

---

## ✅ Final Verification Checklist

Before considering testing complete, verify:

- [ ] Backend API endpoints working
- [ ] Autosave triggers after edits
- [ ] Data persists on refresh
- [ ] Global styles apply instantly
- [ ] Color picker functional
- [ ] Font family changes work
- [ ] Experience section fully editable
- [ ] Inline editing works in preview
- [ ] Undo/redo functional
- [ ] Error handling works (offline mode)
- [ ] Multiple resumes independent
- [ ] Loading states display correctly
- [ ] No console errors
- [ ] Database updates correctly
- [ ] LocalStorage fallback works

---

## 🎯 Success Criteria

All tests pass if:
1. ✅ Changes auto-save to backend
2. ✅ Styles persist across refresh
3. ✅ Color picker works smoothly
4. ✅ No data loss occurs
5. ✅ Performance is acceptable
6. ✅ Error handling is graceful
7. ✅ User experience is smooth

---

## 📞 Support

If issues persist:
1. Check `UPGRADE_SUMMARY.md` for implementation details
2. Review console errors carefully
3. Verify database schema matches expectations
4. Check all dependencies installed (`npm install`)
5. Ensure ports 5000 and 5173 are available

---

**Happy Testing! 🚀**
