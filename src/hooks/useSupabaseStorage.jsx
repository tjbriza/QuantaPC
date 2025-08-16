// custom hook for supabase bucket storage interactions :)
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export function useSupabaseStorage(bucketName) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //upload to bucket and return url
  const uploadFile = async (filePath, file, upsert = false) => {
    setLoading(true);
    setError(null);

    try {
      if (!file) {
        throw new Error('No file provided for upload');
      }

      const fileName = filePath || `${Date.now()}-${file.name}`;

      //upload to bucket
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: upsert,
        });

      if (uploadError) {
        console.log('Upload error:', uploadError);
        throw uploadError;
      }

      //get public url
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucketName).getPublicUrl(fileName);

      return { data: { ...data, publicUrl }, error: null };
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  //delete file from bucket

  const deleteFile = async (filePath) => {
    setLoading(true);
    setError(null);

    try {
      if (!filePath) {
        throw new Error('No file path provided for deletion');
      }

      //delete file from bucket
      const { data, error: storageDeleteError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageDeleteError) {
        throw storageDeleteError;
      }
    } catch (err) {
      setError(err);
      return { data: null, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, deleteFile, loading, error };
}
