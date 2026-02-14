# Wallet Connection Flow

## Overview

The platform enforces **mandatory wallet connection** for all campaign-related activities. Users must link their Solana wallet to their account before they can participate in any reward-earning tasks, including Twitter verification campaigns.

---

## 🔐 Authentication & Wallet Linking Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    Enter email & password
                              ↓
                    Receive OTP via email
                              ↓
                      Verify OTP code
                              ↓
        ┌─────────────────────────────────────────┐
        │    User Account Created (no wallet)      │
        │    Status: WAITLISTED                    │
        │    walletLinked: false                   │
        └─────────────────────────────────────────┘
                              ↓
                      User logs in
                              ↓
        ┌─────────────────────────────────────────┐
        │         DASHBOARD LOADS                  │
        │  Checks: user.walletLinked === false?   │
        └─────────────────────────────────────────┘
                              ↓
                           YES │
                              ↓
        ┌─────────────────────────────────────────┐
        │   WalletLinkingModal Auto-Opens          │
        │   (Required = true, cannot be closed)    │
        └─────────────────────────────────────────┘
                              ↓
            User connects Solana wallet
            (Phantom, Solflare, etc.)
                              ↓
        ┌─────────────────────────────────────────┐
        │    Click "Link Wallet to Account"       │
        │    POST /api/auth/link-wallet            │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │   Backend Validation:                    │
        │   • Wallet not linked to another user   │
        │   • Valid Solana address format          │
        │   • User authenticated                   │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │   Database Updated:                      │
        │   user.wallet_address = "So1ana..."     │
        │   user.walletLinked = true              │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │   Wallet Entry Created:                  │
        │   Wallet {                               │
        │     wallet_address: "So1ana...",        │
        │     userId: user._id,                   │
        │     timestamp: Date.now()               │
        │   }                                      │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │   Modal Closes Automatically             │
        │   User now has full dashboard access     │
        └─────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │  Can now participate in campaigns:       │
        │  • Twitter verification                  │
        │  • Other reward tasks                    │
        └─────────────────────────────────────────┘
