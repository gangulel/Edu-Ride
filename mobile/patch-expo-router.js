// Patch script for expo-router web context
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules', 'expo-router', '_ctx.web.js');

const patchedContent = `export const ctx = require.context(
  '../../mobile/app',
  true,
  /^(?:\\.\\/)?(?!(?:(?:(?:.*\\+api)|(?:\\+middleware)|(?:\\+(html|native-intent))))\.[tj]sx?$).*(?:\\.android|\\.ios|\\.native)?\\.[tj]sx?$/,
  'lazy'
);
`;

try {
  fs.writeFileSync(filePath, patchedContent, 'utf8');
  console.log('Successfully patched expo-router _ctx.web.js');
} catch (error) {
  console.error('Failed to patch expo-router:', error.message);
}
