// Netlify Edge wrapper. The handler in ../../api/rates.ts is a plain
// (Request) => Promise<Response> function, so it needs no platform-specific
// adaptation — we just re-export it. Keeping the logic in api/ means the
// same code still runs on Vercel/Cloudflare/anything else that speaks Web APIs.
import handler from "../../api/rates.ts";

export default handler;
