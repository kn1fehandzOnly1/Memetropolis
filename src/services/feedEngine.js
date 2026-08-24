import { INITIAL_POSTS, CATEGORIES } from './mockData';

class FeedEngine {
  constructor() {
    this.posts = this.loadPosts();
  }

  loadPosts() {
    try {
      const savedPosts = localStorage.getItem('viraldrop_posts');
      if (!savedPosts) return INITIAL_POSTS;

      const parsed = JSON.parse(savedPosts);
      // Filter out invalid posts
      return Array.isArray(parsed) ? parsed : INITIAL_POSTS;
    } catch (e) {
      console.error('Failed to load posts from LocalStorage:', e);
      return INITIAL_POSTS;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('viraldrop_posts', JSON.stringify(this.posts));
    } catch (e) {
      console.error('LocalStorage write error:', e);
    }
  }

  getPosts(category = 'hot', searchQuery = '') {
    let filtered = [...this.posts];

    // Filter by Category
    if (category && category !== 'hot') {
      if (category === 'trending') {
        filtered.sort((a, b) => b.upvotes - a.upvotes);
      } else if (category === 'fresh') {
        // keep newest first
      } else {
        filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  votePost(postId, direction) {
    // direction: 1 for upvote, -1 for downvote, 0 to cancel
    this.posts = this.posts.map(post => {
      if (post.id === postId) {
        let currentVote = post.userVote || 0;
        let up = post.upvotes;
        let down = post.downvotes;

        if (currentVote === direction) {
          // Cancel vote
          if (direction === 1) up--;
          if (direction === -1) down--;
          currentVote = 0;
        } else {
          // Remove previous vote
          if (currentVote === 1) up--;
          if (currentVote === -1) down--;

          // Apply new vote
          if (direction === 1) up++;
          if (direction === -1) down++;
          currentVote = direction;
        }

        return { ...post, upvotes: up, downvotes: down, userVote: currentVote };
      }
      return post;
    });

    this.saveToStorage();
    return this.posts;
  }

  addComment(postId, commentText, user) {
    if (!commentText.trim()) return this.posts;

    const newComment = {
      id: `c_${Date.now()}`,
      author: user.username,
      avatar: user.avatar,
      badge: user.isProPlus ? 'PRO+' : user.isPro ? 'PRO' : null,
      text: commentText,
      upvotes: 1,
      createdAt: 'Just now',
      replies: []
    };

    this.posts = this.posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          commentCount: post.commentCount + 1,
          comments: [newComment, ...(post.comments || [])]
        };
      }
      return post;
    });

    this.saveToStorage();
    return this.posts;
  }

  addAwardToPost(postId, award) {
    this.posts = this.posts.map(post => {
      if (post.id === postId) {
        const awards = [...(post.awards || [])];
        const existingIdx = awards.findIndex(a => a.id === award.id);

        if (existingIdx > -1) {
          awards[existingIdx] = {
            ...awards[existingIdx],
            count: awards[existingIdx].count + 1
          };
        } else {
          awards.push({ id: award.id, count: 1, icon: award.icon });
        }

        return { ...post, awards };
      }
      return post;
    });

    this.saveToStorage();
    return this.posts;
  }

  createPost(newPostData, authorUser) {
    const newPost = {
      id: `post_${Date.now()}`,
      title: newPostData.title,
      category: newPostData.category || 'memes',
      type: newPostData.type || 'image',
      mediaUrl: newPostData.mediaUrl,
      aspectRatio: '16/9',
      author: {
        username: authorUser.username,
        avatar: authorUser.avatar,
        badge: authorUser.isProPlus ? 'PRO+' : authorUser.isPro ? 'PRO' : null,
      },
      upvotes: 1,
      downvotes: 0,
      userVote: 1,
      commentCount: 0,
      createdAt: 'Just now',
      tags: newPostData.tags || ['meme', 'fresh'],
      isSponsored: false,
      awards: [],
      comments: []
    };

    this.posts = [newPost, ...this.posts];
    this.saveToStorage();
    return newPost;
  }
}

export const feedEngine = new FeedEngine();
