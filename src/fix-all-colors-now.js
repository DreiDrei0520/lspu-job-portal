const fs = require('fs');

function replaceInFile(filePath, replacements) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;
    
    replacements.forEach(({ from, to }) => {
      const regex = new RegExp(from, 'g');
      const matches = content.match(regex);
      if (matches) {
        changeCount += matches.length;
        content = content.replace(regex, to);
      }
    });
    
    if (changeCount > 0) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${filePath}: ${changeCount} replacements`);
      return changeCount;
    } else {
      console.log(`ℹ️  ${filePath}: No changes`);
      return 0;
    }
  } catch (error) {
    console.log(`❌ ${filePath}: Error - ${error.message}`);
    return 0;
  }
}

const replacements = [
  // Exact Tailwind class replacements
  { from: 'bg-blue-50', to: 'bg-[#e6f7f9]' },
  { from: 'bg-blue-100', to: 'bg-[#b3e5ec]' },
  { from: 'bg-blue-200', to: 'bg-[#80d3d9]' },
  { from: 'bg-blue-600', to: 'bg-[#116d8a]' },
  { from: 'bg-blue-700', to: 'bg-[#0d5468]' },
  { from: 'bg-blue-800', to: 'bg-[#0a3f4d]' },
  { from: 'text-blue-50', to: 'text-[#e6f7f9]' },
  { from: 'text-blue-100', to: 'text-[#b3e5ec]' },
  { from: 'text-blue-200', to: 'text-[#80d3d9]' },
  { from: 'text-blue-600', to: 'text-[#116d8a]' },
  { from: 'text-blue-700', to: 'text-[#0d5468]' },
  { from: 'text-blue-800', to: 'text-[#0a3f4d]' },
  { from: 'text-blue-900', to: 'text-[#073340]' },
  { from: 'border-blue-200', to: 'border-[#80d3d9]' },
  { from: 'border-blue-300', to: 'border-[#66cbd4]' },
  { from: 'border-blue-500', to: 'border-[#14899e]' },
  { from: 'border-blue-600', to: 'border-[#116d8a]' },
  { from: 'hover:bg-blue-50', to: 'hover:bg-[#e6f7f9]' },
  { from: 'hover:bg-blue-100', to: 'hover:bg-[#b3e5ec]' },
  { from: 'hover:bg-blue-200', to: 'hover:bg-[#80d3d9]' },
  { from: 'hover:border-blue-500', to: 'hover:border-[#14899e]' },
  { from: 'group-hover:bg-blue-200', to: 'group-hover:bg-[#80d3d9]' },
  
  // Green replacements
  { from: 'bg-green-50', to: 'bg-[#e6f7f9]' },
  { from: 'bg-green-100', to: 'bg-[#b3e5ec]' },
  { from: 'bg-green-200', to: 'bg-[#80d3d9]' },
  { from: 'bg-green-600', to: 'bg-[#116d8a]' },
  { from: 'bg-green-700', to: 'bg-[#0d5468]' },
  { from: 'bg-green-800', to: 'bg-[#0a3f4d]' },
  { from: 'text-green-50', to: 'text-[#e6f7f9]' },
  { from: 'text-green-100', to: 'text-[#b3e5ec]' },
  { from: 'text-green-600', to: 'text-[#116d8a]' },
  { from: 'text-green-700', to: 'text-[#0d5468]' },
  { from: 'text-green-800', to: 'text-[#0a3f4d]' },
  { from: 'text-green-900', to: 'text-[#073340]' },
  { from: 'border-green-200', to: 'border-[#80d3d9]' },
  { from: 'border-green-500', to: 'border-[#14899e]' },
  { from: 'border-green-600', to: 'border-[#116d8a]' },
  { from: 'hover:bg-green-100', to: 'hover:bg-[#b3e5ec]' },
  { from: 'hover:bg-green-200', to: 'hover:bg-[#80d3d9]' },
  { from: 'hover:bg-green-800', to: 'hover:bg-[#0a3f4d]' },
  { from: 'focus:ring-green-500', to: 'focus:ring-[#14899e]' },
  { from: 'from-green-50', to: 'from-[#e6f7f9]' },
  { from: 'to-emerald-50', to: 'to-[#e6f7f9]' },
  
  // Border-l (left border accent)
  { from: 'border-l-4 border-blue-500', to: 'border-l-4 border-[#14899e]' },
  { from: 'border-l-4 border-green-500', to: 'border-l-4 border-[#14899e]' },
  
  // Hex colors
  { from: '#1976D2', to: '#116d8a' },
  { from: '#1565C0', to: '#0d5468' },
  { from: '#42A5F5', to: '#14899e' },
  { from: '#E3F2FD', to: '#e6f7f9' },
];

const files = [
  'components/ApplicantDashboard.tsx',
  'components/AdminDashboard.tsx',
  'components/SuperadminDashboard.tsx',
  'components/DemoSeeder.tsx',
  'components/JobApplicationForm.tsx',
  'components/JobDetailsModal.tsx',
  'components/EvaluationForm.tsx',
  'components/PrintableEvaluationView.tsx',
  'components/ForgotPassword.tsx',
];

console.log('🎨 Converting ALL blue and green to Surfie Green...\n');

let totalChanges = 0;
files.forEach(file => {
  const changes = replaceInFile(file, replacements);
  totalChanges += changes;
});

console.log(`\n✨ Total: ${totalChanges} replacements across all files`);
console.log('🔄 Refresh your browser to see the changes!');
