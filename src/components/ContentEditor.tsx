import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';

const contentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content_type: z.enum(['note', 'journal', 'story', 'memory', 'other']),
  content: z.string().min(1, 'Content is required'),
  tags: z.string().optional(),
  is_private: z.boolean().default(true),
});

type ContentFormData = z.infer<typeof contentSchema>;

export function ContentEditor() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
  });

  const onSubmit = async (data: ContentFormData) => {
    setIsSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_content')
        .insert({
          user_id: user.user?.id,
          title: data.title,
          content_type: data.content_type,
          content: data.content,
          tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
          is_private: data.is_private,
        });

      if (error) throw error;
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Failed to save content');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Content</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            {...register('title')}
            className="w-full p-2 border rounded"
            placeholder="Enter title"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content Type</label>
          <select {...register('content_type')} className="w-full p-2 border rounded">
            <option value="note">Note</option>
            <option value="journal">Journal Entry</option>
            <option value="story">Story</option>
            <option value="memory">Memory</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            {...register('content')}
            rows={10}
            className="w-full p-2 border rounded"
            placeholder="Write your content here..."
          />
          {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
          <input
            {...register('tags')}
            className="w-full p-2 border rounded"
            placeholder="family, vacation, 2024"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('is_private')}
            id="is_private"
            className="mr-2"
          />
          <label htmlFor="is_private" className="text-sm">Keep this private</label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save Content'}
        </button>
      </form>
    </div>
  );
}