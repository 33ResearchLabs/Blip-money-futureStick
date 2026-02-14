# X (Twitter) Campaign Verification Implementation

## Overview

This implementation provides a complete workflow for users to participate in Twitter/X promotional campaigns by sharing about your platform and earning reward points. The system includes:

- **Frontend Modal UI** with multi-step verification workflow
- **Backend API** with X API v2 integration for tweet verification
- **Database tracking** for fraud prevention and duplicate detection
- **Points reward system** integrated with existing user points

---

## 🎯 Features Implemented

### 1. **TwitterVerificationModal Component**
Location: `blip-protocol-ui-test/src/components/TwitterVerificationModal.tsx`

**Features:**
- ✅ Pre-filled campaign message with brand mention
- ✅ "Tweet Now" button that opens Twitter with pre-filled text
- ✅ Tweet URL submission form
- ✅ Real-time verification status (loading, success, error)
- ✅ User-friendly error messages
- ✅ Dark mode support

**Steps:**
1. **Step 1**: Display campaign message and "Tweet Now" button
2. **Step 2**: User submits tweet URL
3. **Step 3**: Verification in progress (loading state)
4. **Step 4**: Success or error feedback

### 2. **Backend API Endpoints**
Location: `server/routes/twitter.route.js`

| Endpoint | Method | Description | Authentication |
|----------|--------|-------------|----------------|
| `/api/twitter/verify` | POST | Verify tweet and award points | Required |
| `/api/twitter/verifications` | GET | Get user's verification history | Required |
| `/api/twitter/campaign-status/:campaignId` | GET | Check if user completed campaign | Required |

### 3. **X API v2 Integration**
Location: `server/services/twitter.service.js`

**Verification Checks:**
- ✅ Tweet exists and is publicly accessible
- ✅ Tweet contains required brand mention (`@BlipMoney`)
- ✅ Tweet contains required keywords (`BlipMoney` or `Blip`)
- ✅ Tweet is not protected/private
- ✅ Tweet meets timing requirements (if configured)

### 4. **Database Model**
Location: `server/models/TweetVerification.model.js`

**Fraud Prevention:**
- Unique tweet ID constraint (prevents duplicate claims)
- User-campaign compound index (one claim per user per campaign)
- Wallet address tracking
- IP address and user agent logging
- Verification status tracking

---

## 🔧 Configuration

### Environment Variables

Add to `server/.env`:

```env
# X (Twitter) API Configuration
TWITTER_BEARER_TOKEN=your_bearer_token_here
TWITTER_CONSUMER_KEY=your_consumer_key_here
TWITTER_CONSUMER_SECRET=your_consumer_secret_here
```

### Getting Twitter API Credentials

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new project and app
3. Navigate to "Keys and Tokens"
4. Generate Bearer Token
5. Copy the Bearer Token to your `.env` file

---

## 🚀 How It Works

### User Flow

```
1. User connects wallet (mandatory)
   ↓
2. User clicks "Share on X (Twitter)" task
   ↓
3. Modal opens with pre-filled message
   ↓
4. User clicks "Tweet Now" → Opens Twitter
   ↓
5. User posts the tweet
   ↓
6. User copies tweet URL and pastes it in modal
   ↓
7. System verifies tweet via X API v2
   ↓
8. Points awarded if verification succeeds
```

### Backend Verification Flow

```javascript
1. Extract tweet ID from URL
2. Check if user already completed campaign → Reject if yes
3. Check if tweet already claimed → Reject if yes
4. Call X API v2 to fetch tweet data
5. Verify tweet requirements:
   - Contains @BlipMoney mention
   - Contains "BlipMoney" keyword
   - Is publicly accessible
6. Save verification to database
7. Award 250 points to user
8. Update user's points history
9. Return success response
```

---

## 🛡️ Compliance & Privacy

This implementation complies with X's Developer Agreement and Policy:

### What We Do ✅
- Only access publicly available tweets
- Use official X API v2 endpoints
- Verify tweets for legitimate campaign participation
- Store minimal data (tweet ID, text, author ID, timestamp)
- Implement fraud prevention (duplicate detection)
- Rate limit API requests (5 verifications per 15 minutes)

### What We Don't Do ❌
- Access private/protected tweets or DMs
- Resell or redistribute X content
- Aggregate tweets into datasets
- Use data for AI training or profiling
- Perform scraping or bulk data collection
- Access non-public account information

### Data Retention
- Tweet data stored only for verification and fraud prevention
- Data retained as long as necessary to prevent duplicate claims
- User can request data deletion (implement if needed)

---

## 📝 API Documentation

### POST `/api/twitter/verify`

**Request Body:**
```json
{
  "tweetId": "1234567890",
  "tweetUrl": "https://twitter.com/user/status/1234567890",
  "walletAddress": "So1ana...Wa11et"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Tweet verified successfully! Points awarded.",
  "data": {
    "pointsAwarded": 250,
    "totalPoints": 1500,
    "verificationId": "mongodb_object_id",
    "tweetText": "Tweet content..."
  }
}
```

**Error Responses:**

```json
// Already completed
{
  "success": false,
  "message": "You have already completed this campaign."
}

// Tweet already claimed
{
  "success": false,
  "message": "This tweet has already been used to claim rewards."
}

// Requirements not met
{
  "success": false,
  "message": "Tweet must mention @BlipMoney",
  "code": "REQUIREMENTS_NOT_MET"
}

// Tweet not found
{
  "success": false,
  "message": "Tweet not found or is not publicly accessible",
  "code": "TWEET_NOT_FOUND"
}
```

