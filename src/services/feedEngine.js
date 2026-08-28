import { db } from './backend/firebase.config';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  limit,
  increment,
  arrayUnion,
  arrayRemove,
  where,
  getDocs
} from 'firebase/firestore';
import { ExternalContentService } from './externalContentService';

class FeedEngine {
  constructor() {
    this.postsCollection = collection(db, 'posts');
  }

  /**
   * Subscribe to real-time posts
   */
  subscribeToFeed(category = 'hot', onUpdate) {
    let q = query(this.postsCollection, orderBy('createdAt', 'desc'), limit(50));

    if (category && category !== 'hot' && category !== 'fresh' && category !== 'trending') {
      q = query(this.postsCollection, where('category', '==', category.toLowerCase()), orderBy('createdAt', 'desc'), limit(50));
    }

    return onSnapshot(q, async (snapshot) => {
      let posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Handle "trending" sort client-side for now or via Firestore index later
      if (category === 'trending') {
        posts.sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0));
      }

      // If feed is empty, trigger seeding from external sources
      if (posts.length === 0) {
        this.seedInitialContent();
      }

      onUpdate(posts);
    });
  }

  /**
   * Seed Firestore with external content if empty
   */
  async seedInitialContent() {
    try {
      const existing = await getDocs(query(this.postsCollection, limit(1)));
      if (!existing.empty) return;

      console.log('Seeding feed with external viral content...');
      const externalPosts = await ExternalContentService.getViralFeed();

      for (const p of externalPosts) {
        await addDoc(this.postsCollection, {
          ...p,
          createdAt: serverTimestamp(),
          upvotes: Math.floor(Math.random() * 1000),
          downvotes: 0,
          commentCount: 0,
          awards: []
        });
      }
    } catch (e) {
      console.error('Seeding failed:', e);
    }
  }

  async votePost(postId, userId, direction, currentVote = 0) {
    const postRef = doc(db, 'posts', postId);
    const userVoteRef = doc(db, 'users', userId, 'votes', postId); // Optional: track individual votes

    let upIncrement = 0;
    let downIncrement = 0;

    if (currentVote === direction) {
      // Cancel vote
      if (direction === 1) upIncrement = -1;
      if (direction === -1) downIncrement = -1;
    } else {
      // Remove previous
      if (currentVote === 1) upIncrement--;
      if (currentVote === -1) downIncrement--;
      // Add new
      if (direction === 1) upIncrement++;
      if (direction === -1) downIncrement++;
    }

    await updateDoc(postRef, {
      upvotes: increment(upIncrement),
      downvotes: increment(downIncrement)
    });
  }

  async addComment(postId, commentText, user) {
    if (!commentText.trim()) return;

    const postRef = doc(db, 'posts', postId);
    const commentData = {
      author: user.username,
      avatar: user.avatar,
      badge: user.isProPlus ? 'PRO+' : user.isPro ? 'PRO' : null,
      text: commentText,
      upvotes: 0,
      createdAt: new Date().toISOString() // Or serverTimestamp if moving to subcollection
    };

    await updateDoc(postRef, {
      commentCount: increment(1),
      comments: arrayUnion(commentData) // Simplified for prototype, subcollection better for production
    });
  }

  async createPost(newPostData, authorUser) {
    const postData = {
      title: newPostData.title,
      category: newPostData.category || 'memes',
      type: newPostData.type || 'image',
      mediaUrl: newPostData.mediaUrl,
      aspectRatio: '16/9',
      author: {
        id: authorUser.id,
        username: authorUser.username,
        avatar: authorUser.avatar,
        badge: authorUser.isProPlus ? 'PRO+' : authorUser.isPro ? 'PRO' : null,
      },
      upvotes: 1,
      downvotes: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      tags: newPostData.tags || ['fresh'],
      isSponsored: false,
      awards: [],
      comments: []
    };

    return await addDoc(this.postsCollection, postData);
  }

  async addAwardToPost(postId, award) {
    const postRef = doc(db, 'posts', postId);
    // Note: Award logic would be more complex with individual counts in production
    await updateDoc(postRef, {
      awards: arrayUnion({ id: award.id, icon: award.icon, count: 1 })
    });
  }
}

export const feedEngine = new FeedEngine();
