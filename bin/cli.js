#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source is in the parent directory relative to 'bin/'
const sourceDir = path.join(__dirname, '..', 'template', '.agents');
const targetDir = path.resolve(process.cwd(), '.agents');

console.log(`🤖 Initializing AI Agent Skills...`);
console.log(`📍 Target directory: ${targetDir}`);

if (targetDir.includes('node_modules')) {
  console.error('❌ Error: It seems you are running this inside a node_modules folder.');
  console.error('Please run this command from your project root.');
  process.exit(1);
}

if (!fs.existsSync(sourceDir)) {
  console.error(`❌ Source directory not found: ${sourceDir}`);
  process.exit(1);
}

try {
  // Check if target directory already exists
  if (fs.existsSync(targetDir)) {
    console.log('⚠️  Target folder .agents already exists. Overwriting...');
  }

  // Copy recursive
  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });

  console.log('✅ Success! Folder .agents has been added to your project.');
  console.log('💡 Your AI Assistant is now much smarter and understands your codebase standards!');
} catch (error) {
  console.error('❌ Failed to copy skills:', error.message);
  process.exit(1);
}
