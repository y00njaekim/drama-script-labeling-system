import { Database } from "@/types/supabase";

export type Maybe<T> = T | null;

export type APIResponse = {
  message: string;
  status?: number;
};

export type Video = Database['public']['Tables']['videos']['Row'];

export type VideoPoolWithVideoAndLabel = Database['public']['Tables']['video_pools']['Row'] & {
  video: Database['public']['Tables']['videos']['Row']
  } & {
    labels: Pick<Database['public']['Tables']['labels']['Row'], 'para_text' | 'created_at'>[]
};