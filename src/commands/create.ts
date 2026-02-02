import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import * as clack from "@clack/prompts";
import pc from "picocolors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function create(targetDir?: string): Promise<void> {
  clack.intro(pc.cyan("Welcome to the PS Maker Plugin CLI!"));

  const projectDir = await clack.text({
    message: "Where would you like your project to be created?",
    placeholder: "(hit Enter to use './')",
    defaultValue: targetDir || "./",
  });

  if (clack.isCancel(projectDir)) {
    clack.cancel("Operation cancelled.");
    process.exit(1);
  }

  const dest = path.resolve(projectDir as string);

  // Check if directory exists and is not empty
  if (fs.existsSync(dest) && fs.readdirSync(dest).length > 0) {
    console.log(
      pc.red(`Error: Directory ${projectDir} already exists and is not empty.`),
    );
    process.exit(1);
  }

  // When bundled by tsup, __dirname is 'dist/', so ../templates gets to package root templates
  const templateDir = path.resolve(__dirname, "../templates/basic");

  fs.mkdirSync(dest, { recursive: true });

  copyDir(templateDir, dest, {});

  const spinner = clack.spinner();
  spinner.start("Creating plugin template...");
  spinner.stop("Plugin starter template created");

  // Auto install dependencies
  const installSpinner = clack.spinner();
  installSpinner.start("Installing dependencies...");

  await runCommand("npm", ["install"], dest);

  clack.log.message(""); // add new line

  installSpinner.stop("Dependencies installed!");

  clack.note(
    [
      `1. ${pc.cyan(`cd ${projectDir}`)}`,
      `2. Edit ${pc.cyan("src/index.ts")} to create your plugin`,
      `3. ${pc.cyan("npm run build")} to build`,
      ``,
      `Plugin Docs → ${pc.cyan("https://pixelstories.io/docs/plugins/")}`,
    ].join("\n"),
    "Next steps",
    { format: (line) => line },
  );

  clack.outro(`You're all set!`);
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
