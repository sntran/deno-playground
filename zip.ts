/// <reference no-default-lib="true"/>
/// <reference lib="deno.ns" />
/// <reference lib="deno.worker" />
import { serve } from "https://deno.land/std@0.134.0/http/server.ts";
import { router } from "https://crux.land/router@0.0.11";
import { downloadZip } from "https://cdn.jsdelivr.net/npm/client-zip/index.js"

//#region Server
console.log("Listening on http://localhost:8000");
await serve(router(
  {
    "GET@/": home,
    "POST@/": download,
  },
));
//#endregion

function identity(x) { return x; }

function home(req: Request): Response {

  const body = `
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>

    <main class="prose">

      <h1>Example of download files as zip</h1>
      <p>Enter URL(s) and/or select multiple files from your computer to download them all in a single zip file</p>

      <form action="/" method="POST" enctype="multipart/form-data" class="flex flex-col gap-4">
        <label class="flex flex-col-reverse">
          <textarea name="urls" rows="5">https://speed.hetzner.de/100MB.bin\nhttps://speed.hetzner.de/100MB.bin\nhttps://speed.hetzner.de/100MB.bin</textarea>
          <span>URLs:</span>
        </label>
        <label>
          <input type="file" multiple="multiple" name="file" />
        </label>

        <button type="submit" class="self-center px-4 py-2 text-white bg-blue-500 border">Download</button>
      </form>

    </main>
    `;
  
  return new Response(body, {
    headers: {
      "content-type": "text/html;charset=utf-8",
    }
  });
}

async function download(req: Request): Promise<Response> {
  const formData = await req.formData();
  // Gets a clean list of URLs.
  const urls = (formData.get("urls") || "").trim().split(/\r?\n/).filter(identity);
  // Makes requests for unique URLs.
  const requests = [...new Set(urls)].map(url => fetch(url));
  // Gets a clean list of `File` uploads.
  const files = formData.getAll("file").filter(identity);
  // Returns a zip archive for the caller to download.
  return downloadZip([].concat(requests, files));
}
