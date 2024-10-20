import fs from 'node:fs/promises';
import path from 'node:path';
// prebuild.js

// Define the path to the node_module you want to overwrite
const modulePath = path.resolve(
  __dirname,
  'node_modules',
  'your-module',
  'path',
  'to',
  'file.js'
);

// Define the new content you want to write to the file
const newContent = `
  // Your custom content here
  module.exports = function() {
    console.log('This module has been overwritten!');
  };
`;

// Function to overwrite the file
async function overwriteModule() {
  try {
    // Read the original file (optional, if you need to modify existing content)
    // const originalContent = await fs.readFile(modulePath, 'utf8');

    // Write new content to the file
    await fs.writeFile(modulePath, newContent, 'utf8');
    console.log(`Successfully overwritten ${modulePath}`);
  } catch (error) {
    console.error(`Error overwriting file at ${modulePath}:`, error);
  }
}

// Run the overwrite function
overwriteModule();
