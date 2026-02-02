# PS Maker CLI

A CLI tool to create and build Pixel Stories Maker plugins.

## Installation

You can use this tool directly with `npx` without installation:

```bash
npx @ps-maker/plugin-cli create my-plugin
```

Or install it globally:

```bash
npm install -g @ps-maker/plugin-cli
```

## Quick Start

```bash
# Using npx (recommended)
npx @ps-maker/plugin-cli create my-plugin
cd my-plugin
npm install
npm run build

# Or with global install
create-ps-maker-plugin my-plugin
cd my-plugin
npm install
npm run build
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

| Option               | Description      | Default |
| -------------------- | ---------------- | ------- |
| `-o, --outdir <dir>` | Output directory | `dist`  |

**Examples:**

```bash
# Build to default dist/ folder
ps-maker-plugin build

# Build to custom output directory
ps-maker-plugin build --outdir out
```
