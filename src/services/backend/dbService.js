// Production Database Service Layer for ViralDrop (Firestore + Abstracted Storage)

import { db } from './firebase.config';
import { activeStorageAdapter } from './storageAdapter';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  onSnapshot,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp
} from 'firebase/firestore';

export class DbService {
  /**
   * Fetch Feed Posts (Supports Category, Ranking, & Pagination)
   */
  static async getPosts(category = 'hot', maxLimit = 20) {
    try {
      const postsRef = collection(db, 'posts');
      let q;

      if (category === 'trending') {
        q = query(postsRef, orderBy('upvotes', 'desc'), limit(maxLimit));
      } else if (category === 'fresh') {
        q = query(postsRef, orderBy('createdAt', 'desc'), limit(maxLimit));
      } else if (category !== 'hot') {
        q = query(postsRef, where('category', '==', category), limit(maxLimit));
      } else {
        q = query(postsRef, orderBy('createdAt', 'desc'), limit(maxLimit));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      console.warn('Firestore fetch error, fallback to local feed:', e);
      return [];
    }
  }

  /**
   * Create Meme Post with Abstracted Media Storage Upload
   */
  static async createPost(file, postData, authorUser, onUploadProgress) {
    let mediaResult = { url: postData.mediaUrl || '' };

    // If binary file provided, upload using active Storage Adapter (Firebase or S3)
    if (file) {
      const destinationPath = `memes/${Date.now()}_${file.name}`;
      mediaResult = await activeStorageAdapter.uploadFile(file, destinationPath, onUploadProgress);
    }

    const postDocRef = doc(collection(db, 'posts'));
    const newPost = {
      id: postDocRef.id,
      title: postData.title,
      category: postData.category || 'memes',
      type: postData.type || 'image',
      mediaUrl: mediaResult.url,
      storagePath: mediaResult.path || '',
      storageProvider: mediaResult.provider || 'firebase',
      author: {
        id: authorUser.id || 'usr_anonymous',
        username: authorUser.username,
        avatar: authorUser.avatar,
        badge: authorUser.isProPlus ? 'PRO+' : authorUser.isPro ? 'PRO' : null
      },
      upvotes: 1,
      downvotes: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      tags: postData.tags || ['meme'],
      awards: {},
      isSponsored: false
    };

    await setDoc(postDocRef, newPost);
    return newPost;
  }

  /**
   * Toggle Creator Subscription
   */
  static async toggleSubscribeCreator(subscriberUserId, creatorUsername) {
    const userRef = doc(db, 'users', subscriberUserId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return false;

    const following = userDoc.data().following || [];
    const isSubbed = following.includes(creatorUsername);

    if (isSubbed) {
      await updateDoc(userRef, { following: arrayRemove(creatorUsername) });
    } else {
      await updateDoc(userRef, { following: arrayUnion(creatorUsername) });
    }

    return !isSubbed;
  }

  /**
   * Add Comment to Post
   */
  static async addComment(postId, commentText, authorUser) {
    const commentRef = doc(collection(db, 'posts', postId, 'comments'));
    const postRef = doc(db, 'posts', postId);

    const newComment = {
      id: commentRef.id,
      author: authorUser.username,
      avatar: authorUser.avatar,
      badge: authorUser.isProPlus ? 'PRO+' : authorUser.isPro ? 'PRO' : null,
      text: commentText,
      upvotes: 1,
      createdAt: serverTimestamp(),
      replies: []
    };

    await setDoc(commentRef, newComment);
    await updateDoc(postRef, { commentCount: increment(1) });

    return newComment;
  }
}
