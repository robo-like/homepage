import { eq } from "drizzle-orm";
import type { LoaderFunction } from "react-router";
import { getUserSubscriptionDetails } from "~/lib/billing/stripe";
import { db } from "~/lib/db";
import { accessTokens, users } from "~/lib/db/schema";

const hashtagToHashtagIdCache: { [key: string]: string } = {};

export const loader: LoaderFunction = async ({ request, params }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Response("Missing Authorization header", { status: 401 });
  }
  const accessToken = authHeader.slice(7);

  const token = await db
    .select()
    .from(accessTokens)
    .where(eq(accessTokens.token, accessToken))
    .get();

  if (!token) {
    throw new Response("Invalid access token", { status: 401 });
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, token.userId))
    .get();

  if (!user) {
    throw new Response("User not found", { status: 401 });
  }

  const subscriptionDetails = await getUserSubscriptionDetails(token.userId);

  // If not subscribed, check if trial is active
  if (!subscriptionDetails.subscribed) {
    const trialExpiresAt = new Date(
      user.createdAt.getTime() + 3 * 24 * 60 * 60 * 1000
    );

    if (trialExpiresAt < new Date()) {
      throw new Response("Payment required", { status: 402 });
    }
  }

  const igUserId = process.env.IG_USER_ID;
  const { hashtag } = params;
  const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;

  if (!igUserId || !hashtag || !pageAccessToken) {
    console.log(igUserId, hashtag, pageAccessToken);
    throw new Response("Missing parameter", { status: 400 });
  }

  let hashtagId = hashtagToHashtagIdCache[hashtag];

  if (!hashtagId) {
    const hashtagSearchParams = new URLSearchParams({
      user_id: igUserId,
      q: hashtag,
      access_token: pageAccessToken,
    });

    const hashtagSearchResponse = await fetch(
      `https://graph.facebook.com/v21.0/ig_hashtag_search?${hashtagSearchParams}`
    );

    const { data } = await hashtagSearchResponse.json();
    if (!data?.[0]?.id) {
      throw new Response(`Could not find hashtag ID for #${hashtag}`, {
        status: 400,
      });
    }

    hashtagId = data[0].id;
    hashtagToHashtagIdCache[hashtag] = hashtagId;
  }

  const recentMediaParams = new URLSearchParams({
    fields:
      "id,media_url,permalink,caption,media_type,like_count,comments_count,timestamp",
    access_token: pageAccessToken,
    user_id: igUserId,
    limit: "10",
  });

  const postsResponse = await fetch(
    `https://graph.facebook.com/v21.0/${hashtagId}/recent_media?${recentMediaParams}`
  );
  const { data: posts } = await postsResponse.json();

  return {
    posts,
  };
};
