import { Database } from "@/types/supabase";

export type Maybe<T> = T | null;

export type APIResponse = {
  message: string;
  status?: number;
};

export type Video = Database['public']['Tables']['videos']['Row'];

export type VideoPoolWithVideoAndLabel = Database['public']['Tables']['video_pools']['Row'] & {
  videos: Database['public']['Tables']['videos']['Row'] & {
    labels: Database['public']['Tables']['labels']['Row'][];
  };
  /*
  {
    pnum: 1,
    video_id: 255,
    order: 98,
    videos: {
      id: 255,
      url: 'https://sci-para3.s3.amazonaws.com/drama-video/Admiration_15-1.mp4',
      labels: [],
      emotion: 'Admiration',
      plain_text: '이건 현대미술 같아요.'
    }
  }
  */
};