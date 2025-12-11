#!/usr/bin/env node
/**
 * SURFIE GREEN COLOR REPLACEMENT SCRIPT
 * Replaces all blue colors with Surfie Green (#116d8a) throughout the codebase
 * 
 * Usage: node replace-colors.js
 */

const fs = require('fs');
const path = require('path');

// Color mappings: OLD BLUE → NEW SURFIE GREEN
const colorMappings = {
  // Hex colors
  '#1976D2': '#116d8a',
  '#1565C0': '#0d5468',
  '#0D47A1': '#094050',
  '#42A5F5': '#1a8bad',
  '#E3F2FD': '#e0f2f7',
  '#BBDEFB': '#b8dce5',
  '#90CAF9': '#7fc4d6',
  '#64B5F6': '#5aacbf',
  
  // Tailwind background classes
  'bg-blue-50': 'bg-[#e0f2f7]',
  'bg-blue-100': 'bg-[#b8dce5]',
  'bg-blue-200': 'bg-[#7fc4d6]',
  'bg-blue-500': 'bg-[#116d8a]',
  'bg-blue-600': 'bg-[#116d8a]',
  'bg-blue-700': 'bg-[#0d5468]',
  
  // Tailwind text classes
  'text-blue-100': 'text-[#e0f2f7]',
  'text-blue-600': 'text-[#116d8a]',
  'text-blue-700': 'text-[#0d5468]',
  'text-blue-800': 'text-[#094050]',
  'text-blue-900': 'text-[#06303a]',
  
  // Tailwind border classes
  'border-blue-200': 'border-[#7fc4d6]',
  'border-blue-300': 'border-[#7fc4d6]',
  'border-blue-500': 'border-[#116d8a]',
  'border-blue-600': 'border-[#116d8a]',
  
  // Tailwind hover classes
  'hover:bg-blue-50': 'hover:bg-[#e0f2f7]',
  'hover:bg-blue-100': 'hover:bg-[#b8dce5]',
  'hover:bg-blue-200': 'hover:bg-[#7fc4d6]',
  'hover:bg-blue-700': 'hover:bg-[#0d5468]',
  'hover:border-blue-500': 'hover:border-[#116d8a]',
  
  // Tailwind gradient classes
  'from-blue-50': 'from-[#e0f2f7]',
  'to-blue-50': 'to-[#e0f2f7]',
  
  // Tailwind group-hover classes
  'group-hover:bg-blue-200': 'group-hover:bg-[#7fc4d6]',
  
  // Tailwind focus classes
  'focus:ring-blue-500': 'focus:ring-[#116d8a]',
};

// Files to process
const filesToProcess = [
  './App.tsx',
  './components/Navbar.tsx',
  './components/LandingPage.tsx',
  './components/AuthForm.tsx',
  './components/JobCard.tsx',
  './components/ApplicantDashboard.tsx',
  './components/AdminDashboard.tsx',
  './components/SuperadminDashboard.tsx',
  './components/EvaluationForm.tsx',
  './components/PrintableEvaluationView.tsx',
  './components/JobApplicationForm.tsx',
  './components/JobDetailsModal.tsx',
  './components/DemoSeeder.tsx',
  './components/ForgotPassword.tsx',
];

let totalReplacements = 0;

console.log('🌊 SURFIE GREEN COLOR REPLACEMENT\n');
console.log('═══════════════════════════════════════\n');

filesToProcess.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipped: ${filePath} (not found)`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let fileReplacements = 0;

  Object.entries(colorMappings).forEach(([oldColor, newColor]) => {
    const regex = new RegExp(oldColor, 'gi');
    const matches = content.match(regex);
    if (matches) {
      fileReplacements += matches.length;
      content = content.replace(regex, newColor);
    }
  });

  if (fileReplacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${path.basename(filePath)}: ${fileReplacements} replacements`);
    totalReplacements += fileReplacements;
  } else {
    console.log(`✓  ${path.basename(filePath)}: Already updated`);
  }
});

console.log('\n═══════════════════════════════════════');
console.log(`\n🎉 COMPLETE! Total replacements: ${totalReplacements}`);
console.log('\n🌊 Your LSPU Job Portal now uses Surfie Green!\n');
