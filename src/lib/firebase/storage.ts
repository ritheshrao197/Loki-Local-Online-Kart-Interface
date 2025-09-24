
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Uploads a file to Firebase Storage.
 * @param file The file to upload.
 * @param path The path in Firebase Storage where the file should be stored (e.g., 'products/images/').
 * @returns A promise that resolves with the public download URL of the uploaded file.
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  // Create a unique file name to prevent overwrites
  const fileName = `${path}${Date.now()}-${file.name}`;
  const storageRef = ref(storage, fileName);

  try {
    // Upload the file to the specified path
    const snapshot = await uploadBytes(storageRef, file);

    // Get the public URL of the uploaded file
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error);
    throw new Error('Failed to upload image.');
  }
}
