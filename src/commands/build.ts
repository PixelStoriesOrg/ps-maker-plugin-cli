import path from "path";
import fs from "fs";
import * as esbuild from "esbuild";
import pc from "picocolors";
import semver from "semver";

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

  // Parse definePlugin call from src/index.ts to get plugin name and version
  let pluginName = "plugin";
  let pluginVersion: string | undefined;
  try {
    const content = fs.readFileSync(entryPoint, "utf8");
    // Match the name property specifically within definePlugin call
    const nameMatch = content.match(
      /definePlugin\s*\(\s*\{[^}]*name:\s*["']([^"']+)["']/s,
    );
    if (nameMatch) {
      pluginName = nameMatch[1];
    }
    const versionMatch = content.match(
      /definePlugin\s*\(\s*\{[^}]*version:\s*["']([^"']+)["']/s,
    );
    if (versionMatch) {
      pluginVersion = versionMatch[1];
    }
  } catch (error) {
    console.log(
      pc.yellow(
        `Warning: Could not parse plugin name from ${entryPoint}, using default.`,
      ),
    );
  }

  if (!pluginVersion) {
    console.log(
      pc.red(
        `Error: Missing "version" field in definePlugin(). A valid semver version is required (e.g. "1.0.0").`,
      ),
    );
    process.exit(1);
  }

  if (!semver.valid(pluginVersion)) {
    console.log(
      pc.red(
        `Error: Invalid plugin version: "${pluginVersion}". Expected semver (e.g. 1.0.0, 0.2.1, 1.0.0-beta.1). `,
      ),
    );
    process.exit(1);
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
    });
    console.log(pc.green(`✔ Built ${safePluginName}.ps-maker.js to ${outdir}`));
  } catch (error) {
    console.log(pc.red("Build failed:"), (error as Error).message);
    process.exit(1);
  }
}
