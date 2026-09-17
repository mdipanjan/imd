import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '../lib/site';
import { postHref, selectPosts } from '../lib/posts.mjs';

export async function GET(context) {
  const posts = selectPosts(await getCollection('posts'));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postHref(post),
    })),
  });
}
