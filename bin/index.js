#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const targetDir = process.argv[2] || '.';

  const { pluginName } = await prompts({
    type: 'text',
    name: 'pluginName',
    message: 'Plugin name:',
    initial: path.basename(path.resolve(targetDir)),
  });

  if (!pluginName) {
    console.log(pc.red('Cancelled.'));
    process.exit(1);
  }

  const dest = path.resolve(targetDir);
  const templateDir = path.resolve(__dirname, '../templates/basic');

  fs.mkdirSync(dest, { recursive: true });

  copyDir(templateDir, dest, {
    __PLUGIN_NAME__: pluginName,
  });

  console.log(pc.green('✔ Plugin created!'));
  console.log();
  console.log('Next steps:');
  console.log(pc.cyan(`  cd ${targetDir}`));
  console.log(pc.cyan('  npm install'));
}

function copyDir(src, dest, replacements) {
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath, replacements);
    } else {
      let content = fs.readFileSync(srcPath, 'utf8');
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replaceAll(key, value);
      }
      fs.writeFileSync(destPath, content);
    }
  }
}

main();
