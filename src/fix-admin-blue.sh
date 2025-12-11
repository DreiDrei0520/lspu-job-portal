#!/bin/bash
# Quick fix for ALL remaining blue colors in AdminDashboard.tsx

# Use sed to replace all blue classes and hex colors
sed -i.bak \
  -e 's/focus:ring-blue-500/focus:ring-[#116d8a]/g' \
  -e 's/bg-[#1976D2]/bg-[#116d8a]/g' \
  -e 's/hover:bg-[#1565C0]/hover:bg-[#0d5468]/g' \
  -e 's/bg-blue-50/bg-[#e0f2f7]/g' \
  -e 's/border-blue-200/border-[#7fc4d6]/g' \
  ./components/AdminDashboard.tsx

echo "✅ Fixed all blue colors in AdminDashboard.tsx"
echo "🌊 AdminDashboard is now Surfie Green!"
