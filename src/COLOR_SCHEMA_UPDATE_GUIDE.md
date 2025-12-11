# 🎨 LSPU Color Schema Update

## New Color Scheme Based on LSPU Logo

### Primary Colors (Green - from Agriculture symbol)
- **Primary Green**: `#2E7D32` - Main brand color
- **Primary Dark**: `#1B5E20` - Hover states, darker text
- **Primary Light**: `#66BB6A` - Light backgrounds
- **Primary 50**: `#E8F5E9` - Very light backgrounds
- **Primary 100**: `#C8E6C9` - Light backgrounds, badges
- **Primary 200**: `#A5D6A7` - Borders

### Secondary Colors (Blue - from Fisheries symbol)
- **Secondary Blue**: `#1976D2` - Secondary actions, accents
- **Secondary Dark**: `#1565C0` - Hover states
- **Secondary Light**: `#42A5F5` - Light accents

### Color Mapping (Old → New)
```
teal-600 → #2E7D32 (LSPU Green)
teal-700 → #1B5E20 (LSPU Green Dark)
teal-100 → #E8F5E9 (LSPU Green 50)
teal-50 → #E8F5E9 (LSPU Green 50)
teal-200 → #C8E6C9 (LSPU Green 100)
teal-300 → #A5D6A7 (LSPU Green 200)
teal-400 → #66BB6A (LSPU Green Light)

blue-700 → #1976D2 (LSPU Blue)
blue-600 → #1976D2 (LSPU Blue)
blue-800 → #1565C0 (LSPU Blue Dark)
```

## Files Updated
- ✅ `styles/globals.css` - Added LSPU color variables
- ✅ `components/AdminDashboard.tsx` - Tab navigation
- 🔄 `components/AdminDashboard.tsx` - All other sections (in progress)
- ⏳ `components/ApplicantDashboard.tsx`
- ⏳ `components/EvaluationForm.tsx`
- ⏳ `components/PrintableEvaluationView.tsx`
- ⏳ `components/LandingPage.tsx`
- ⏳ `components/SuperadminDashboard.tsx`
- ⏳ Other components

## Implementation Strategy

### Using Tailwind Arbitrary Values
Instead of defining custom Tailwind classes, we use arbitrary values:
```tsx
// Old
className="bg-teal-600"

// New  
className="bg-[#2E7D32]"
```

### Benefits of LSPU Colors
1. **Brand Consistency**: Matches official university branding
2. **Visual Hierarchy**: Green for primary actions, Blue for secondary
3. **Professional Look**: Represents agriculture (green) and fisheries (blue)
4. **Better Recognition**: Aligns with LSPU's visual identity

## Usage Examples

### Buttons
```tsx
// Primary Action Button (Green)
<button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white">
  Primary Action
</button>

// Secondary Action Button (Blue)
<button className="bg-[#1976D2] hover:bg-[#1565C0] text-white">
  Secondary Action
</button>
```

### Badges
```tsx
<span className="bg-[#E8F5E9] text-[#1B5E20]">
  Status Badge
</span>
```

### Borders & Highlights
```tsx
<div className="border-[#2E7D32] hover:border-[#66BB6A]">
  Highlighted Card
</div>
```

### Backgrounds
```tsx
<div className="bg-[#E8F5E9] border border-[#C8E6C9]">
  Light Green Background
</div>
```

## Color Psychology
- **Green**: Growth, agriculture, sustainability, natural environment
- **Blue**: Water, fisheries, trust, professionalism, stability

Perfect match for Laguna State Polytechnic University's agricultural and fisheries focus!
