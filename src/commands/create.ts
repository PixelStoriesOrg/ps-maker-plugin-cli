import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import prompts from "prompts";
import pc from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function create(targetDir = "."): Promise<void> {
  const { pluginName } = await prompts({
    type: "text",
    name: "pluginName",
    message: "Plugin name:",
    initial: path.basename(path.resolve(targetDir)),
  });

  if (!pluginName) {
    console.log(pc.red("Cancelled."));
    process.exit(1);
  }

  const dest = path.resolve(targetDir);
  // When bundled by tsup, __dirname is 'dist/', so ../templates gets to package root templates
  const templateDir = path.resolve(__dirname, "../templates/basic");

  fs.mkdirSync(dest, { recursive: true });

  copyDir(templateDir, dest, {
    __PLUGIN_NAME__: pluginName,
  });

  console.log(pc.green("✔ Plugin starter template created!"));
  console.log();

  // Auto install dependencies
  console.log(pc.cyan("Installing dependencies..."));
  await runCommand("npm", ["install"], dest);
  console.log(pc.green("✔ Dependencies installed!"));
  console.log();

  console.log(
    "You're all set to start creating your plugin! Below are some helpful resources:",
  );
  console.log(
    `  Getting started guide: ${pc.cyan("https://pixelstories.io/docs/plugins/getting-started")}`,
  );
  console.log(
    `  PS Maker plugin docs: ${pc.cyan("https://pixelstories.io/docs/plugins/")}`,
  );
  console.log();
}

function copyDir(
  src: string,
  dest: string,
  replacements: Record<string, string>,
): void {
  for (const file of fs.readdirSync(src)) {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath, replacements);
    } else {
      let content = fs.readFileSync(srcPath, "utf8");
      for (const [key, value] of Object.entries(replacements)) {
        content = content.replaceAll(key, value);
      }
      fs.writeFileSync(destPath, content);
    }
  }
}

function runCommand(cmd: string, args: string[], cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd,
      stdio: "inherit",
      shell: true,
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on("error", reject);
  });
}
