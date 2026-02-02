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

  // Read package.json for plugin name
  const pkgPath = path.resolve(cwd, "package.json");
  let pluginName = "plugin";
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    pluginName = pkg.name || "plugin";
  }

  try {
    await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      outfile: path.join(outdir, `${pluginName}.ps-maker.js`),
      format: "esm",
      platform: "browser",
      target: "es2020",
      minify: true,
      sourcemap: true,
    });
    console.log(pc.green(`✔ Built ${pluginName}.ps-maker.js to ${outdir}`));
  } catch (error) {
    console.log(pc.red("Build failed:"), (error as Error).message);
    process.exit(1);
  }
}
