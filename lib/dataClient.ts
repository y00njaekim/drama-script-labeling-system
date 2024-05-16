import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';

export const addLabel = async (video_id: number, user_id: number, para_text: string) => {
  const supabase = createClient<Database>();

  const { data, error } = await supabase.from('labels').insert([{ video_id, user_id, para_text }]);

  if (error) {
    console.error('Error adding label:', error);
  } else {
    // console.log('Label added:', data);
  }

  return data;
};
