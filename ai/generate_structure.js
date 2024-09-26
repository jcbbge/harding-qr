//single file run using `node ai/generate_structure.js
//outputs single file to overwrite `project_structure.md`
const fs = require('fs');
const path = require('path');

function generateStructure(dir, prefix = '') {
  let structure = '';
  const files = fs.readdirSync(dir);

  files.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const isLast = index === files.length - 1;

    if (stats.isDirectory()) {
      structure += `${prefix}${isLast ? '└── ' : '├── '}${file}/\n`;
      structure += generateStructure(filePath, prefix + (isLast ? '    ' : '│   '));
    } else {
      structure += `${prefix}${isLast ? '└── ' : '├── '}${file}\n`;
    }
  });

  return structure;
}

const srcPath = path.join(__dirname, '..', 'src');
const structure = generateStructure(srcPath);

const markdownContent = `# Project Structure

\`\`\`
${structure}
\`\`\`
`;

const outputPath = path.join(__dirname, 'context', 'project_structure.md');

// Ensure the directory exists
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// Write the markdown content to the file
fs.writeFileSync(outputPath, markdownContent);

console.log('Project structure has been saved to', outputPath);
