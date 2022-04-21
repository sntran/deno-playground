/// <reference no-default-lib="true"/>
import { serve } from "https://deno.land/std@0.135.0/http/server.ts";
import { router } from "https://crux.land/router@0.0.11";

//#region Server
console.log("Listening on http://localhost:8000");
await serve(router(
  {
    "/": () => new Response("Unofficial IMDB API."),
    "/api": api,
  },
));
//#endregion

//#region Route Handlers
async function api(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return new Response("Invalid argument", { status: 400 });
  }

  // We could simply return the Response from `fetch` here.
  // But we want to "beautify" the result JSON a little bit.
  return fetch(`https://v2.sg.media-imdb.com/suggestion/${ query[0].toLowerCase() }/${ query }.json`)
  // Retrieves result as JSON.
  .then(res => res.json())
  // Beautifies the JSON with indentation.
  .then(json => JSON.stringify(json, null, 2))
  // Responds with the formatted JSON.
  .then(json => {
    return new Response(json, {
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  });
}
//#endregion
