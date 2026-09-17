export const POSTS_PER_PAGE = 8;

/**
 * @template {{ id: string, data: { date: Date, draft: boolean } }} T
 * @param {readonly T[]} posts
 * @param {{ includeDrafts?: boolean }} [options]
 * @returns {T[]}
 */
export function selectPosts(posts, { includeDrafts = false } = {}) {
  return posts
    .filter((post) => includeDrafts || !post.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
}

/** @param {{ id: string }} post */
export const postHref = (post) => `/posts/${post.id}/`;
