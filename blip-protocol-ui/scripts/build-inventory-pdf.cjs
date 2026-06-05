/* Converts WEBSITE_INVENTORY.md -> styled HTML -> PDF (via Edge headless).
   Usage: node scripts/build-inventory-pdf.cjs */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { marked } = require("marked");

const root = path.resolve(__dirname, "..");
const mdPath = path.join(root, "WEBSITE_INVENTORY.md");
const htmlPath = path.join(root, "public", "blip-website-inventory.html");
const pdfPath = path.join(root, "public", "blip-website-inventory.pdf");

const md = fs.readFileSync(mdPath, "utf8");
const body = marked.parse(md);

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Blip.money — Complete Website Inventory</title>
<style>
  @page { size: A4; margin: 16mm 14mm; }
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1a1a1a; font-size: 10.5px; line-height: 1.5; margin: 0;
    -webkit-print-color-adjust: exact; print-color-adjust: exact;
  }
  h1 { font-size: 23px; letter-spacing: -0.02em; margin: 0 0 4px; color: #0b0b0c; }
  h2 { font-size: 16px; margin: 22px 0 8px; padding-top: 8px; border-top: 2px solid #cc785c;
       color: #0b0b0c; page-break-after: avoid; }
  h3 { font-size: 12.5px; margin: 14px 0 5px; color: #b85c3e; page-break-after: avoid; }
  h4 { font-size: 11px; margin: 10px 0 4px; color: #333; page-break-after: avoid; }
  p { margin: 5px 0; }
  a { color: #b85c3e; text-decoration: none; }
  code { font-family: "SFMono-Regular", Consolas, Menlo, monospace; font-size: 9.5px;
         background: #f4efe9; padding: 1px 4px; border-radius: 3px; color: #8a3f23; }
  pre { background: #1a1a1d; color: #e6e6e6; padding: 12px 14px; border-radius: 6px;
        overflow-x: auto; font-size: 8.6px; line-height: 1.42; page-break-inside: avoid;
        white-space: pre; }
  pre code { background: none; color: inherit; padding: 0; font-size: inherit; }
  table { border-collapse: collapse; width: 100%; margin: 8px 0; font-size: 9.2px;
          page-break-inside: avoid; }
  th, td { border: 1px solid #ddd; padding: 4px 7px; text-align: left; vertical-align: top; }
  th { background: #f4efe9; color: #6b3a26; font-weight: 700; }
  tr:nth-child(even) td { background: #faf8f5; }
  ul, ol { margin: 5px 0; padding-left: 20px; }
  li { margin: 2px 0; }
  blockquote { margin: 8px 0; padding: 6px 12px; border-left: 3px solid #cc785c;
               background: #faf8f5; color: #444; }
  hr { border: none; border-top: 1px solid #e5ded5; margin: 16px 0; }
  strong { color: #0b0b0c; }
  .cover { padding: 6px 0 14px; border-bottom: 2px solid #cc785c; margin-bottom: 12px; }
  .cover .sub { color: #777; font-size: 11px; }
</style></head>
<body>
<div class="cover">
  <h1>Blip<span style="font-style:italic;font-weight:600;"> money</span> — Complete Website Inventory</h1>
  <div class="sub">Pages · Routes · Sections · Buttons · Forms · User Flows · Sitemap · Dependencies</div>
</div>
${body}
</body></html>`;

fs.writeFileSync(htmlPath, html, "utf8");
console.log("HTML written:", htmlPath);

const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const fileUrl = "file:///" + htmlPath.replace(/\\/g, "/");

try { fs.unlinkSync(pdfPath); } catch (_) {}

execFileSync(edge, [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${pdfPath}`,
  fileUrl,
], { stdio: "inherit" });

if (fs.existsSync(pdfPath)) {
  const kb = (fs.statSync(pdfPath).size / 1024).toFixed(1);
  console.log(`PDF written: ${pdfPath} (${kb} KB)`);
} else {
  console.error("PDF was not produced.");
  process.exit(1);
}