```

---

## 🎯 Implementation Details

### 1. **Dashboard Wallet Check**
Location: [Dashboard.tsx:716-719](blip-protocol-ui-test/src/pages/Dashboard.tsx#L716-L719)

```typescript
useEffect(() => {
  if (user && !user.walletLinked && booted) {
    setShowWalletLinkingModal(true);
  }
}, [user, booted]);
```

**Behavior:**
- Automatically opens `WalletLinkingModal` when user hasn't linked wallet
- Runs after dashboard boot sequence completes
- Cannot be closed when `required={true}`

---

### 2. **Campaign Wallet Verification**
Location: [Dashboard.tsx:779-788](blip-protocol-ui-test/src/pages/Dashboard.tsx#L779-L788)

```typescript
const handleTaskClick = (task) => {
  // Special handling for Twitter task
  if (task.id === "s2") {
    // Check if wallet is linked
    if (!user?.walletLinked || !publicKey) {
      showToast("Please link your wallet first", "error");
      setShowWalletLinkingModal(true);
      return;
    }
    setShowTwitterModal(true);
    return;
  }
  // ...
};
```

**Behavior:**
- Checks wallet connection before opening campaign modal
- Shows error toast if wallet not linked
- Opens `WalletLinkingModal` to prompt user
- Prevents unauthorized campaign participation

---

### 3. **Backend Wallet Linking**
Location: [auth.controller.js:595-662](server/controller/auth.controller.js#L595-L662)

**Endpoint:** `POST /api/auth/link-wallet`

**Request:**
```json
{
  "wallet_address": "So1ana...Wa11et"
}
```

**Validation:**
1. ✅ User authenticated (via JWT cookie)
2. ✅ Wallet address provided
3. ✅ Valid Solana format (32-44 characters, base58)
4. ✅ Wallet not already linked to another account
5. ✅ User exists in database

**Success Response:**
```json
{
  "success": true,
  "message": "Wallet linked successfully",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "wallet_address": "So1ana...Wa11et",
    "walletLinked": true
  }
}
```

**Error Responses:**
- `400` - Wallet address missing or invalid format
- `404` - User not found
- `409` - Wallet already linked to another account
- `500` - Server error

---

### 4. **Twitter Verification Wallet Check**
Location: [twitter.controller.js](server/controller/twitter.controller.js)

```javascript
// Check if wallet is linked to this user
if (!user.walletLinked || user.wallet_address !== wallet_address) {
  return res.status(403).json({
    success: false,
    message: "Wallet not linked to your account. Please link your wallet first.",
  });
}
```

**Behavior:**
- Verifies wallet is linked before processing tweet verification
- Ensures wallet address matches user's linked wallet
- Prevents unauthorized reward claims

---

## 🗄️ Database Schema

### User Model
Location: [user.model.js:51-62](server/models/user.model.js#L51-L62)

```javascript
{
  wallet_address: {
    type: String,
    required: false,
    unique: true,
    sparse: true, // Allow null but enforce uniqueness when set
    index: true,
  },
  walletLinked: {
    type: Boolean,
    default: false,
  }
}
```

### Wallet Model
```javascript
{
  wallet_address: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  wallet_connection_timestamp: {
    type: Date,
    required: true,
  }
}
```

### TweetVerification Model
```javascript
{
  userId: ObjectId (ref: User),
  walletAddress: String, // Stored for audit trail
  tweetId: String (unique),
  // ... other fields
}
```

---

## 🔄 Wallet State Consistency

### Frontend-Backend Sync

**AuthContext** ([AuthContext.tsx:88-97](blip-protocol-ui-test/src/contexts/AuthContext.tsx#L88-L97))

```typescript
useEffect(() => {
  // If wallet is connected and user has a linked wallet, verify addresses match
  if (connected && publicKey && user?.wallet_address && user.walletLinked) {
    if (user.wallet_address !== publicKey.toBase58()) {
      console.warn("⚠️ Wallet mismatch detected");
      // User might have switched wallets
    }
  }
}, [connected, publicKey, user]);
```

**Behavior:**
- Monitors wallet connection state
- Warns if connected wallet doesn't match linked wallet
- Allows manual re-linking in settings (future feature)

---

## 🛡️ Security Features

### 1. **One Wallet Per User**
- Database constraint: `wallet_address` is unique
- Backend validation prevents duplicate linking
- Returns `409 Conflict` if wallet already used

### 2. **Authenticated Linking Only**
- `/api/auth/link-wallet` is a protected route
- Requires valid JWT cookie
- User must be logged in

### 3. **Format Validation**
- Solana addresses: 32-44 characters, base58 encoded
- Invalid formats rejected with `400 Bad Request`

### 4. **Audit Trail**
- Wallet linking timestamp recorded
- Wallet address stored in tweet verifications
- IP address and user agent logged

---

## 📱 User Experience

### WalletLinkingModal Features
Location: [WalletLinkingModal.tsx](blip-protocol-ui-test/src/components/WalletLinkingModal.tsx)

**UI States:**
1. **Not Connected** - Shows WalletMultiButton
2. **Connected** - Shows "Link Wallet to Account" button
3. **Linking** - Loading state with spinner
4. **Success** - Green checkmark, auto-closes after 2s
5. **Error** - Red error message with retry option

**Required Mode:**
- When `required={true}`:
  - No close (X) button
  - Cannot click outside to close
  - Must link wallet to continue

**Optional Mode:**
- When `required={false}`:
  - Shows close button
  - "Skip for Now" button in footer
  - Can dismiss modal

---

## 🧪 Testing Wallet Flow

### Manual Test Steps

1. **Register New User:**
   ```
   POST /api/auth/register
   {
     "email": "test@example.com",
     "password": "Test1234"
   }
   ```

2. **Verify Email with OTP:**
   ```
   POST /api/auth/verify-otp
   {
     "email": "test@example.com",
     "otp": "123456"
   }
   ```

3. **Login:**
   ```
   POST /api/auth/login
   {
     "email": "test@example.com",
     "password": "Test1234"
   }
   ```
   Response includes: `walletLinked: false`

4. **Dashboard Opens:**
   - WalletLinkingModal automatically appears
   - Cannot close modal (required mode)

5. **Connect Wallet:**
   - Click WalletMultiButton
   - Select wallet provider (Phantom, Solflare, etc.)
   - Approve connection

6. **Link Wallet:**
   - Click "Link Wallet to Account"
   - POST /api/auth/link-wallet sent
   - Success: Modal closes, wallet now linked

7. **Verify Linked State:**
   ```
   GET /api/user/me
   ```
   Response includes:
   ```json
   {
     "wallet_address": "So1ana...Wa11et",
     "walletLinked": true
   }
   ```

8. **Test Campaign Access:**
   - Click "Share on X (Twitter)" task
   - TwitterVerificationModal should open (not wallet modal)
   - Can now complete verification

---

## 🔧 Configuration

### Environment Variables

No additional configuration needed for wallet linking. Uses existing settings:

```env
# Frontend
VITE_API_URL=http://localhost:4400

