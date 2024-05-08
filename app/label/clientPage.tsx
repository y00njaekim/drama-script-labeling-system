'use client';

import { addLabel } from "@/lib/dataClient";
import { VideoPoolWithVideoAndLabel } from "@/types/types";
import { useEffect, useState } from "react";

export default function LabelComponent({ uid, pnum, videos }: { uid: number, pnum: number, videos: VideoPoolWithVideoAndLabel[] }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [labeledCountState, setLabeledCountState] = useState(0);
  const [labeledText, setLabeledText] = useState('');

  useEffect(() => {
    if (videos) {
      const index = videos.findIndex((v) => v.videos.labels.length === 0);
      if (index !== -1) {
        setCurrentVideoIndex(index);
      }
      const labeledCount = videos.reduce((count, video) => {
        return video.videos.labels.length !== 0 ? count + 1 : count;
      }, 0);
      setLabeledCountState(labeledCount);
    }
    // TODO: Loading State + Skeleton UI
  }, [])

  const handleLabeledTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLabeledText(event.target.value);
  }
  
  const handleNext = () => {
    if (videos.length - 1 === currentVideoIndex) {
      // TODO: 라벨링 종료 플로우
      return;
    }
    addLabel(videos[currentVideoIndex].videos.id, uid, labeledText);
    setCurrentVideoIndex(currentVideoIndex + 1);
    setLabeledCountState(labeledCountState + 1);
    setLabeledText('');
  }

  return (
    <div>
      <div>pnum: {pnum}</div>
      <div>currentVideoIndex: {currentVideoIndex+1}</div>
      <div>labeledCount: {labeledCountState}</div>

      <video src={videos[currentVideoIndex].videos.url as string} controls></video>
      <div>
        <span>{labeledCountState}</span>/<span>{videos.length}</span>
      </div>
      <div>
        {videos[currentVideoIndex].videos.plain_text}
      </div>
      <div>
        <input type="text" onChange={handleLabeledTextChange}/>
      </div>
      <div>
        <button onClick={handleNext}>다음</button>
      </div>
    </div>
  );
}