// Firebase Storage Adapter for Media Uploads in ViralDrop

import { storage } from './firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export class StorageAdapter {
  /**
   * Uploads a file (File object or Blob) to Firebase Storage
   * @param {File|Blob} file The file to upload
   * @param {string} path Subfolder path, defaults to 'memes'
   * @param {function} onProgress Optional progress callback (percentage)
   * @returns {Promise<string>} Download URL
   */
  static async uploadMedia(file, path = 'memes', onProgress = null) {
    if (!file) throw new Error('No file provided for upload.');

    // Generate unique file name
    const timestamp = Date.now();
    const cleanName = file.name ? file.name.replace(/[^a-zA-Z0-9.-]/g, '_') : 'upload.jpg';
    const filename = `${timestamp}_${cleanName}`;
    const storageRef = ref(storage, `${path}/${filename}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(Math.round(progress));
        },
        (error) => {
          console.error('Storage Upload Error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (e) {
            reject(e);
          }
        }
      );
    });
  }
}
