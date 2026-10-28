import { error } from '@sveltejs/kit';
import { posts } from '../../../lib/posts.js';

// Find one article by its URL slug and show a standard 404 for unknown slugs.
export function load({ params }) {
  const post = posts.find((article) => article.slug === params.slug);

  if (!post) {
    error(404, 'Article not found');
  }

  return { post };
}
