import type { LoaderFunction } from "react-router";

const hashtagToHashtagIdCache: { [key: string]: string } = {};

export const loader: LoaderFunction = async ({ params }) => {
  const userId = process.env.IG_USER_ID;
  const { hashtag } = params;
  const pageAccessToken = process.env.PAGE_ACCESS_TOKEN;

  if (!userId || !hashtag || !pageAccessToken) {
    console.log(userId, hashtag, pageAccessToken);
    throw new Response("Missing parameter", { status: 400 });
  }

  let hashtagId = hashtagToHashtagIdCache[hashtag];

  if (!hashtagId) {
    const hashtagSearchParams = new URLSearchParams({
      user_id: userId,
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
    user_id: userId,
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
