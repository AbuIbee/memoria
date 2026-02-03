import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export function FileUploader() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [fileType, setFileType] = useState<'image' | 'audio' | 'document'>('image');

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Please select a file to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      // Choose bucket based on file type
      let bucket = '';
      switch (fileType) {
        case 'image': bucket = 'memory-photos'; break;
        case 'audio': bucket = 'music-files'; break;
        case 'document': bucket = 'user-documents'; break;
      }

      const { data: user } = await supabase.auth.getUser();
      const userFolder = user.user?.id || 'anonymous';
      
      const filePath = `${userFolder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      setFileUrl(publicUrl);
      alert('File uploaded successfully!');
      
    } catch (error) {
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h3 className="text-xl font-bold mb-4">Upload Files</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">File Type</label>
        <select 
          value={fileType} 
          onChange={(e) => setFileType(e.target.value as any)}
          className="w-full p-2 border rounded"
        >
          <option value="image">Photo/Image</option>
          <option value="audio">Music/Audio</option>
          <option value="document">Document/PDF</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Choose File</label>
        <input
          type="file"
          onChange={handleUpload}
          disabled={uploading}
          accept={
            fileType === 'image' ? 'image/*' :
            fileType === 'audio' ? 'audio/*' :
            'application/pdf,application/msword'
          }
          className="w-full p-2 border rounded"
        />
      </div>

      {uploading && <p className="text-blue-500">Uploading...</p>}
      
      {fileUrl && (
        <div className="mt-4">
          <p className="text-sm text-green-600">Upload successful!</p>
          {fileType === 'image' && (
            <img src={fileUrl} alt="Uploaded" className="mt-2 max-w-full h-auto rounded" />
          )}
          {fileType === 'audio' && (
            <audio controls className="mt-2 w-full">
              <source src={fileUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <p className="text-xs mt-2 break-all">URL: {fileUrl}</p>
        </div>
      )}
    </div>
  );
}