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

interface ParameterDefBase {
  description: string;
}
interface StringParameter extends ParameterDefBase {
  type: "string";
  defaultValue?: string;
}
interface NumberParameter extends ParameterDefBase {
  type: "number";
  defaultValue?: number;
}
interface BooleanParameter extends ParameterDefBase {
  type: "boolean";
  defaultValue?: boolean;
}
export type ParameterDef = StringParameter | NumberParameter | BooleanParameter;

// Map the "type" string to actual TypeScript types
type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
};

export type ParameterDefs = Record<string, ParameterDef>;

// Infer the TS type from a ParameterDef's "type" field
type InferParamType<T extends ParameterDef> = T extends { type: infer U }
  ? U extends keyof TypeMap
    ? TypeMap[U]
    : never
  : never;

// Convert parameterDefs object to the params object type
type InferParams<T extends ParameterDefs> = {
  [K in keyof T]: InferParamType<T[K]>;
};

// Helper type for defining event functions separately
export type EventFn<T extends ParameterDefs> = (
  params: InferParams<T>,
  ctx: PluginContext,
) => void;

export interface Event<T extends ParameterDefs = ParameterDefs> {
  name: string;
  description: string;
  parameterDefs: T;
  fn: (params: InferParams<T>, ctx: PluginContext) => void;
}

// Helper to create a properly typed event (preserves literal types)
export function defineEvent<const T extends ParameterDefs>(event: {
  name: string;
  description: string;
  parameterDefs: T;
  fn: (
    params: { [K in keyof T]: InferParamType<T[K]> },
    ctx: PluginContext,
  ) => void;
}): Event<T> {
  return event;
}

export interface Plugin<E extends readonly Event<any>[] = Event<any>[]> {
  name: string;
  description: string;
  version: string;
  events: E;
}

export function definePlugin<const E extends readonly Event<any>[]>(plugin: {
  name: string;
  description: string;
  version: string;
  events: E;
}): Plugin<E> {
  return plugin;
}
