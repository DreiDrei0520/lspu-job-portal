# Color Replacement Script

## Global Find & Replace Instructions

Use your code editor's find & replace feature to make these changes across all `.tsx` files:

### Teal Replacements (Green - LSPU Primary)
```
Find: bg-teal-600
Replace: bg-[#2E7D32]

Find: hover:bg-teal-700
Replace: hover:bg-[#1B5E20]

Find: bg-teal-700
Replace: bg-[#1B5E20]

Find: text-teal-600
Replace: text-[#2E7D32]

Find: text-teal-700
Replace: text-[#1B5E20]

Find: hover:text-teal-700
Replace: hover:text-[#1B5E20]

Find: bg-teal-100
Replace: bg-[#E8F5E9]

Find: bg-teal-50
Replace: bg-[#E8F5E9]

Find: hover:bg-teal-50
Replace: hover:bg-[#E8F5E9]

Find: text-teal-100
Replace: text-[#E8F5E9]

Find: border-teal-600
Replace: border-[#2E7D32]

Find: border-teal-200
Replace: border-[#C8E6C9]

Find: border-teal-300
Replace: border-[#A5D6A7]

Find: hover:border-teal-300
Replace: hover:border-[#A5D6A7]

Find: border-teal-400
Replace: border-[#66BB6A]
```

### Blue Replacements (Blue - LSPU Secondary)
```
Find: bg-blue-700
Replace: bg-[#1976D2]

Find: hover:bg-blue-800
Replace: hover:bg-[#1565C0]

Find: bg-blue-600
Replace: bg-[#1976D2]

Find: hover:bg-blue-700
Replace: hover:bg-[#1565C0]

Find: text-blue-600
Replace: text-[#1976D2]

Find: text-blue-700
Replace: text-[#1976D2]
```

## Files to Update (in order of priority)
1. `/components/AdminDashboard.tsx`
2. `/components/ApplicantDashboard.tsx`
3. `/components/SuperadminDashboard.tsx`
4. `/components/EvaluationForm.tsx`
5. `/components/PrintableEvaluationView.tsx`
6. `/components/LandingPage.tsx`
7. `/components/Navbar.tsx`
8. `/components/AuthForm.tsx`
9. `/components/ForgotPassword.tsx`
10. `/components/JobApplicationForm.tsx`
11. `/components/JobCard.tsx`
12. `/components/JobDetailsModal.tsx`

##Manual Verification Needed
After bulk replacement, verify:
- Chart colors in dashboards
- Status badges
- Button hover states
- Form focus rings (should be green: focus:ring-[#2E7D32])
- Icons in cards/sections

## Testing Checklist
After replacements, test:
- [ ] Landing page hero section
- [ ] Authentication forms (login/signup)
- [ ] Admin Dashboard - all tabs
- [ ] Applicant Dashboard - all sections
- [ ] Superadmin Dashboard
- [ ] Job application form
- [ ] Evaluation form (creation & editing)
- [ ] Printable evaluation view
- [ ] Profile settings
- [ ] All button states (normal, hover, disabled)
- [ ] All badge colors
- [ ] Navigation active states
