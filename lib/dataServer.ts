import { createClient } from "@/utils/supabase/server";
import { Database } from "@/types/supabase";


export const fetchUserInServer = async (email: string, pnum: number) => {
  const supabase = createClient<Database>();
  const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
  .eq('pnum', pnum)
  
  if (error) {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export const fetchVideosInServer = async (pnum: number) => {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
  .from('video_pools')
  .select(`
    *,
    videos:video_id (
      id,
      url,
      emotion,
      plain_text,
      labels (
        id,
        video_id,
        user_id,
        para_text
      )
    )
  `)
  .eq('pnum', pnum)
  .order('order')

  if (error) {
    console.error('Error fetching unlabeled video:', error);
  } else {
    console.log('Unlabeled video:', data);
  }

  return data;
}