// Automated Migration Engine: Firebase Storage ➔ Amazon S3 / Cloudflare R2
// Enables bulk media migration without application downtime or broken links

import { db } from './firebase.config';
import { activeStorageAdapter, AWSS3StorageAdapter, FirebaseStorageAdapter } from './storageAdapter';
import { collection, getDocs, updateDoc, doc, query, where, limit } from 'firebase/firestore';

export class S3MigrationEngine {
  /**
   * Migrate batch of meme files from Firebase Storage to AWS S3 / Cloudflare R2
   */
  static async migrateBatch(batchSize = 25, onProgressReport) {
    console.log(`🚀 Starting S3 Migration Batch (${batchSize} items)...`);
    
    // Query posts stored on Firebase
    const postsRef = collection(db, 'posts');
    const q = query(postsRef, where('storageProvider', '==', 'firebase'), limit(batchSize));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('✅ No remaining Firebase files to migrate. All media is hosted on S3/CDN!');
      return { migratedCount: 0, status: 'COMPLETE' };
    }

    const firebaseAdapter = new FirebaseStorageAdapter();
    const s3Adapter = new AWSS3StorageAdapter();
    let migratedCount = 0;

    for (const postDoc of snapshot.docs) {
      const post = postDoc.data();
      const storagePath = post.storagePath;

      if (!storagePath) continue;

      try {
        // 1. Download blob from Firebase Storage
        const downloadUrl = await firebaseAdapter.getDownloadUrl(storagePath);
        const res = await fetch(downloadUrl);
        const blob = await res.blob();

        // 2. Upload blob to Amazon S3 / Cloudflare R2 bucket
        const s3DestinationPath = `migrated/${post.id}_${Date.now()}.jpg`;
        const s3Result = await s3Adapter.uploadFile(blob, s3DestinationPath);

        // 3. Update Firestore document pointer to point to S3 / CloudFront CDN URL
        await updateDoc(doc(db, 'posts', postDoc.id), {
          mediaUrl: s3Result.url,
          storagePath: s3Result.path,
          storageProvider: 's3',
          migratedAt: new Date().toISOString()
        });

        migratedCount++;
        if (onProgressReport) {
          onProgressReport(migratedCount, snapshot.docs.length, post.title);
        }
      } catch (err) {
        console.error(`⚠️ Failed to migrate post ${post.id}:`, err);
      }
    }

    return {
      migratedCount,
      status: 'BATCH_COMPLETE'
    };
  }
}
