import axios from "axios";

/**
 * Twitter/X Verification Service
 * Uses the free oEmbed API (no auth required) to verify public tweets
 */
class TwitterService {
  constructor() {
    this.oEmbedUrl = "https://publish.twitter.com/oembed";
  }

  /**
   * Get tweet data using the free oEmbed API
   * No authentication or API key required
   * @param {string} tweetUrl - Full tweet URL
   * @returns {Promise<object>} Tweet data
   */
  async getTweetByUrl(tweetUrl) {
    try {
      const response = await axios.get(this.oEmbedUrl, {
        params: {
          url: tweetUrl,
          omit_script: true,
        },
      });

      // oEmbed returns HTML — extract plain text from it
      const html = response.data.html;
      const tweetText = html
        .replace(/<[^>]*>/g, " ") // strip HTML tags
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();

      const authorName = response.data.author_name || "";
      const authorUrl = response.data.author_url || "";
      // Extract username from author_url (e.g. https://twitter.com/username)
      const authorUsername = authorUrl.split("/").pop() || "";

      return {
        success: true,
        data: {
          text: tweetText,
          author_name: authorName,
          author_username: authorUsername,
          author_url: authorUrl,
          url: response.data.url || tweetUrl,
        },
      };
    } catch (error) {
      console.error(
        "oEmbed API Error:",
        error.response?.status,
        error.response?.data || error.message
      );

      if (error.response?.status === 404) {
        return {
          success: false,
          error: "Tweet not found. Make sure the tweet is public and the URL is correct.",
          code: "TWEET_NOT_FOUND",
        };
      }

      if (error.response?.status === 403) {
        return {
          success: false,
          error: "Tweet is protected or from a private account.",
          code: "ACCESS_DENIED",
        };
      }

      return {
        success: false,
        error: "Could not fetch tweet. Please check the URL and try again.",
        code: "API_ERROR",
      };
    }
  }

  /**
   * Verify tweet meets campaign requirements
   * @param {object} tweetData - Tweet data from oEmbed
   * @param {object} requirements - Campaign requirements
   * @returns {object} Verification result
   */
  verifyTweetRequirements(tweetData, requirements = {}) {
    const {
      requiredMentions = ["@BlipMoney"],
      requiredKeywords = ["BlipMoney"],
    } = requirements;

    const tweetText = tweetData.text;
    const errors = [];

    // Check for required mentions or keywords (case-insensitive)
    const textLower = tweetText.toLowerCase();

    const hasMentions = requiredMentions.some((mention) =>
      textLower.includes(mention.toLowerCase())
    );

    const hasKeywords = requiredKeywords.some((keyword) =>
      textLower.includes(keyword.toLowerCase())
    );

    if (!hasMentions && !hasKeywords) {
      errors.push(
        `Tweet must mention ${requiredMentions.join(" or ")} or contain "${requiredKeywords.join('" or "')}"`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      tweetText,
    };
  }

  /**
   * Full tweet verification workflow
   * @param {string} tweetId - Tweet ID (used for DB tracking)
   * @param {string} tweetUrl - Full tweet URL
   * @param {object} requirements - Campaign requirements
   * @returns {Promise<object>} Verification result
   */
  async verifyTweet(tweetId, tweetUrl, requirements = {}) {
    // Step 1: Get tweet data via free oEmbed API
    const tweetResult = await this.getTweetByUrl(tweetUrl);

    if (!tweetResult.success) {
      return {
        success: false,
        message: tweetResult.error,
        code: tweetResult.code,
      };
    }

    const tweetData = tweetResult.data;

    // Step 2: Verify tweet meets requirements
    const verification = this.verifyTweetRequirements(tweetData, requirements);

    if (!verification.isValid) {
      return {
        success: false,
        message: verification.errors.join(". "),
        code: "REQUIREMENTS_NOT_MET",
        errors: verification.errors,
      };
    }

    // Step 3: Return success with tweet data
    return {
      success: true,
      message: "Tweet verified successfully",
      tweetData: {
        id: tweetId,
        text: tweetData.text,
        authorId: tweetData.author_username,
        createdAt: new Date().toISOString(),
        author: {
          name: tweetData.author_name,
          username: tweetData.author_username,
        },
      },
    };
  }
}

export default new TwitterService();
