export interface PluginContext {
  /**
   * The Phaser game instance (StoryGame extends Phaser.Game).
   * Same as `window.game`. Provides full Phaser API access.
   */
  game: any;
  /**
   * The current active GameMap scene (extends Phaser.Scene).
   * Use for adding game objects, physics, tilemaps, etc.
   */
  scene: any;
  /**
   * The player Actor (extends Phaser.Physics.Arcade.Sprite).
   * Control movement, animations, position, etc.
   */
  player: any;
}

interface ParamSchemaBase {
  description: string;
}
interface StringParam extends ParamSchemaBase {
  type: "string";
  defaultValue?: string;
}
interface NumberParam extends ParamSchemaBase {
  type: "number";
  defaultValue?: number;
}
interface BooleanParam extends ParamSchemaBase {
  type: "boolean";
  defaultValue?: boolean;
}
export type ParamSchema = StringParam | NumberParam | BooleanParam;

// Map the "type" string to actual TypeScript types
type ParamTypeMap = {
  string: string;
  number: number;
  boolean: boolean;
  // TODO: add the image, audio, npc, etc types
};

export type ParamSchemas = Record<string, ParamSchema>;

// Infer the TS type from a ParameterDef's "type" field
type InferParamType<T extends ParamSchema> = T extends { type: infer U }
  ? U extends keyof ParamTypeMap
    ? ParamTypeMap[U]
    : never
  : never;

// Convert parameterDefs object to the params object type
type InferParams<T extends ParamSchemas> = {
  [K in keyof T]: InferParamType<T[K]>;
};

// Helper type for defining event functions separately
export type PluginEventHandler<T extends ParamSchemas> = (
  params: InferParams<T>,
  ctx: PluginContext,
) => void;

export interface PluginEvent<T extends ParamSchemas = ParamSchemas> {
  name: string;
  description: string;
  parameterDefs: T;
  execute: PluginEventHandler<T>;
}

// Helper to create a properly typed event with inference (preserves literal types)
export function defineEvent<const T extends ParamSchemas>(
  event: PluginEvent<T>,
): PluginEvent<T> {
  return event;
}

export interface Plugin<
  E extends readonly PluginEvent<any>[] = PluginEvent<any>[],
> {
  name: string;
  description: string;
  version: string;
  events: E;
}

export function definePlugin<
  const E extends readonly PluginEvent<any>[],
>(plugin: {
  name: string;
  description: string;
  version: string;
  events: E;
}): Plugin<E> {
  return plugin;
}
