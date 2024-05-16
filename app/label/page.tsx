import React from 'react';
import { fetchVideosInServer } from '@/lib/dataServer';
import { VideoPoolWithVideoAndLabel } from '@/types/types';
import { headers } from 'next/headers';
import LabelComponent from '@/app/label/clientPage';

export default async function Page() {
  const pnum: number = parseInt(headers().get('x-pnum') as string);
  const uid: number = parseInt(headers().get('x-uid') as string);
  const videos = (await fetchVideosInServer(pnum)) as VideoPoolWithVideoAndLabel[] | null;

  // TODO(!): 에러페이지
  if (!videos) return <div>데이터가 없습니다</div>;

  return (
    <div>
      <LabelComponent uid={uid} pnum={pnum} videos={videos} />
    </div>
  );
}
