// Enterprise Abstracted Storage Provider System for ViralDrop
// Supports Firebase Cloud Storage, Amazon S3, and Cloudflare R2 via Adapter Pattern

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase.config';

/**
 * Storage Interface Contract
 */
class IStorageAdapter {
  async uploadFile(file, destinationPath, onProgress) {
    throw new Error('uploadFile method must be implemented');
  }
  async deleteFile(destinationPath) {
    throw new Error('deleteFile method must be implemented');
  }
  async getDownloadUrl(destinationPath) {
    throw new Error('getDownloadUrl method must be implemented');
  }
  async getPresignedUploadUrl(filename, contentType) {
    throw new Error('getPresignedUploadUrl method must be implemented');
  }
}

/**
 * Firebase Cloud Storage Implementation
 */
export class FirebaseStorageAdapter extends IStorageAdapter {
  async uploadFile(file, destinationPath, onProgress) {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, destinationPath);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Firebase upload error:', error);
          reject(error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            provider: 'firebase',
            path: destinationPath,
            url: downloadUrl,
            sizeBytes: file.size,
            mimeType: file.type
          });
        }
      );
    });
  }

  async deleteFile(destinationPath) {
    const storageRef = ref(storage, destinationPath);
    await deleteObject(storageRef);
    return true;
  }

  async getDownloadUrl(destinationPath) {
    const storageRef = ref(storage, destinationPath);
    return await getDownloadURL(storageRef);
  }

  async getPresignedUploadUrl(filename, contentType) {
    // Firebase uses direct client uploads via SDK, presigned URL fallback returns mock URL or Cloud Function endpoint
    return {
      uploadUrl: `https://storage.googleapis.com/viraldrop-app.appspot.com/${filename}`,
      method: 'POST'
    };
  }
}

/**
 * AWS S3 / Cloudflare R2 Direct Upload Implementation
 */
export class AWSS3StorageAdapter extends IStorageAdapter {
  constructor() {
    super();
    this.s3Bucket = import.meta.env.VITE_AWS_S3_BUCKET || 'viraldrop-media-bucket';
    this.cdnDomain = import.meta.env.VITE_AWS_CLOUDFRONT_DOMAIN || 'https://d12345.cloudfront.net';
    this.apiEndpoint = import.meta.env.VITE_S3_PRESIGNED_API || '/api/s3/presigned-url';
  }

  async uploadFile(file, destinationPath, onProgress) {
    // Step 1: Request S3 presigned URL from API backend
    const { uploadUrl, key } = await this.getPresignedUploadUrl(destinationPath, file.type);

    // Step 2: Perform direct HTTP PUT binary upload to S3 bucket
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);

      if (xhr.upload && onProgress) {
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 204) {
          const finalCdnUrl = `${this.cdnDomain}/${key}`;
          resolve({
            provider: 's3',
            path: key,
            url: finalCdnUrl,
            sizeBytes: file.size,
            mimeType: file.type
          });
        } else {
          reject(new Error(`S3 Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during S3 upload'));
      xhr.send(file);
    });
  }

  async deleteFile(destinationPath) {
    // Call server-side API to delete object from S3 bucket securely
    const res = await fetch('/api/s3/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: destinationPath })
    });
    return res.ok;
  }

  async getDownloadUrl(destinationPath) {
    return `${this.cdnDomain}/${destinationPath}`;
  }

  async getPresignedUploadUrl(filename, contentType) {
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, contentType })
      });
      return await response.json();
    } catch (e) {
      // Fallback for local testing without server backend
      return {
        uploadUrl: `https://${this.s3Bucket}.s3.amazonaws.com/${filename}`,
        key: filename
      };
    }
  }
}

/**
 * Storage Adapter Factory - Dynamically resolves storage provider based on environment config
 */
class StorageAdapterFactory {
  static getAdapter() {
    const provider = (import.meta.env.VITE_STORAGE_PROVIDER || 'firebase').toLowerCase();

    switch (provider) {
      case 's3':
      case 'aws':
      case 'cloudflare':
        return new AWSS3StorageAdapter();
      case 'firebase':
      default:
        return new FirebaseStorageAdapter();
    }
  }
}

export const activeStorageAdapter = StorageAdapterFactory.getAdapter();
