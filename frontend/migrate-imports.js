#!/usr/bin/env node

/**
 * Import Path Migration Script
 * Automatically updates old import paths to new module-based structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import path mappings
const importMappings = [
  // Auth module
  { 
    old: /from ['"].*\/shared\/auth\/AuthComponent['"]/g, 
    new: "from '@modules/auth'" 
  },
  { 
    old: /from ['"].*\/shared\/auth\/RoleGuard['"]/g, 
    new: "from '@modules/auth'" 
  },
  { 
    old: /from ['"].*\/components\/Auth\/MultiStepRegister['"]/g, 
    new: "from '@modules/auth'" 
  },
  
  // Layout module
  { 
    old: /from ['"].*\/shared\/components\/Header['"]/g, 
    new: "from '@modules/layout'" 
  },
  { 
    old: /from ['"].*\/shared\/components\/Footer['"]/g, 
    new: "from '@modules/layout'" 
  },
  { 
    old: /from ['"].*\/shared\/layout\/Navbar['"]/g, 
    new: "from '@modules/layout'" 
  },
  { 
    old: /from ['"].*\/shared\/layout\/Sidebar['"]/g, 
    new: "from '@modules/layout'" 
  },
  
  // Dashboard module
  { 
    old: /from ['"].*\/shared\/components\/DashboardCard['"]/g, 
    new: "from '@modules/dashboard'" 
  },
  { 
    old: /from ['"].*\/shared\/components\/DashboardHeader['"]/g, 
    new: "from '@modules/dashboard'" 
  },
  { 
    old: /from ['"].*\/shared\/components\/StatsGrid['"]/g, 
    new: "from '@modules/dashboard'" 
  },
  { 
    old: /from ['"].*\/shared\/components\/ActivityList['"]/g, 
    new: "from '@modules/dashboard'" 
  },
  
  // Loading module
  { 
    old: /from ['"].*\/shared\/components\/LoadingHOC['"]/g, 
    new: "from '@modules/loading'" 
  },
  { 
    old: /from ['"].*\/shared\/components\/LoadingPage['"]/g, 
    new: "from '@modules/loading'" 
  },
  
  // Utils
  { 
    old: /from ['"].*\/shared\/utils\/auth['"]/g, 
    new: "from '@utils'" 
  },
  { 
    old: /from ['"].*\/shared\/utils\/googleAuth['"]/g, 
    new: "from '@utils'" 
  },
  { 
    old: /from ['"].*\/shared\/utils\/api['"]/g, 
    new: "from '@utils'" 
  },
  { 
    old: /from ['"].*\/shared\/utils\/notifications['"]/g, 
    new: "from '@utils'" 
  },
  
  // Hooks
  { 
    old: /from ['"].*\/shared\/hooks\/useCommon['"]/g, 
    new: "from '@hooks'" 
  },
  { 
    old: /from ['"].*\/shared\/hooks\/useLoading['"]/g, 
    new: "from '@hooks'" 
  },
];

// CSS import mappings
const cssImportMappings = [
  { 
    old: /import ['"].*\/shared\/components\/GlobalLoading\.css['"]/g, 
    new: "import '@modules/loading/GlobalLoading.css'" 
  },
  { 
    old: /import ['"].*\/shared\/auth\/AuthComponent\.css['"]/g, 
    new: "import '@modules/auth/AuthComponent.css'" 
  },
];

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Update JS/JSX imports
  importMappings.forEach(({ old, new: newPath }) => {
    if (old.test(content)) {
      content = content.replace(old, newPath);
      modified = true;
    }
  });

  // Update CSS imports
  cssImportMappings.forEach(({ old, new: newPath }) => {
    if (old.test(content)) {
      content = content.replace(old, newPath);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  }
}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip node_modules, dist, build
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        walkDirectory(filePath, callback);
      }
    } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(file)) {
      callback(filePath);
    }
  });
}

// Run migration
const srcPath = path.join(__dirname, 'src');
console.log('🚀 Starting import path migration...\n');

walkDirectory(srcPath, updateImportsInFile);

console.log('\n✨ Migration complete!');
console.log('\n📝 Next steps:');
console.log('1. Review the changes');
console.log('2. Run `npm run dev` to test');
console.log('3. Fix any remaining import issues manually');
