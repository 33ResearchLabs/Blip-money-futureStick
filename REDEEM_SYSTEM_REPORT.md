# Blip Redeem System — Deep Implementation Report

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Database Design](#3-database-design)
4. [Backend Implementation](#4-backend-implementation)
5. [Telegram Bot Implementation](#5-telegram-bot-implementation)
6. [Frontend Implementation](#6-frontend-implementation)
7. [API Reference](#7-api-reference)
8. [Security Design](#8-security-design)
9. [User Flows](#9-user-flows)
10. [File Map](#10-file-map)
11. [Testing Guide](#11-testing-guide)

---

## 1. Overview

The Redeem System allows Telegram bot users (both regular users and merchants) to link their Telegram accounts to their Blip.money website accounts. Once linked, points earned on both platforms are aggregated and displayed together.

**Key Features:**
- OTP-based two-way verification (secure 6-digit code)
- One-click linking via secure URL token (no OTP/role exposed in URL)
- Role-based flow (user vs merchant → different login/register pages)
- Points aggregation (website + Telegram points summed at read time)
- Auto-verification when user is already logged in
- LocalStorage persistence through login/register redirects
- Rate limiting, TTL auto-cleanup, duplicate prevention

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        TELEGRAM                                  │
│                                                                  │
│  ┌──────────────┐          ┌──────────────────┐                 │
│  │  User Bot     │          │  Merchant Bot     │                │
│  │  (Telegraf)   │          │  (node-telegram)  │                │
│  │               │          │                   │                │
│  │  /redeem cmd  │          │  /redeem cmd      │                │
│  │  → OTP + URL  │          │  → OTP + URL      │                │
│  └──────┬───────┘          └──────┬────────────┘                │
│         │                         │                              │
│         │  role: "user"           │  role: "merchant"            │
│         │                         │                              │
│         └──────────┬──────────────┘                              │
│                    │                                             │
│                    ▼                                             │
│         ┌──────────────────┐                                    │
│         │  RedeemToken DB   │  (MongoDB collection)             │
│         │                   │                                   │
│         │  otp: "482910"    │                                   │
│         │  linkToken: "a3f" │                                   │
│         │  telegram_id      │                                   │
│         │  role: user/merch │                                   │
│         │  expiresAt (TTL)  │                                   │
│         └──────────────────┘                                    │
└─────────────────────────────────────────────────────────────────┘

                              │
            URL: /redeem?token=<random64hex>
                              │
                              ▼

┌─────────────────────────────────────────────────────────────────┐
│                     BLIP.MONEY WEBSITE                           │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Frontend (React)                                         │   │
│  │                                                           │   │
│  │  /redeem page (RedeemTelegram.tsx)                        │   │
│  │  ┌─────────────────────────────────────────────────────┐  │   │
│  │  │ State 1: Loading (checking auth + status)           │  │   │
│  │  │ State 2: Not Logged In → Register/Login buttons     │  │   │
│  │  │          (calls GET /token-info for role detection)  │  │   │
│  │  │ State 3: Logged In + Token → Auto-verify            │  │   │
│  │  │          (calls POST /verify-token)                  │  │   │
│  │  │ State 4: Already Linked → Points breakdown          │  │   │
│  │  │ State 5: OTP Form → Manual entry fallback           │  │   │
│  │  │          (calls POST /verify)                        │  │   │
│  │  │ State 6: Success → "Successfully Linked!"           │  │   │
│  │  └─────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Backend (Express API)                                    │   │
│  │                                                           │   │
│  │  GET  /api/redeem/token-info   → Public (role lookup)     │   │
│  │  POST /api/redeem/verify-token → Protected (auto-link)    │   │
│  │  POST /api/redeem/verify       → Protected (OTP link)     │   │
│  │  GET  /api/redeem/status       → Protected (check status) │   │
│  │                                                           │   │
│  │  Links: User.telegramUserId = RedeemToken.telegram_id     │   │
│  │         User.telegramVerified = true                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Database Collections                                     │   │
│  │                                                           │   │
│  │  users (website)     ←──bridge──→  bot_users (telegram)   │   │
│  │  telegramUserId ─────────────────→ telegram_id            │   │
│  │  totalBlipPoints                   points                 │   │
│  │                                                           │   │
│  │  users (website)     ←──bridge──→  merchants (telegram)   │   │
│  │  telegramUserId ─────────────────→ telegram_id            │   │
│  │  totalBlipPoints                   tier, status            │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Design

### 3.1 RedeemToken Model

**File:** `server/models/redeemToken.model.js`

```javascript
import mongoose from "mongoose";

const redeemTokenSchema = new mongoose.Schema(
  {
    otp: {
      type: String,
      required: true,
      index: true,
    },
    linkToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    telegram_id: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "merchant"],
      default: "user",
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    used: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("RedeemToken", redeemTokenSchema);
```

**Field-by-Field Explanation:**

| Field | Type | Purpose | Why |
|-------|------|---------|-----|
| `otp` | String | 6-digit code for manual entry | `index: true` → fast DB lookup when user types OTP |
| `linkToken` | String | 64-char random hex for URL button | `unique: true` → no duplicates. `sparse: true` → allows multiple null values (only indexes non-null). Used in URL so nobody can guess it |
| `telegram_id` | String | Which Telegram user generated this | Links to `BotUser.telegram_id` or `Merchant.telegram_id` |
| `role` | String | `"user"` or `"merchant"` | Tells backend which collection to check (`bot_users` vs `merchants`) |
| `expiresAt` | Date | When this token expires | `expireAfterSeconds: 0` = MongoDB TTL index. Auto-deletes document when this time passes. Set to `now + 5 minutes` |
| `used` | Boolean | Single-use flag | After successful verification, set to `true` so it can't be reused |
| `attempts` | Number | Rate-limit counter | Counts failed OTP attempts. After 5, token is invalidated |

### 3.2 User Model (Existing Fields Used)

**File:** `server/models/user.model.js` (lines 113-122)

```javascript
telegramUserId: {
  type: String,
  sparse: true,
  index: true,
},
telegramVerified: {
  type: Boolean,
  default: false,
},
```

These fields are the **bridge** between website and Telegram. When linking:
- `telegramUserId` = the Telegram user's ID (same as `BotUser.telegram_id`)
- `telegramVerified` = `true` means the link is confirmed

### 3.3 Points Storage (No Merging)

Points stay where they were earned:
- **Website points** → `User.totalBlipPoints`
- **Telegram points** → `BotUser.points`
- **Total** = calculated at read time: `User.totalBlipPoints + BotUser.points`

This design means:
- No data migration needed
- Each platform keeps its own point system
- If we ever unlink, no data is lost

---

## 4. Backend Implementation

### 4.1 Controller — `server/controller/redeem.controller.js`

This file has **4 exported functions** (endpoints):

#### `verifyRedeemOTP` — Manual OTP Verification

```javascript
export const verifyRedeemOTP = async (req, res) => {
  const { otp } = req.body;       // OTP from frontend form
  const userId = req.user._id;     // From JWT auth middleware
```

**Logic flow:**
1. Validate OTP format (must be 6-digit string)
2. Check if user already has a linked Telegram → reject if yes
3. Find `RedeemToken` by OTP (must be `used: false` and not expired)
4. Check rate limit (max 5 attempts per token)
5. Increment attempt counter
6. Check if this Telegram is already linked to ANOTHER website user
7. Look up bot record (`BotUser` or `Merchant` based on `role`)
8. **Link accounts** → `User.telegramUserId = token.telegram_id`
9. Mark token as used
10. Return points breakdown

**Key MongoDB queries explained:**

```javascript
// Find valid OTP token
const token = await RedeemToken.findOne({
  otp,                            // Match the OTP code
  used: false,                    // Not already used
  expiresAt: { $gt: new Date() }, // $gt = "greater than" = not expired
});

// Check for duplicate link (another user with same telegram)
const existingLink = await User.findOne({
  telegramUserId: token.telegram_id,
  telegramVerified: true,
  _id: { $ne: userId },  // $ne = "not equal" = exclude current user
});

// The actual linking
await User.findByIdAndUpdate(userId, {
  telegramUserId: token.telegram_id,
  telegramVerified: true,
});
```

#### `verifyLinkToken` — Auto-Verify via Secure URL Token

Same logic as `verifyRedeemOTP` but:
- Looks up by `linkToken` instead of `otp`
- No attempt rate-limiting needed (token is 64 chars, can't be guessed)
- Called automatically when user clicks the button URL

```javascript
const redeemToken = await RedeemToken.findOne({
  linkToken: token,   // 64-char hex from URL
  used: false,
  expiresAt: { $gt: new Date() },
});
```

#### `getTokenInfo` — Public Role Lookup

**No auth required.** Returns only the `role` for a given `linkToken`.

```javascript
export const getTokenInfo = async (req, res) => {
  const { token } = req.query;  // GET param: ?token=xxx

  const redeemToken = await RedeemToken.findOne({
    linkToken: token,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  return res.json({
    success: true,
    data: { role: redeemToken.role || "user" },
  });
};
```

**Why this exists:** The URL is `/redeem?token=xxx` — no role in URL. When an unauthenticated user opens this link, the frontend needs to know if they should show merchant login or user login. This endpoint provides that answer without exposing any sensitive data.

#### `getRedeemStatus` — Check Link Status

Called on page load to check if user already has a linked Telegram:

```javascript
export const getRedeemStatus = async (req, res) => {
  const user = req.user;

  // Not linked
  if (!user.telegramUserId || !user.telegramVerified) {
    return res.json({ data: { linked: false, ... } });
  }

  // Linked — get points from both collections
  const botUser = await BotUser.findOne({ telegram_id: user.telegramUserId });
  const merchant = await Merchant.findOne({ telegram_id: user.telegramUserId });

  return res.json({
    data: {
      linked: true,
      websitePoints,
      telegramPoints: botUser?.points || 0,
      totalPoints: websitePoints + (botUser?.points || 0),
    },
  });
};
```

### 4.2 Routes — `server/routes/redeem.route.js`

```javascript
import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  verifyRedeemOTP,
  verifyLinkToken,
  getTokenInfo,
  getRedeemStatus
} from "../controller/redeem.controller.js";

const router = Router();

router.get("/token-info", getTokenInfo);              // PUBLIC — no auth
router.post("/verify", protect, verifyRedeemOTP);     // PROTECTED — requires login
router.post("/verify-token", protect, verifyLinkToken); // PROTECTED — requires login
router.get("/status", protect, getRedeemStatus);      // PROTECTED — requires login

export default router;
```

**Why `token-info` is public:** It only returns `role` (no sensitive data). Unauthenticated users need this to see the correct login page.

**Why others use `protect`:** Linking accounts and checking status require knowing WHO the logged-in user is.

### 4.3 Server Mount — `server/server.js`

```javascript
// Import (line 22)
import redeemRoutes from "./routes/redeem.route.js";

// Mount (line 149)
app.use("/api/redeem", redeemRoutes);
```

This makes all routes available under `/api/redeem/...`.

---

## 5. Telegram Bot Implementation

### 5.1 User Bot — `server/User_bot/handlers/redeem.js`

**Library:** Telegraf (grammY-style context object)

```javascript
import crypto from "crypto";
import BotUser from "../../models/botUser.model.js";
import User from "../../models/user.model.js";
import RedeemToken from "../../models/redeemToken.model.js";

const WEBSITE_URL = process.env.CLIENT_URL?.split(",")[0]?.trim() || "https://blip.money";
const OTP_EXPIRY_MINUTES = 5;

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}
```

**`crypto.randomInt(100000, 999999)`** — Generates a cryptographically secure random integer between 100000 and 999999 (always 6 digits). More secure than `Math.random()`.

**`crypto.randomBytes(32).toString("hex")`** — Generates 32 random bytes and converts to a 64-character hex string. This is the `linkToken` used in the URL. With 256 bits of entropy, it's impossible to guess.

**Full handler logic:**

```javascript
export async function handleRedeem(ctx) {
  const telegramId = String(ctx.from.id);

  // Step 1: Check onboarding
  const botUser = await BotUser.findOne({ telegram_id: telegramId });
  if (!botUser || !botUser.onboarded) {
    return ctx.reply("You need to complete onboarding first.");
  }

  // Step 2: Check if already linked
  const linkedUser = await User.findOne({
    telegramUserId: telegramId,
    telegramVerified: true,
  });
  if (linkedUser) {
    return ctx.reply(`Already Linked to ${linkedUser.email}...`);
  }

  // Step 3: Invalidate old tokens
  await RedeemToken.updateMany(
    { telegram_id: telegramId, used: false },
    { $set: { used: true } },
  );

  // Step 4: Generate new OTP + linkToken
  const otp = generateOTP();
  const linkToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Step 5: Save to database
  await RedeemToken.create({
    otp, linkToken,
    telegram_id: telegramId,
    role: "user",
    expiresAt,
  });

  // Step 6: Send message with OTP + button
  const redeemUrl = `${WEBSITE_URL}/redeem?token=${linkToken}`;
  await ctx.reply(`OTP: ${otp}`, {
    reply_markup: {
      inline_keyboard: [[{ text: "Link to Blip.money", url: redeemUrl }]],
    },
  });
}
```

**Wired in `server/User_bot/index.js`:**
```javascript
import { handleRedeem } from './handlers/redeem.js';
bot.command('redeem', handleRedeem);
```

### 5.2 Merchant Bot — `server/Merchant_bot/handlers/redeemHandler.js`

**Library:** node-telegram-bot-api (different API — uses `bot.sendMessage(chatId, ...)`)

Same logic as User bot but:
- Checks `Merchant` collection instead of `BotUser`
- Sets `role: "merchant"` in the token
- Shows merchant tier info in messages

```javascript
export async function handleRedeem(bot, msg) {
  const chatId = msg.chat.id;
  const telegramId = String(msg.from.id);

  // ... same flow but with Merchant model
  await RedeemToken.create({ otp, linkToken, telegram_id: telegramId, role: "merchant", expiresAt });
}
```

**Wired in `server/Merchant_bot/index.js`:**
```javascript
import { handleRedeem } from './handlers/redeemHandler.js';
bot.onText(/^\/redeem$/, (msg) => handleRedeem(bot, msg));
```

---

## 6. Frontend Implementation

### 6.1 API Service — `blip-protocol-ui-test/src/services/Airdrop.ts`

```typescript
// PUBLIC — no auth needed
getTokenInfo: async (token: string) => {
  const response = await api.get(`/redeem/token-info?token=${token}`);
  return response;
},

// PROTECTED — requires auth cookie
verifyRedeemOTP: async (otp: string) => {
  const response = await api.post("/redeem/verify", { otp });
  return response;
},

// PROTECTED — requires auth cookie
verifyLinkToken: async (token: string) => {
  const response = await api.post("/redeem/verify-token", { token });
  return response;
},

// PROTECTED — requires auth cookie
getRedeemStatus: async () => {
  const response = await api.get("/redeem/status");
  return response;
},
```

The `api` instance is an Axios client with `withCredentials: true` — this sends the HTTP-only JWT cookie with every request.

### 6.2 Route Setup — `blip-protocol-ui-test/src/App.tsx`

```typescript
const RedeemTelegram = lazy(() => import("./pages/Waitlist/RedeemTelegram"));

// In the router (public — NOT wrapped in ProtectedRoute)
<Route path="/redeem" element={<RedeemTelegram />} />
```

**Why public?** Because users coming from Telegram may not be logged in yet. The page handles auth internally.

### 6.3 Redeem Page — `blip-protocol-ui-test/src/pages/Waitlist/RedeemTelegram.tsx`

#### State Variables

```typescript
const [otp, setOtp] = useState(["", "", "", "", "", ""]);     // 6 separate input values
const [loading, setLoading] = useState(false);                 // API call in progress
const [checking, setChecking] = useState(true);                // Initial status check
const [error, setError] = useState("");                        // Error message
const [success, setSuccess] = useState<VerifyResult | null>(null); // Successful link result
const [status, setStatus] = useState<RedeemStatus | null>(null);   // Existing link status
const [tokenVerifying, setTokenVerifying] = useState(false);       // Auto-verify in progress
const [redeemRole, setRedeemRole] = useState("user");              // "user" or "merchant"
```

#### localStorage Keys (for persistence through login/register)

```typescript
const REDEEM_OTP_KEY = "blip_redeem_otp";       // Saves OTP through navigation
const REDEEM_ROLE_KEY = "blip_redeem_role";      // Saves role through navigation
const REDEEM_TOKEN_KEY = "blip_redeem_token";    // Saves linkToken through navigation
```

**Why localStorage?** When an unauthenticated user clicks the bot link:
1. They land on `/redeem?token=xxx`
2. They click "Log In" → navigate to `/waitlist`
3. After login, they come back to `/redeem`
4. The `?token=xxx` URL param is LOST
5. localStorage preserves it through the navigation

#### Effect 1 — Save URL Params

```typescript
useEffect(() => {
  if (initialized.current) return;
  initialized.current = true;

  const urlToken = searchParams.get("token");
  if (urlToken) localStorage.setItem(REDEEM_TOKEN_KEY, urlToken);

  const urlOtp = searchParams.get("otp");
  // ... save OTP if present

  const urlRole = searchParams.get("role");
  if (urlRole) localStorage.setItem(REDEEM_ROLE_KEY, urlRole);
}, [searchParams]);
```

Runs once on mount. Saves everything to localStorage immediately.

#### Effect 2 — Fetch Role from Token

```typescript
useEffect(() => {
  const savedRole = localStorage.getItem(REDEEM_ROLE_KEY);
  if (savedRole) return;  // Already know the role
  if (!linkToken) return;  // No token to look up

  const fetchRole = async () => {
    const res = await airdropApi.getTokenInfo(linkToken);
    if (res.success && res.data?.role) {
      setRedeemRole(res.data.role);
      localStorage.setItem(REDEEM_ROLE_KEY, res.data.role);
    }
  };
  fetchRole();
}, [linkToken]);
```

Calls the public `GET /token-info` endpoint. This tells us if the user came from the merchant bot or user bot, so we show the correct login buttons.

#### Effect 3 — Check Existing Link Status

```typescript
useEffect(() => {
  if (isLoading) return;
  if (!isAuthenticated) { setChecking(false); return; }

  const checkStatus = async () => {
    const res = await airdropApi.getRedeemStatus();
    if (res.success) setStatus(res.data);
    setChecking(false);
  };
  checkStatus();
}, [isAuthenticated, isLoading]);
```

Only runs when authenticated. Checks if this user already has a linked Telegram account.

#### Effect 4 — Auto-Verify via Token

```typescript
useEffect(() => {
  if (isLoading || checking) return;         // Wait for auth + status check
  if (!isAuthenticated || !linkToken) return; // Need both
  if (success || status?.linked) return;      // Already done
  if (tokenVerifying) return;                 // Already in progress

  const verifyToken = async () => {
    setTokenVerifying(true);
    setLoading(true);

    const res = await airdropApi.verifyLinkToken(linkToken);
    if (res.success) {
      setSuccess(res.data);
      localStorage.removeItem(REDEEM_TOKEN_KEY);
      localStorage.removeItem(REDEEM_OTP_KEY);
      localStorage.removeItem(REDEEM_ROLE_KEY);
    } else {
      setError("Link verification failed. Try entering the OTP manually.");
    }
    setLoading(false);
  };
  verifyToken();
}, [isAuthenticated, isLoading, checking, linkToken, success, status, tokenVerifying]);
```

**This is the magic.** When user is logged in AND has a linkToken, it automatically calls `POST /verify-token` — no OTP input needed. The user just sees a loading spinner and then success.

#### Render States (6 screens)

```
┌──────────────────────────────────┐
│ if (isLoading || checking)       │ → Spinner
│ if (tokenVerifying && loading)   │ → "Linking your Telegram account..."
├──────────────────────────────────┤
│ if (!isAuthenticated)            │ → Register / Login buttons
│                                  │   (merchant vs user based on role)
│                                  │   Token/OTP saved in localStorage
├──────────────────────────────────┤
│ if (status?.linked)              │ → "Telegram Linked" + points
├──────────────────────────────────┤
│ if (success)                     │ → "Successfully Linked!" + points
├──────────────────────────────────┤
│ else                             │ → OTP input form (6 digits)
│                                  │   with paste support
│                                  │   "Verify & Link" button
└──────────────────────────────────┘
```

#### OTP Input Handling

```typescript
// Each digit is a separate input
const handleChange = (index: number, value: string) => {
  if (!/^\d*$/.test(value)) return;  // Only digits
  const newOtp = [...otp];
  newOtp[index] = value.slice(-1);   // Take last char only
  setOtp(newOtp);
  if (value && index < 5) {
    inputRefs.current[index + 1]?.focus();  // Auto-advance to next
  }
};

// Backspace goes to previous input
const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputRefs.current[index - 1]?.focus();
  }
};

// Paste fills all 6 digits at once
const handlePaste = (e: React.ClipboardEvent) => {
  e.preventDefault();
  const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
  if (pasted.length === 6) {
    setOtp(pasted.split(""));
    inputRefs.current[5]?.focus();
  }
};
```

### 6.4 Dashboard Integration — `blip-protocol-ui-test/src/pages/Waitlist/Dashboard.tsx`

Two banners added to the dashboard:

**Not Linked Banner:**
```typescript
{telegramLink && !telegramLink.linked && (
  <div className="...blue gradient banner...">
    <h3>Link Telegram Bot</h3>
    <p>Use /redeem in the bot to get an OTP code.</p>
    <button onClick={() => navigate("/redeem")}>Link Telegram</button>
  </div>
)}
```

**Linked Banner (with aggregated points):**
```typescript
{telegramLink && telegramLink.linked && (
  <div className="...green banner...">
    <p>Telegram Linked @{telegramLink.telegram_username}</p>
    <span>Website: {websitePoints}</span>
    <span>Telegram: {telegramPoints}</span>
    <span>Total: {totalPoints}</span>
  </div>
)}
```

---

## 7. API Reference

### `GET /api/redeem/token-info?token=xxx`

**Auth:** None (public)

| Param | Type | Location | Required |
|-------|------|----------|----------|
| token | string | query | Yes |

**Success Response (200):**
```json
{
  "success": true,
  "data": { "role": "user" }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Token not found or expired."
}
```

---

### `POST /api/redeem/verify-token`

**Auth:** Required (JWT cookie via `protect` middleware)

| Param | Type | Location | Required |
|-------|------|----------|----------|
| token | string | body | Yes |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Telegram account linked successfully!",
  "data": {
    "role": "user",
    "telegram_username": "john_doe",
    "telegram_name": "John",
    "websitePoints": 150,
    "telegramPoints": 300,
    "totalPoints": 450
  }
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 400 | "Invalid link token." |
| 400 | "Your account is already linked to a Telegram account." |
| 400 | "Invalid or expired link." |
| 409 | "This Telegram account is already linked to another Blip account." |
| 404 | "Telegram bot account not found." |

---

### `POST /api/redeem/verify`

**Auth:** Required

| Param | Type | Location | Required |
|-------|------|----------|----------|
| otp | string (6 digits) | body | Yes |

**Success Response (200):**
```json
{
  "success": true,
  "message": "Telegram account linked successfully!",
  "data": {
    "role": "user",
    "telegram_username": "john_doe",
    "websitePoints": 150,
    "telegramPoints": 300,
    "totalPoints": 450
  }
}
```

**Additional Error:**
| Status | Message |
|--------|---------|
| 429 | "Too many attempts. Please generate a new OTP." |

---

### `GET /api/redeem/status`

**Auth:** Required

**Success Response — Not Linked (200):**
```json
{
  "success": true,
  "data": {
    "linked": false,
    "websitePoints": 150,
    "telegramPoints": 0,
    "totalPoints": 150
  }
}
```

**Success Response — Linked (200):**
```json
{
  "success": true,
  "data": {
    "linked": true,
    "telegram_username": "john_doe",
    "telegram_name": "John",
    "merchant": null,
    "websitePoints": 150,
    "telegramPoints": 300,
    "totalPoints": 450
  }
}
```

---

## 8. Security Design

### 8.1 URL Security

**Before (insecure):**
```
/redeem?otp=482910&role=merchant
```
Anyone could read the OTP and role from the URL.

**After (secure):**
```
/redeem?token=a3f7b2c891d4e6f0...  (64 random hex chars)
```
- Cannot decode to OTP, role, or user info
- 256 bits of entropy (2^256 possible values)
- `crypto.randomBytes(32)` — cryptographically secure

### 8.2 Token Lifecycle

```
Created → Used → Deleted
  │         │       │
  │         │       └── TTL auto-delete after expiresAt
  │         └── Marked used=true after successful verify
  └── Created when user types /redeem in bot
```

### 8.3 Rate Limiting (OTP)

```javascript
if (token.attempts >= MAX_ATTEMPTS) {  // MAX_ATTEMPTS = 5
  token.used = true;   // Invalidate
  await token.save();
  return res.status(429)...
}
token.attempts += 1;
await token.save();
```

After 5 wrong OTP guesses, the token is permanently invalidated.

### 8.4 Duplicate Link Prevention

```javascript
// Check if Telegram already linked to ANOTHER website account
const existingLink = await User.findOne({
  telegramUserId: token.telegram_id,
  telegramVerified: true,
  _id: { $ne: userId },   // Not the current user
});
```

One Telegram account can only be linked to one website account.

### 8.5 Previous Token Invalidation

```javascript
// Before creating new token, invalidate all old ones
await RedeemToken.updateMany(
  { telegram_id: telegramId, used: false },
  { $set: { used: true } },
);
```

Only the most recent OTP/token is valid. Old ones can't be reused.

### 8.6 Auth Protection

- `protect` middleware reads JWT from HTTP-only cookie
- HTTP-only cookies can't be accessed by JavaScript (XSS protection)
- `withCredentials: true` on Axios sends cookie automatically
- Only `token-info` is public (returns only role, no sensitive data)

---

## 9. User Flows

### Flow A: User Clicks Button (Already Logged In)

```
1. User types /redeem in Telegram User Bot
2. Bot generates OTP="482910", linkToken="a3f7b2..."
3. Bot saves RedeemToken to MongoDB
4. Bot sends message with OTP + button URL

5. User clicks button → browser opens /redeem?token=a3f7b2...
6. Frontend saves token to localStorage
7. Frontend calls GET /redeem/status → { linked: false }
8. Frontend auto-calls POST /verify-token { token: "a3f7b2..." }
9. Backend finds RedeemToken by linkToken
10. Backend links User.telegramUserId = telegram_id
11. Backend returns { success: true, totalPoints: 450 }
12. Frontend shows "Successfully Linked!" screen
13. Frontend clears localStorage
```

### Flow B: User Clicks Button (NOT Logged In)

```
1. User types /redeem in Telegram User Bot
2. Bot sends message with OTP + button URL

3. User clicks button → browser opens /redeem?token=a3f7b2...
4. Frontend saves token to localStorage
5. Frontend calls GET /token-info → { role: "user" }
6. Frontend shows "Create Account" / "Log In" buttons (user pages)

7. User clicks "Log In" → navigates to /waitlist
8. User logs in → navigates back to /redeem
9. Frontend reads token from localStorage
10. Frontend auto-verifies (same as Flow A step 8-13)
```

### Flow C: Merchant Clicks Button (NOT Logged In)

```
1. Merchant types /redeem in Telegram Merchant Bot
2. Bot sends message with OTP + button URL

3. Merchant clicks button → /redeem?token=b4c8d9...
4. Frontend saves token to localStorage
5. Frontend calls GET /token-info → { role: "merchant" }
6. Frontend shows "Create Merchant Account" / "Log In" buttons
   (merchant register → /merchant-register)
   (merchant login → /merchant-waitlist)

7. Merchant logs in → back to /redeem → auto-verifies
```

### Flow D: Manual OTP Entry

```
1. User types /redeem in bot → gets OTP="482910"
2. User opens blip.money/redeem manually
3. User types 482910 in the 6-digit input
4. User clicks "Verify & Link"
5. Frontend calls POST /verify { otp: "482910" }
6. Backend verifies → links accounts
7. Success screen shown
```

### Flow E: Already Linked User

```
1. User (already linked) types /redeem in bot
2. Bot checks User.findOne({ telegramUserId, telegramVerified: true })
3. Bot finds existing link → shows "Already Linked" message

4. User visits /redeem on website
5. Frontend calls GET /status → { linked: true, points... }
6. Shows "Telegram Linked" with points breakdown
```

---

## 10. File Map

```
server/
├── models/
│   ├── redeemToken.model.js    ← NEW: Token schema (OTP + linkToken)
│   ├── user.model.js           ← EXISTING: telegramUserId, telegramVerified
│   ├── botUser.model.js        ← EXISTING: telegram_id, points
│   └── botMerchant.model.js    ← EXISTING: telegram_id, tier
│
├── controller/
│   └── redeem.controller.js    ← NEW: 4 endpoints (verify, verify-token, token-info, status)
│
├── routes/
│   └── redeem.route.js         ← NEW: Route definitions
│
├── server.js                   ← EDITED: Mounted /api/redeem routes
│
├── User_bot/
│   ├── index.js                ← EDITED: Added /redeem command
│   └── handlers/
│       └── redeem.js           ← NEW: User bot redeem handler
│
└── Merchant_bot/
    ├── index.js                ← EDITED: Added /redeem command
    └── handlers/
        └── redeemHandler.js    ← NEW: Merchant bot redeem handler

blip-protocol-ui-test/src/
├── services/
│   └── Airdrop.ts              ← EDITED: Added 4 redeem API methods
│
├── pages/Waitlist/
│   ├── RedeemTelegram.tsx      ← NEW: Full redeem page (6 states)
│   └── Dashboard.tsx           ← EDITED: Telegram link banners
│
└── App.tsx                     ← EDITED: Added /redeem route (public)
```

---

## 11. Testing Guide

### Test 1: User Bot → New User (Not Logged In)

1. Open Telegram → User Bot → complete onboarding
2. Earn some points via tasks
3. Type `/redeem`
4. Click "Link to Blip.money" button
5. Should see Register/Login page (user type)
6. Register → come back to `/redeem`
7. Should auto-verify → "Successfully Linked!"

**Expected:** Website + Telegram points both shown

### Test 2: User Bot → Already Logged In

1. Log in to blip.money first
2. Type `/redeem` in bot → click button
3. Should auto-link immediately

**Expected:** No OTP needed, instant success

### Test 3: Manual OTP

1. Log in to website
2. Type `/redeem` in bot → copy the 6-digit OTP
3. Go to `blip.money/redeem` → type OTP → click "Verify & Link"

**Expected:** "Successfully Linked!"

### Test 4: Already Linked

1. After linking, type `/redeem` in bot again
2. Visit `/redeem` on website

**Expected:** Both show "Already Linked" with points

### Test 5: Merchant Flow

1. Type `/redeem` in Merchant Bot
2. Click button → should show merchant login/register
3. Log in as merchant → auto-verify

**Expected:** Shows merchant tier info

### Test 6: Dashboard

1. Link accounts (any test above)
2. Visit dashboard

**Expected:** Green banner with Website Points + Telegram Points + Total

### Test 7: Expired OTP

1. Type `/redeem` → wait 5+ minutes → try to use

**Expected:** "Invalid or expired" error

### Test 8: Duplicate Prevention

1. Link Telegram A to Website Account 1
2. Try to link Telegram A to Website Account 2

**Expected:** "This Telegram account is already linked to another Blip account."

### Test 9: URL Security

1. Type `/redeem` in bot
2. Check the button URL

**Expected:** URL only contains `?token=<64-char-hex>` — no OTP, no role visible
