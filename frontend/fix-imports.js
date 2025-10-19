#!/usr/bin/env node

/**
 * Fix Imports Script - Phase 2
 * Fix default imports to named imports
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixes = [
  // Fix multiple default imports from same module to single named import
  {
    pattern: /import Header from '@modules\/layout';\s*import Footer from '@modules\/layout';/g,
    replacement: "import { Header, Footer } from '@modules/layout';"
  },
  {
    pattern: /import AuthComponent from '@modules\/auth';/g,
    replacement: "import { AuthComponent } from '@modules/auth';"
  },
  {
    pattern: /import Header from '@modules\/layout';/g,
    replacement: "import { Header } from '@modules/layout';"
  },
  {
    pattern: /import Footer from '@modules\/layout';/g,
    replacement: "import { Footer } from '@modules/layout';"
  },
  {
    pattern: /import DashboardCard from '@modules\/dashboard';\s*import StatsGrid from '@modules\/dashboard';\s*import ActivityList from '@modules\/dashboard';\s*import DashboardHeader from '@modules\/dashboard';/g,
    replacement: "import { DashboardCard, StatsGrid, ActivityList, DashboardHeader } from '@modules/dashboard';"
  },
  {
    pattern: /import LoadingPage, \{ LoadingSpinner as InlineSpinner, LoadingButton \} from '@modules\/loading';/g,
    replacement: "import { LoadingPage } from '@modules/loading';"
  },
];

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  fixes.forEach(({ pattern, replacement }) => {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function walkDirectory(dir, callback) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!['node_modules', 'dist', 'build', '.git'].includes(file)) {
        walkDirectory(filePath, callback);
      }
    } else if (stat.isFile() && /\.(jsx?|tsx?)$/.test(file)) {
      callback(filePath);
    }
  });
}

const srcPath = path.join(__dirname, 'src');
console.log('🔧 Fixing import statements...\n');

walkDirectory(srcPath, fixImportsInFile);

console.log('\n✨ Import fixes complete!');