---

## 🧪 Testing

### Manual Testing Steps

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start the frontend:**
   ```bash
   cd blip-protocol-ui-test
   npm run dev
   ```

3. **Test the workflow:**
   - Connect your wallet
   - Click "Share on X (Twitter)" task
   - Click "Tweet Now" and post the tweet
   - Copy the tweet URL
   - Paste URL in modal and click "Verify Tweet"
   - Check that points are awarded

### Test Cases

| Test Case | Expected Result |
|-----------|----------------|
| Valid tweet with @BlipMoney | ✅ Success, points awarded |
| Tweet without mention | ❌ Error: "Must mention @BlipMoney" |
| Same tweet twice | ❌ Error: "Already claimed" |
| User tries campaign twice | ❌ Error: "Already completed" |
| Invalid tweet URL | ❌ Error: "Invalid URL" |
| Protected/private tweet | ❌ Error: "Not publicly accessible" |
| Non-existent tweet | ❌ Error: "Tweet not found" |

### Rate Limiting

The verification endpoint is rate-limited to:
- **5 verification attempts per 15 minutes** per user
- Prevents spam and abuse

---

## 🎨 Customization

### Change Campaign Message

Edit `blip-protocol-ui-test/src/components/TwitterVerificationModal.tsx`:

```typescript
const CAMPAIGN_MESSAGE = `Your custom message here
with @BlipMoney mention
#YourHashtags`;
```

### Change Points Reward

Edit `blip-protocol-ui-test/src/components/TwitterVerificationModal.tsx`:

```typescript
const REWARD_POINTS = 250; // Change this value
```

And `server/controller/twitter.controller.js`:

```javascript
const pointsAwarded = 250; // Change this value
```

### Change Verification Requirements

Edit `server/controller/twitter.controller.js`:

```javascript
const verificationResult = await twitterService.verifyTweet(tweetId, {
  requiredMentions: ["@BlipMoney"], // Change mention
  requiredKeywords: ["BlipMoney", "Blip"], // Change keywords
  requiredHashtags: ["#DeFi", "#Web3"], // Add hashtags (optional)
  minCreatedDate: "2025-01-01", // Add date range (optional)
  maxCreatedDate: "2025-12-31",
});
```

---

## 🔍 Database Schema

### TweetVerification Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  walletAddress: String,
  tweetId: String (unique),
  tweetUrl: String,
  tweetText: String,
  tweetAuthorId: String,
  tweetCreatedAt: Date,
  pointsAwarded: Number,
  verificationStatus: String (verified|failed|duplicate),
  campaignId: String,
  ipAddress: String,
  userAgent: String,
  verifiedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `tweetId` (unique)
- `userId + campaignId` (compound, prevents duplicate campaigns)
- `walletAddress + campaignId` (compound)

---

## 🐛 Troubleshooting

### "TWITTER_BEARER_TOKEN not found"
- Check that `.env` file exists in `server/` directory
- Verify the environment variable name is exactly `TWITTER_BEARER_TOKEN`
- Restart the server after updating `.env`

### "Rate limit exceeded"
- You've hit Twitter's API rate limit
- Wait 15 minutes before trying again
- Consider implementing request caching

### "Tweet not found"
- Tweet might be deleted
- Tweet might be protected/private
- Invalid tweet ID in URL

### "Wallet not linked"
- User must link their wallet before verification
- Check `user.walletLinked` and `user.walletAddress` fields

---

## 📊 Analytics & Monitoring

### Useful Database Queries

**Total verifications:**
```javascript
db.tweetverifications.countDocuments({ verificationStatus: "verified" })
```

**Verifications by campaign:**
```javascript
db.tweetverifications.aggregate([
  { $match: { verificationStatus: "verified" } },
  { $group: { _id: "$campaignId", count: { $sum: 1 } } }
])
```

**Top participants:**
```javascript
db.tweetverifications.aggregate([
  { $match: { verificationStatus: "verified" } },
  { $group: { _id: "$userId", totalPoints: { $sum: "$pointsAwarded" } } },
  { $sort: { totalPoints: -1 } },
  { $limit: 10 }
])
```

---

## 🚀 Next Steps & Future Enhancements

- [ ] Add email notification on successful verification
- [ ] Create admin dashboard to view campaign analytics
- [ ] Implement multiple campaign types (different messages/rewards)
- [ ] Add referral tracking (who referred the tweeter)
- [ ] Create leaderboard for top sharers
- [ ] Add image/video verification for tweets with media
- [ ] Implement webhook for real-time tweet monitoring
- [ ] Add Twitter account age verification (prevent bot accounts)

---

## 📄 Files Modified/Created

### Frontend
- ✅ Created: `blip-protocol-ui-test/src/components/TwitterVerificationModal.tsx`
- ✅ Modified: `blip-protocol-ui-test/src/pages/Dashboard.tsx`

### Backend
- ✅ Created: `server/models/TweetVerification.model.js`
- ✅ Created: `server/services/twitter.service.js`
- ✅ Created: `server/controller/twitter.controller.js`
- ✅ Created: `server/routes/twitter.route.js`
- ✅ Modified: `server/server.js`
- ✅ Modified: `server/.env`
- ✅ Modified: `server/package.json` (added axios)

---

## 📞 Support

For questions or issues:
1. Check the troubleshooting section above
2. Review X API documentation: https://developer.twitter.com/en/docs/twitter-api
3. Check server logs for detailed error messages

---

**Last Updated:** February 2026
**Version:** 1.0.0
