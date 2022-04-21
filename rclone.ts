import { serve } from "https://deno.land/std@0.135.0/http/server.ts";
import { router } from "https://crux.land/router@0.0.11";
import { Rclone } from "https://deno.land/x/rclone@v0.0.2/mod.ts";

const RCLONE_WASM_URL = Deno.env.get("RCLONE_WASM_URL") || "https://deno.land/x/rclone@v0.0.2/rclone.wasm";

const module = await WebAssembly.compileStreaming(
  fetch(RCLONE_WASM_URL)
);
const rclone = new Rclone(module);

//#region Server
console.log("Listening on http://localhost:8000");
await serve(router(
  {
    "/": rc,
    "/:command*": rc,
  },
));
//#endregion

function rc(req: Request, _conn, { command = "core/version" } = { }): Response | Promise<Response> {
  const { searchParams } = new URL(req.url);
  const result = rclone.rc(command, Object.fromEntries(searchParams));

  return new Response(JSON.stringify(result, null, 4), {
    headers: {
      "content-type": "application/json",
    },
  });
}
