# 🔵 Blue Color Schema - Bulk Replacement Guide

## New Primary Color: LSPU Blue (Fisheries Theme)

### Color Mapping
```
TEAL (Old) → BLUE (New)
----------------------------
teal-600 → #1976D2  (Primary Blue)
teal-700 → #1565C0  (Dark Blue)  
teal-50  → #E3F2FD  (Very Light Blue)
teal-100 → #BBDEFB  (Light Blue)
teal-200 → #90CAF9  (Light Blue Border)
teal-300 → #64B5F6  (Medium Blue)
teal-400 → #42A5F5  (Light Blue Border)
```

## Find & Replace Commands

### Use in your code editor (Ctrl+H or Cmd+H):

```
Find: bg-teal-600
Replace: bg-[#1976D2]

Find: hover:bg-teal-700
Replace: hover:bg-[#1565C0]

Find: bg-teal-700
Replace: bg-[#1565C0]

Find: text-teal-600
Replace: text-[#1976D2]

Find: text-teal-700
Replace: text-[#1565C0]

Find: hover:text-teal-700
Replace: hover:text-[#1565C0]

Find: bg-teal-50
Replace: bg-[#E3F2FD]

Find: hover:bg-teal-50
Replace: hover:bg-[#E3F2FD]

Find: bg-teal-100
Replace: bg-[#BBDEFB]

Find: border-teal-200
Replace: border-[#90CAF9]

Find: border-teal-300
Replace: border-[#64B5F6]

Find: hover:border-teal-300
Replace: hover:border-[#64B5F6]

Find: border-teal-400
Replace: border-[#42A5F5]

Find: border-teal-600
Replace: border-[#1976D2]
```

## Files to Update (Apply all replacements to each):
1. ✅ `/components/AdminDashboard.tsx` (Partially done)
2. ⏳ `/components/AdminDashboard.tsx` (Complete remaining)
3. ⏳ `/components/EvaluationForm.tsx`
4. ⏳ `/components/PrintableEvaluationView.tsx`
5. ⏳ `/components/ApplicantDashboard.tsx`
6. ⏳ `/components/SuperadminDashboard.tsx`
7. ⏳ `/components/LandingPage.tsx`
8. ⏳ `/components/Navbar.tsx`
9. ⏳ `/components/AuthForm.tsx`
10. ⏳ All other component files

## Quick Method:
1. Open Find & Replace in your editor
2. Enable "Search in all files" or "Replace in files"
3. Set file pattern to: `*.tsx`
4. Run each replacement above
5. Review changes before saving

## LSPU Blue Color System

### Primary Colors (Blue - Fisheries/Water)
- `#1976D2` - Main brand (buttons, headers, active states)
- `#1565C0` - Dark blue (hover states)
- `#0D47A1` - Darker blue (text on light backgrounds)
- `#42A5F5` - Light blue (accents)
- `#E3F2FD` - Very light blue (backgrounds, badges)
- `#BBDEFB` - Light blue (section headers)
- `#90CAF9` - Medium light (borders)

### Secondary Colors (Green - Agriculture)
- `#2E7D32` - Secondary actions
- `#1B5E20` - Dark green accents
- `#66BB6A` - Light green highlights

This matches the LSPU logo's fisheries/water blue as the dominant color!
