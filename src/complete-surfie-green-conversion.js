const fs = require('fs');
const path = require('path');

// Color replacement mappings
const replacements = [
  // Hex colors - Blue
  { from: /#1976D2/g, to: '#116d8a' },
  { from: /#1565C0/g, to: '#0d5468' },
  { from: /#42A5F5/g, to: '#14899e' },
  { from: /#E3F2FD/g, to: '#e6f7f9' },
  
  // Tailwind blue classes
  { from: /bg-blue-50/g, to: 'bg-[#e6f7f9]' },
  { from: /bg-blue-100/g, to: 'bg-[#b3e5ec]' },
  { from: /bg-blue-200/g, to: 'bg-[#80d3d9]' },
  { from: /bg-blue-600/g, to: 'bg-[#116d8a]' },
  { from: /bg-blue-700/g, to: 'bg-[#0d5468]' },
  { from: /bg-blue-800/g, to: 'bg-[#0a3f4d]' },
  { from: /text-blue-50/g, to: 'text-[#e6f7f9]' },
  { from: /text-blue-100/g, to: 'text-[#b3e5ec]' },
  { from: /text-blue-200/g, to: 'text-[#80d3d9]' },
  { from: /text-blue-600/g, to: 'text-[#116d8a]' },
  { from: /text-blue-700/g, to: 'text-[#0d5468]' },
  { from: /text-blue-800/g, to: 'text-[#0a3f4d]' },
  { from: /text-blue-900/g, to: 'text-[#073340]' },
  { from: /border-blue-200/g, to: 'border-[#80d3d9]' },
  { from: /border-blue-300/g, to: 'border-[#66cbd4]' },
  { from: /border-blue-500/g, to: 'border-[#14899e]' },
  { from: /border-blue-600/g, to: 'border-[#116d8a]' },
  
  // Tailwind green classes
  { from: /bg-green-50/g, to: 'bg-[#e6f7f9]' },
  { from: /bg-green-100/g, to: 'bg-[#b3e5ec]' },
  { from: /bg-green-200/g, to: 'bg-[#80d3d9]' },
  { from: /bg-green-600/g, to: 'bg-[#116d8a]' },
  { from: /bg-green-700/g, to: 'bg-[#0d5468]' },
  { from: /bg-green-800/g, to: 'bg-[#0a3f4d]' },
  { from: /text-green-50/g, to: 'text-[#e6f7f9]' },
  { from: /text-green-100/g, to: 'text-[#b3e5ec]' },
  { from: /text-green-600/g, to: 'text-[#116d8a]' },
  { from: /text-green-700/g, to: 'text-[#0d5468]' },
  { from: /text-green-800/g, to: 'text-[#0a3f4d]' },
  { from: /text-green-900/g, to: 'text-[#073340]' },
  { from: /border-green-200/g, to: 'border-[#80d3d9]' },
  { from: /border-green-500/g, to: 'border-[#14899e]' },
  { from: /border-green-600/g, to: 'border-[#116d8a]' },
  { from: /hover:bg-green-100/g, to: 'hover:bg-[#b3e5ec]' },
  { from: /hover:bg-green-200/g, to: 'hover:bg-[#80d3d9]' },
  { from: /hover:bg-green-800/g, to: 'hover:bg-[#0a3f4d]' },
  { from: /focus:ring-green-500/g, to: 'focus:ring-[#14899e]' },
  
  // Gradient greens
  { from: /from-green-50/g, to: 'from-[#e6f7f9]' },
  { from: /to-emerald-50/g, to: 'to-[#e6f7f9]' },
];

// Files to process
const files = [
  'components/ApplicantDashboard.tsx',
  'components/AdminDashboard.tsx',
  'components/SuperadminDashboard.tsx',
  'components/DemoSeeder.tsx',
  'components/JobApplicationForm.tsx',
  'components/JobDetailsModal.tsx',
  'components/EvaluationForm.tsx',
  'components/PrintableEvaluationView.tsx',
];

console.log('🎨 Starting comprehensive Surfie Green conversion...\n');

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      changeCount += matches.length;
      content = content.replace(from, to);
    }
  });
  
  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}: ${changeCount} replacements`);
  } else {
    console.log(`ℹ️  ${file}: No changes needed`);
  }
});

console.log('\n🎉 Surfie Green conversion complete!');
console.log('🔄 Refresh your browser to see the changes.');
