# PS Maker Plugin CLI

Create and build plugins for **Pixel Stories Maker**.

## Quick Start

Create a new plugin:

```bash
npx @ps-maker/plugin-cli create
```

## Commands

### `create [target-dir]`

Scaffolds a new plugin project using the default template.

```bash
# Create a new plugin in
npx @ps-maker/plugin-cli create

# Create a new plugin in ./my-plugin
npx @ps-maker/plugin-cli create my-plugin

# Create a plugin in the current directory
npx @ps-maker/plugin-cli create .
```

---

### `build`

Builds your plugin from `src/index.ts` into a single bundled file.

```bash
# In project root
npm run build

# Or using npx
npx @ps-maker/plugin-cli build

# Or using command directly with it installed in project
npx ps-maker-plugin build
```

By default, the output is written to `dist/`.

## Plugin Development

- Edit your plugin logic in `src/index.ts`
- Run `npm run build` to generate the final plugin bundle
- Copy the built file into your Pixel Stories Maker project’s plugins folder

## Documentation

Plugin docs and API reference:

[https://pixelstories.io/docs/plugins/](https://pixelstories.io/docs/plugins/)
