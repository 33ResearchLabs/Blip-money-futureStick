// Dev-only Vite plugin: handles image uploads and Gemini card generation.
// Endpoints (dev server only):
//   POST /__dev_upload          multipart/form-data { file, id } -> saves to public/illustrations/
//   POST /__dev_generate_card   json { prompt, filename } -> Gemini -> saves to public/illustrations/

import { writeFileSync, mkdirSync, existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ILL_DIR = resolve(__dirname, "public/illustrations");

function loadEnvLocal() {
  const p = resolve(__dirname, ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, "");
  }
}
loadEnvLocal();

// Tiny multipart parser sufficient for single-file uploads from our Editable component.
function parseMultipart(buf, boundary) {
  const parts = {};
  const delim = Buffer.from(`--${boundary}`);
  const chunks = [];
  let i = 0;
  while (i < buf.length) {
    const next = buf.indexOf(delim, i);
    if (next === -1) break;
    chunks.push(buf.slice(i, next));
    i = next + delim.length;
  }
  for (const c of chunks) {
    if (!c || c.length < 4) continue;
    const headerEnd = c.indexOf("\r\n\r\n");
    if (headerEnd === -1) continue;
    const header = c.slice(0, headerEnd).toString("utf8");
    const body = c.slice(headerEnd + 4, c.length - 2); // strip trailing \r\n
    const nameMatch = /name="([^"]+)"/.exec(header);
    if (!nameMatch) continue;
    const name = nameMatch[1];
    const filenameMatch = /filename="([^"]+)"/.exec(header);
    if (filenameMatch) {
      parts[name] = { filename: filenameMatch[1], data: body };
    } else {
      parts[name] = body.toString("utf8");
    }
  }
  return parts;
}

function sanitizeFilename(id, originalExt) {
  const safe = id.replace(/[^a-z0-9_-]/gi, "-").toLowerCase();
  const ext = originalExt && /^\.(png|jpe?g|webp|svg|gif)$/i.test(originalExt) ? originalExt.toLowerCase() : ".png";
  return `${safe}${ext}`;
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default function blipDashboardPlugin() {
  return {
    name: "blip-dashboard-dev",
    apply: "serve",
    configureServer(server) {
      if (!existsSync(ILL_DIR)) mkdirSync(ILL_DIR, { recursive: true });

      // List all illustrations on disk
      server.middlewares.use("/__dev_list_illustrations", async (req, res, next) => {
        if (req.method !== "GET") return next();
        try {
          const files = readdirSync(ILL_DIR)
            .filter((f) => /\.(png|jpe?g|webp|svg|gif)$/i.test(f))
            .map((f) => {
              const s = statSync(resolve(ILL_DIR, f));
              return { filename: f, path: `/illustrations/${f}`, bytes: s.size, mtime: s.mtimeMs };
            })
            .sort((a, b) => b.mtime - a.mtime);
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, files }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
        }
      });

      server.middlewares.use("/__dev_upload", async (req, res, next) => {
        if (req.method !== "POST") return next();
        try {
          const ct = req.headers["content-type"] || "";
          const m = /boundary=(.+)$/.exec(ct);
          if (!m) throw new Error("missing boundary");
          const body = await readBody(req);
          const parts = parseMultipart(body, m[1]);
          const file = parts.file;
          const id = parts.id || `upload-${Date.now()}`;
          if (!file || typeof file === "string") throw new Error("no file");
          const ext = extname(file.filename || ".png");
          const out = sanitizeFilename(id, ext);
          const outPath = resolve(ILL_DIR, out);
          writeFileSync(outPath, file.data);
          const url = `/illustrations/${out}?t=${Date.now()}`;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, path: url, filename: out, bytes: file.data.length }));
        } catch (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
        }
      });

      server.middlewares.use("/__dev_generate_card", async (req, res, next) => {
        if (req.method !== "POST") return next();
        try {
          const apiKey = process.env.GEMINI_API_KEY;
          if (!apiKey) throw new Error("GEMINI_API_KEY missing in blip-protocol-ui/.env.local");
          const body = await readBody(req);
          const { prompt, filename, model } = JSON.parse(body.toString("utf8"));
          if (!prompt || !filename) throw new Error("prompt and filename required");
          const safe = sanitizeFilename(basename(filename, extname(filename)), ".png");
          const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-2.5-flash-image"}:generateContent?key=${apiKey}`;
          const r = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseModalities: ["IMAGE"] },
            }),
          });
          if (!r.ok) {
            const text = await r.text();
            throw new Error(`Gemini ${r.status}: ${text.slice(0, 300)}`);
          }
          const data = await r.json();
          const parts = data?.candidates?.[0]?.content?.parts || [];
          const imgPart = parts.find((p) => p.inlineData?.data);
          if (!imgPart) throw new Error("no image in Gemini response");
          const buf = Buffer.from(imgPart.inlineData.data, "base64");
          writeFileSync(resolve(ILL_DIR, safe), buf);
          const url = `/illustrations/${safe}?t=${Date.now()}`;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true, path: url, filename: safe, bytes: buf.length }));
        } catch (err) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: false, error: String(err.message || err) }));
        }
      });
    },
  };
}
