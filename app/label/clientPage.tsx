'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { addLabel } from '@/lib/dataClient';
import { VideoPoolWithVideoAndLabel } from '@/types/types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Toggle } from '@/components/ui/toggle';
import RenderGuideDiv from '@/app/label/guide';

const getLatestLabel = (labels: VideoPoolWithVideoAndLabel['labels']) => {
  return labels.reduce((latest, label) => {
    if (latest.created_at < label.created_at) {
      return label;
    }
    return latest;
  }, labels[0]);
};

export default function LabelComponent({
  uid,
  videos,
}: {
  uid: number;
  pnum: number;
  videos: VideoPoolWithVideoAndLabel[];
}) {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [labeledCountState, setLabeledCountState] = useState(0);
  const [labeledStatus, setLabeledStatus] = useState<boolean[]>([]);
  const [initialLabeledText, setInitialLabeledText] = useState('');
  const [inputLabeledText, setInputLabeledText] = useState('');
  const [inputDirty, setInputDirty] = useState(false); // Dirty: initialLabeledText 와 다르면 True
  const [numToMove, setNumToMove] = useState(0);
  const [isLoopToggleOn, setIsLoopToggleOn] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loopVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videos) {
      const index = videos.findIndex((v) => v.labels.length === 0);
      if (index !== -1) {
        setCurrentVideoIndex(index);
      }
    }
  }, []);

  useEffect(() => {
    if (videos) {
      const initialLabeledStatus = videos.map((video) => video.labels.length !== 0);
      setLabeledStatus(initialLabeledStatus);
    }
  }, [videos]);

  useEffect(() => {
    const labeledCount = labeledStatus.filter((status) => status).length;
    setLabeledCountState(labeledCount);
  }, [labeledStatus]);

  useEffect(() => {
    const labels = videos[currentVideoIndex].labels;
    if (videos[currentVideoIndex].labels.length !== 0) {
      const para_text = getLatestLabel(labels).para_text as string;
      setInitialLabeledText(para_text);
      setInputLabeledText(para_text);
    } else {
      setInitialLabeledText('');
      setInputLabeledText('');
    }
    setInputDirty(false);
    setNumToMove(currentVideoIndex + 1);
    setIsLoopToggleOn(false);
  }, [currentVideoIndex]);

  useEffect(() => {
    if (inputLabeledText !== initialLabeledText) {
      setInputDirty(true);
    }
  }, [inputLabeledText]);

  useEffect(() => {
    if (videoRef.current && loopVideoRef.current) {
      if (isLoopToggleOn) {
        videoRef.current.style.display = 'none';
        videoRef.current.pause();
        loopVideoRef.current.style.display = 'block';
        loopVideoRef.current.currentTime = 0;
        loopVideoRef.current.play();
      } else {
        loopVideoRef.current.pause();
        loopVideoRef.current.style.display = 'none';
        videoRef.current.style.display = 'block';
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  }, [isLoopToggleOn]);

  const handleInputLabeledTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLabeledText(event.target.value);
  };

  // SMELL: videos 상태값 클라에서 관리하고 변경... 구리긴 하다
  const handlePrev = () => {
    if (inputDirty) {
      addLabel(videos[currentVideoIndex].video.id, uid, inputLabeledText);
      if (labeledStatus[currentVideoIndex] === false) {
        setLabeledStatus((prevLabeledStatus) => {
          const newLabeledStatus = [...prevLabeledStatus];
          newLabeledStatus[currentVideoIndex] = true;
          return newLabeledStatus;
        });
        videos[currentVideoIndex].labels = [
          { para_text: inputLabeledText, created_at: new Date().toISOString() },
        ];
      } else {
        videos[currentVideoIndex].labels[0].para_text = inputLabeledText;
      }
    }
    setCurrentVideoIndex(currentVideoIndex - 1);
  };

  const handleNext = () => {
    if (inputDirty) {
      addLabel(videos[currentVideoIndex].video.id, uid, inputLabeledText);
      if (labeledStatus[currentVideoIndex] === false) {
        setLabeledStatus((prevLabeledStatus) => {
          const newLabeledStatus = [...prevLabeledStatus];
          newLabeledStatus[currentVideoIndex] = true;
          return newLabeledStatus;
        });
        videos[currentVideoIndex].labels = [
          { para_text: inputLabeledText, created_at: new Date().toISOString() },
        ];
      } else {
        videos[currentVideoIndex].labels[0].para_text = inputLabeledText;
      }
    }
    if (videos.length - 1 === currentVideoIndex && labeledCountState === videos.length) {
      router.push('/');
      return;
    }
    setCurrentVideoIndex(currentVideoIndex + 1);
  };

  const handleMoveTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const moveIndex = parseInt(event.target.value);
    setNumToMove(moveIndex);
  };

  const handleMoveButtonClick = () => {
    if (numToMove > 0 && numToMove <= videos.length) {
      setCurrentVideoIndex(numToMove - 1);
      setIsSheetOpen(false);
    }
  };

  const handleToggle = (value: boolean) => {
    setIsLoopToggleOn(value);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex w-[56rem] max-w-3xl items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="outline">
            <span className="text-xs font-semibold">{currentVideoIndex + 1}번</span>
          </Badge>
          <Sheet key="left" open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger onClick={() => setIsSheetOpen(true)}>
              <Badge variant="destructive">이동</Badge>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>문항을 이동하시겠습니까?</SheetTitle>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="Number"
                    min={1}
                    max={580}
                    onChange={handleMoveTextChange}
                    value={numToMove}
                    placeholder="이동 할 문항 번호"
                  />
                  <Button onClick={handleMoveButtonClick} type="submit">
                    이동
                  </Button>
                </div>
              </SheetHeader>
              <div className="my-5 border-b border-gray-200"></div>
              <RenderGuideDiv />
            </SheetContent>
          </Sheet>
        </div>
        <Badge variant="secondary">
          <span className="text-xs font-semibold">
            {labeledCountState}/{videos.length} 완료
          </span>
        </Badge>
      </div>
      <div className="mt-2 w-full max-w-3xl">
        <div className="relative">
          <video
            controls
            ref={videoRef}
            src={videos[currentVideoIndex].video.url as string}
            className="rounded-lg"
            preload="auto"
          />
          <video
            loop
            controls
            ref={loopVideoRef}
            src={`${(videos[currentVideoIndex].video.url as string).replace(/\.mp4$/, '_loop.mp4')}`}
            className="rounded-lg"
            preload="auto"
          />
        </div>
      </div>
      <div className="mt-4 w-[56rem] max-w-3xl">
        <div className="flex items-center gap-2 py-2">
          <Label
            // className="mb-2 px-2 text-lg font-medium text-gray-700 block"
            className="px-2 text-lg font-medium text-gray-700"
            htmlFor="video-label"
          >
            <span className="bg-yellow-200 text-lg">
              {videos[currentVideoIndex].video.plain_text}
            </span>
          </Label>
          <Toggle
            aria-label="Toggle italic"
            size="sm"
            pressed={isLoopToggleOn}
            onPressedChange={handleToggle}
            variant="outline"
          >
            {isLoopToggleOn ? '전체영상' : '부분반복'}
            {/* <ReloadIcon className="h-4 w-4" /> */}
          </Toggle>
        </div>
        <Input
          className="mb-1"
          id="video-label"
          value={inputLabeledText}
          onChange={handleInputLabeledTextChange}
          placeholder="위 대사에 대한 발화자의 어조를 최대한 잘 드러낼 수 있는 구두점을 추가하여 텍스트를 변형하고 표현해 주세요"
        />
        <div className='mb-3 flex justify-center'>
          <span className='text-xs text-blue-500'>(부분반복 버튼을 누른 이후 반복되는 영상이 라벨링을 해야 하는 구간입니다. 전체 영상을 시청한 이후 부분 반복을 하며 해당 구간에 대한 라벨링을 진행해주세요)</span>
        </div>
        <div className="flex justify-end gap-2">
          <Button disabled={currentVideoIndex === 0} onClick={handlePrev}>
            이전
          </Button>
          <Button
            disabled={inputLabeledText === ''}
            onClick={handleNext}
            className="transition-all"
          >
            {videos.length - 1 !== currentVideoIndex ? <span>다음</span> : <span>종료</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}
