import { defineEvent, definePlugin } from "@ps-maker/plugin-api";

const myEvent = defineEvent({
  name: "My Event",
  description: "My amazing event.",
  parameterDefs: {
    message: {
      description: "A greeting message.",
      type: "string",
      defaultValue: "Hello, world!",
    },
  },
  execute: (params, ctx) => {
    // this is where the event logic goes
    // for example, log the message parameter
    console.log(params.message);
  },
});

export default definePlugin({
  name: "My Plugin",
  description: "A brief description my plugin.",
  version: "0.1.0",
  events: [myEvent],

  // optional fields
  // author: "Author Name",
});
