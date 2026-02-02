import path from "path";
import fs from "fs";
import * as esbuild from "esbuild";
import pc from "picocolors";

interface BuildOptions {
  outdir: string;
}

export async function build(options: BuildOptions): Promise<void> {
  const cwd = process.cwd();
  const entryPoint = path.resolve(cwd, "src/index.ts");
  const outdir = path.resolve(cwd, options.outdir);

  if (!fs.existsSync(entryPoint)) {
    console.log(pc.red(`Error: Entry point not found at ${entryPoint}`));
    process.exit(1);
  }

  // Parse definePlugin call from src/index.ts to get plugin name
  let pluginName = "plugin";
  try {
    const content = fs.readFileSync(entryPoint, "utf8");
    const nameMatch = content.match(/name:\s*["']([^"']+)["']/);
    if (nameMatch) {
      pluginName = nameMatch[1];
    }
  } catch (error) {
    console.log(
      pc.yellow(
        `Warning: Could not parse plugin name from ${entryPoint}, using default.`,
      ),
    );
  }

  // Sanitize plugin name for safe filename usage (convert to kebab-case)
  const safePluginName = pluginName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const outfilePath = path.join(outdir, `${safePluginName}.ps-maker.js`);

  try {
    await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      outfile: outfilePath,
      format: "esm",
      platform: "browser",
      target: "es2020",
      minify: true,
      sourcemap: true,
    });
    console.log(pc.green(`✔ Built ${safePluginName}.ps-maker.js to ${outdir}`));
  } catch (error) {
    console.log(pc.red("Build failed:"), (error as Error).message);
    process.exit(1);
  }
}
