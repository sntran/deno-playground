# Deno Deploy Playground

Collection of small experiments running on Deno Deploy.

Notes: These scripts run on the Deno Deploy playground, but haven't typechecked to make sure they run with local Deno.

## Table of Contents

### Unofficial IMDB API

The "Hello World" example of Deno Deploy.

Proxies requests to the IMDB's suggestion endpoint, and beautifies results.

Uses `std` server with a minimal router.

Playground: https://dash.deno.com/playground/imdb

### Stream Zip 

Provides web interface that takes either remote URLs or local files,
and streams back a zip archive for them.

Besides the use of `std` server and router, this example uses a new library
that works with `ReadableStream` to both consume the inputs as streams,
and output the zip archive as stream.

Thanks to the `ReadableStream` web standard, we can efficiently read data
from any source to the deno deploy worker, zip it, and streams it back directly
to the user without keeping anything in memory.

Playground: https://dash.deno.com/playground/zip

### Rclone on the browser

Compiles rclone's WASM build to run it on Deno Deploy, and provides a HTTP
router over rclone's `rc` commands.

The handling of WASM was abstracted into a class at github:sntran/denolcr.

Even though this example only uses a minimal WASM build due to file size limit
of the hosting, it was tested with the full build of 76MB without any problem.

Playground: https://dash.deno.com/playground/rclone
