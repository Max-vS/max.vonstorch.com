import { initBotId } from "botid/client/core";

// A Server Action posts to the page that calls it, so this covers the Community submit.
initBotId({ protect: [{ path: "/community", method: "POST" }] });
