import { definePlugin, defineEvent } from "./types";

const fooEvent = defineEvent({
  name: "timer",
  description: "Starts a timer and ends event when timer completes.",
  parameterDefs: {
    message: {
      description: "A greeting message.",
      type: "string",
      defaultValue: "Hello, world!",
    },
    duration: {
      description: "Duration in milliseconds.",
      type: "number",
      defaultValue: 1000,
    },
    enabled: {
      description: "Whether the timer is enabled.",
      type: "boolean",
    },
  },
  execute: (params, ctx) => {
    params.message; // ✅ string
    params.duration; // ✅ number
    params.enabled; // ✅ boolean
    // params.foo; // ❌ TS error
  },
});

export default definePlugin({
  name: "__PLUGIN_NAME__",
  description: "A brief description my plugin.",
  version: "0.1.0",

  events: [fooEvent],
});
