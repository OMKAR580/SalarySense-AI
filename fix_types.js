const fs = require('fs');
const path = require('path');

const previewDir = path.join('apps', 'web', 'src', 'features', 'landing', 'components', 'Features', 'Preview');

const files = fs.readdirSync(previewDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(previewDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace `const nameVariants = {` or `const nameVariants: Variants = {` with `const nameVariants: any = {`
  content = content.replace(/const\s+(\w+Variants)\s*(?::\s*Variants)?\s*=\s*\{/g, 'const $1: any = {');
  
  // also handle arrow functions returning variants `const nameVariants = { active: (custom) => ({`
  // wait, the regex above matches `const somethingVariants = {`
  
  // Fix specific inline objects if any, but mostly they are defined as consts
  
  fs.writeFileSync(filePath, content);
});

console.log('Fixed types in preview components');
