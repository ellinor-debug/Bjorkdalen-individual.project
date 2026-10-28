import { posts } from '../lib/posts.js';

// Load the articles for the homepage; this sample source can later be replaced by Neon.
export function load() {
  return { posts };
}
