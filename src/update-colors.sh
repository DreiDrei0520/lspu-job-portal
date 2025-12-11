#!/bin/bash
# Surfie Green Color Replacement Script
# Replaces all blue colors with Surfie Green (#116d8a)

echo "🌊 SURFIE GREEN COLOR REPLACEMENT"
echo "═══════════════════════════════════════"
echo ""

# Function to replace colors in a file
replace_in_file() {
    local file="$1"
    if [ -f "$file" ]; then
        sed -i '' 's/#1976D2/#116d8a/g' "$file"
        sed -i '' 's/#1565C0/#0d5468/g' "$file"
        sed -i '' 's/#0D47A1/#094050/g' "$file"
        sed -i '' 's/#42A5F5/#1a8bad/g' "$file"
        sed -i '' 's/#E3F2FD/#e0f2f7/g' "$file"
        sed -i '' 's/#BBDEFB/#b8dce5/g' "$file"
        sed -i '' 's/#90CAF9/#7fc4d6/g' "$file"
        sed -i '' 's/#64B5F6/#5aacbf/g' "$file"
        echo "✅ Updated: $file"
    else
        echo "⚠️  Skipped: $file (not found)"
    fi
}

# Update all component files
replace_in_file "components/ApplicantDashboard.tsx"
replace_in_file "components/AdminDashboard.tsx"
replace_in_file "components/EvaluationForm.tsx"
replace_in_file "components/PrintableEvaluationView.tsx"
replace_in_file "components/SuperadminDashboard.tsx"
replace_in_file "components/JobApplicationForm.tsx"
replace_in_file "components/JobDetailsModal.tsx"

echo ""
echo "═══════════════════════════════════════"
echo "🎉 COMPLETE! All colors updated to Surfie Green!"
echo "🌊 Your LSPU Job Portal now uses #116d8a!"
echo ""
