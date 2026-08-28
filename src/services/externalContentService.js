/**
 * External Content Service (Scalar Integration)
 * Fetches trending memes and GIFs from Giphy, Tenor, and 9GAG.
 */

const GIPHY_API_KEY = import.meta.env.VITE_GIPHY_API_KEY || 'dc6zaTOxFJmzC'; // Public Beta Key
const TENOR_API_KEY = import.meta.env.VITE_TENOR_API_KEY || '';

export class ExternalContentService {
  /**
   * Fetch Trending GIFs from Giphy
   */
  static async fetchGiphyTrending(limit = 10) {
    try {
      const resp = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}&rating=g`);
      const data = await resp.json();
      return data.data.map(item => ({
        id: `giphy_${item.id}`,
        title: item.title || 'Trending GIF',
        mediaUrl: item.images.fixed_height.url,
        type: 'image',
        category: 'trending',
        author: {
          username: 'GiphyTrending',
          avatar: 'https://giphy.com/static/img/giphy_logo_square_social.png'
        },
        tags: item.slug?.split('-') || ['trending', 'gif'],
        upvotes: Math.floor(Math.random() * 5000) + 1000,
        createdAt: 'Just now',
        isExternal: true,
        source: 'giphy'
      }));
    } catch (e) {
      console.error('Giphy fetch failed:', e);
      return [];
    }
  }

  /**
   * Fetch Trending GIFs from Tenor
   */
  static async fetchTenorTrending(limit = 10) {
    if (!TENOR_API_KEY) return [];
    try {
      const resp = await fetch(`https://tenor.googleapis.com/v2/featured?key=${TENOR_API_KEY}&limit=${limit}`);
      const data = await resp.json();
      return data.results.map(item => ({
        id: `tenor_${item.id}`,
        title: item.title || 'Featured Tenor GIF',
        mediaUrl: item.media_formats.gif.url,
        type: 'image',
        category: 'trending',
        author: {
          username: 'TenorFeatured',
          avatar: 'https://tenor.com/assets/img/tenor-logo.png'
        },
        tags: ['featured', 'tenor'],
        upvotes: Math.floor(Math.random() * 3000) + 500,
        createdAt: 'Just now',
        isExternal: true,
        source: 'tenor'
      }));
    } catch (e) {
      console.error('Tenor fetch failed:', e);
      return [];
    }
  }

  /**
   * Fetch all external content and merge
   */
  static async getViralFeed() {
    const [giphy, tenor] = await Promise.all([
      this.fetchGiphyTrending(15),
      this.fetchTenorTrending(15)
    ]);

    return [...giphy, ...tenor].sort(() => Math.random() - 0.5);
  }
}
