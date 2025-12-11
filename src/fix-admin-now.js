const fs = require('fs');

console.log('🔧 Fixing all blue colors in AdminDashboard.tsx...\n');

// Read the file
const filePath = './components/AdminDashboard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Count original blues
const originalBlueCount = (content.match(/blue-|#1976D2|#1565C0|#E3F2FD|#0D47A1/g) || []).length;
console.log(`Found ${originalBlueCount} blue color instances\n`);

// Replace all blue colors with Surfie Green equivalents
const replacements = [
  // Focus rings
  { from: /focus:ring-blue-500/g, to: 'focus:ring-[#116d8a]', name: 'Focus rings' },
  
  // Old hex colors
  { from: /#1976D2/g, to: '#116d8a', name: 'Main blue (#1976D2)' },
  { from: /#1565C0/g, to: '#0d5468', name: 'Dark blue (#1565C0)' },
  { from: /#E3F2FD/g, to: '#e0f2f7', name: 'Light blue (#E3F2FD)' },
  { from: /#0D47A1/g, to: '#116d8a', name: 'Badge blue (#0D47A1)' },
  
  // Tailwind classes
  { from: /bg-blue-50\b/g, to: 'bg-[#e0f2f7]', name: 'bg-blue-50' },
  { from: /bg-blue-100\b/g, to: 'bg-[#b8dce5]', name: 'bg-blue-100' },
  { from: /bg-blue-200\b/g, to: 'bg-[#7fc4d6]', name: 'bg-blue-200' },
  { from: /text-blue-600\b/g, to: 'text-[#116d8a]', name: 'text-blue-600' },
  { from: /text-blue-700\b/g, to: 'text-[#0d5468]', name: 'text-blue-700' },
  { from: /text-blue-900\b/g, to: 'text-[#06303a]', name: 'text-blue-900' },
  { from: /border-blue-200\b/g, to: 'border-[#7fc4d6]', name: 'border-blue-200' },
  { from: /border-blue-300\b/g, to: 'border-[#7fc4d6]', name: 'border-blue-300' },
  { from: /hover:bg-blue-50\b/g, to: 'hover:bg-[#e0f2f7]', name: 'hover:bg-blue-50' },
  { from: /hover:border-blue-500\b/g, to: 'hover:border-[#116d8a]', name: 'hover:border-blue-500' },
];

let totalReplacements = 0;

replacements.forEach(({ from, to, name }) => {
  const matches = content.match(from);
  if (matches) {
    console.log(`✅ ${name}: ${matches.length} replacement(s)`);
    totalReplacements += matches.length;
    content = content.replace(from, to);
  }
});

// Write back to file
fs.writeFileSync(filePath, content, 'utf8');

console.log(`\n🎉 SUCCESS! Made ${totalReplacements} replacements`);
console.log('🌊 AdminDashboard.tsx is now Surfie Green!\n');

// Verify no blues remain
const remainingBlues = (content.match(/blue-|#1976D2|#1565C0|#E3F2FD|#0D47A1/g) || []).length;
if (remainingBlues === 0) {
  console.log('✨ VERIFIED: Zero blue colors remaining!');
} else {
  console.log(`⚠️  Warning: ${remainingBlues} blue instances still remain`);
}
