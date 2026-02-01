# PS Maker CLI

A CLI tool to create and build Pixel Stories Maker plugins.

## Quick Start

```bash
ps-maker-plugin create my-plugin
cd my-plugin
```

## Commands

### `create [target-dir]`

Scaffolds a new plugin project from the template.

```bash
# Create in a new directory
ps-maker-plugin create my-plugin

# Or create in current directory
ps-maker-plugin create .
```

### `build`

Bundles your plugin's `src/index.ts` into a single file using esbuild.

```bash
ps-maker-plugin build
```

**Options:**

| Option | Description | Default |
|--------|-------------|---------|
| `-o, --outdir <dir>` | Output directory | `dist` |

**Examples:**

```bash
# Build to default dist/ folder
ps-maker-plugin build

# Build to custom output directory
ps-maker-plugin build --outdir out
```

## Plugin Structure

Generated plugins have the following structure:

```
my-plugin/
├── src/
│   └── index.ts    # Plugin entry point (default export)
├── dist/           # Built output
└── package.json
```

Your plugin should export a default object from `src/index.ts`:

```ts
export default {
  name: "my-plugin",
  version: "0.1.0",

  init() {
    // Called when plugin is loaded
  },

  destroy() {
    // Called when plugin is unloaded
  },
};
```
