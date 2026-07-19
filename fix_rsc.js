const fs = require('fs');
const path = require('path');

const previewDir = path.join('apps', 'web', 'src', 'features', 'landing', 'components', 'Features', 'Preview');
const featureBlockFile = path.join('apps', 'web', 'src', 'features', 'landing', 'components', 'Features', 'FeatureBlock.tsx');

function addUseClient(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.startsWith('"use client"')) {
    fs.writeFileSync(filePath, '"use client";\n' + content);
  }
}

addUseClient(featureBlockFile);

const previews = [
  'CompensationAnalyticsPreview.tsx',
  'DeveloperAPIPreview.tsx',
  'EnterpriseSecurityPreview.tsx',
  'JobArchitecturePreview.tsx',
  'MarketIntelligencePreview.tsx',
  'OrgBenchmarkingPreview.tsx',
  'PayEquityPreview.tsx',
  'AIPredictionPreview.tsx'
];

previews.forEach(p => addUseClient(path.join(previewDir, p)));

console.log('Added use client');
