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
    pnum, order,
    video:videos!inner(
      id,
      url,
      emotion,
      plain_text
    ),
    ...videos!inner(
      labels:labels!id(
        para_text,
        created_at
      )
    )
    `)
    // labels:videos!inner(
    //   labels:labels!id(*)
    // )
  .eq('pnum', pnum)
  .order('order')
  

  if (error) {
    console.error('Error fetching unlabeled video:', error);
  } else {
    console.log('Unlabeled video:', data);
  }

  const sortedData = data?.map((item) => ({
    ...item,
    labels: item.labels.sort((a, b) => b.created_at.localeCompare(a.created_at)),
  }));
  
  return sortedData;
}

export const fetchLabelCountInServer = async (pnum: number) => {
  const supabase = createClient<Database>();

  const { data, error } = await supabase
  .from('labels')
  .select(`
    video_id,
    para_text,
    created_at,
    user:users!inner(
      id,
      pnum
    )
  `)
  .eq('user.pnum', pnum)
  
  if (error) {
    console.error('Error fetching label count:', error);
  } else {
    console.log('Label count:', data);
  }

  return data;
}