# Backend
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:8082
```

### Wallet Providers

Supported via Solana Wallet Adapter:
- Phantom
- Solflare
- Backpack
- Ledger
- Trezor
- Any wallet supporting Solana standards

---

## 🚧 Future Enhancements

- [ ] Add wallet unlinking in user settings
- [ ] Allow wallet re-linking (switch wallets)
- [ ] Multi-wallet support (link multiple wallets)
- [ ] Wallet verification via signature
- [ ] Display wallet balance on dashboard
- [ ] Wallet activity history
- [ ] Export wallet transaction logs

---

## 📊 Database Queries

### Check Wallet Linking Status

```javascript
// Count linked wallets
db.users.countDocuments({ walletLinked: true })

// Find users without wallets
db.users.find({ walletLinked: false })

// Find wallet by address
db.wallets.findOne({ wallet_address: "So1ana..." })

// Find user by wallet
db.users.findOne({ wallet_address: "So1ana..." })
```

### Wallet Linking Analytics

```javascript
// Total linked wallets
db.users.aggregate([
  { $match: { walletLinked: true } },
  { $count: "total" }
])

// Linking rate (% of users with wallets)
db.users.aggregate([
  {
    $group: {
      _id: null,
      total: { $sum: 1 },
      linked: {
        $sum: { $cond: ["$walletLinked", 1, 0] }
      }
    }
  },
  {
    $project: {
      linkingRate: {
        $multiply: [{ $divide: ["$linked", "$total"] }, 100]
      }
    }
  }
])
```

---

## 🐛 Troubleshooting

### "Please link your wallet first" Error

**Cause:** User trying to access campaign without linking wallet

**Solution:**
1. Check `user.walletLinked` in database
2. Verify wallet connection in browser
3. Try linking wallet again
4. Clear cookies and re-login

### "This wallet is already linked to another account"

**Cause:** Wallet address already exists in database

**Solution:**
1. User should login to original account
2. Or use a different wallet
3. Contact support to unlink (if legitimate)

### Wallet Mismatch Warning

**Cause:** Connected wallet doesn't match linked wallet

**Solution:**
1. Disconnect current wallet
2. Connect the correct linked wallet
3. Or unlink and re-link new wallet

### Modal Won't Close

**Cause:** Modal is in required mode (wallet not linked)

**Solution:**
- This is intentional behavior
- User must link wallet to continue
- Ensures compliance with campaign rules

---

**Last Updated:** February 2026
**Version:** 1.0.0
