import express from "express";
import { createServer } from "node:http";
import { join, dirname } from "node:path";
import { hostname } from "node:os";
import { fileURLToPath } from "node:url";
import wisp from "wisp-server-node";
import { epoxyPath } from "@mercuryworkshop/epoxy-transport";
import { baremuxPath } from "@mercuryworkshop/bare-mux/node";
import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import serveStatic from "serve-static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, "..", "public");

const PORT = process.env.PORT || 4040;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "production";

const app = express();

// Set COOP/COEP headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});
app.use("/uv/", express.static(uvPath));

// Serve static files
app.use("/", serveStatic(publicDir));
app.use("/epoxy", serveStatic(epoxyPath));
app.use("/baremux", serveStatic(baremuxPath));

// Route: index.html
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: publicDir });
});

// Route: favicon proxy
app.get("/favicon-proxy", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url)
      return res.status(400).json({ error: "URL parameter is required" });

    const validServices = [
      "www.google.com/s2/favicons",
      "icons.duckduckgo.com/ip3",
      "favicons.githubusercontent.com",
    ];

    const urlObj = new URL(url);
    const isValidService = validServices.some(
      (service) =>
        urlObj.hostname + urlObj.pathname.split("/")[1] ===
          service.split("/")[0] || urlObj.href.includes(service)
    );

    if (!isValidService)
      return res.status(403).json({ error: "Invalid favicon service" });

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Glint-Browser/1.0",
        Accept: "image/*,*/*;q=0.8",
      },
      timeout: 5000,
    });

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch favicon" });
    }

    const contentType = response.headers.get("content-type") || "image/x-icon";
    const imageBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "public, max-age=86400");
    res.setHeader("Access-Control-Allow-Origin", "*");

    return res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error("Favicon proxy error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Create HTTP server with upgrade handling
const server = createServer(app);

server.on("upgrade", (req, socket, head) => {
  if (req.url.endsWith("/wisp/")) {
    wisp.routeRequest(req, socket, head);
  } else {
    socket.end();
  }
});

// Graceful shutdown
function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start server
server.listen(PORT, HOST, () => {
  const address = server.address();
  console.log(`Server running in ${NODE_ENV} mode`);
  console.log(`Listening on:`);
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  if (address.family === "IPv6") {
    console.log(`\thttp://[${address.address}]:${address.port}`);
  } else {
    console.log(`\thttp://${address.address}:${address.port}`);
  }
});
