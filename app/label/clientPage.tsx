'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { addLabel } from "@/lib/dataClient";
import { VideoPoolWithVideoAndLabel } from "@/types/types";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const getLatestLabel = (labels: VideoPoolWithVideoAndLabel['labels']) => {
  return labels.reduce((latest, label) => {
    if (latest.created_at < label.created_at) {
      return label;
    }
    return latest;
  }, labels[0]);
}

export default function LabelComponent({ uid, pnum, videos }: { uid: number, pnum: number, videos: VideoPoolWithVideoAndLabel[] }) {
  // TODO(!): Loading State + Skeleton UI, Video Loading 완료 event 감지 필요
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [labeledCountState, setLabeledCountState] = useState(0);
  const [labeledStatus, setLabeledStatus] = useState<boolean[]>([]);
  const [initialLabeledText, setInitialLabeledText] = useState('');
  const [inputLabeledText, setInputLabeledText] = useState('');
  const [inputDirty, setInputDirty] = useState(false); // Dirty: initialLabeledText 와 다르면 True
  const [numToMove, setNumToMove] = useState(0);

  useEffect(() => {
    if (videos) {
      const index = videos.findIndex((v) => v.labels.length === 0);
      if (index !== -1) {
        setCurrentVideoIndex(index);
      }
    }
  }, [])

  useEffect(() => {
    if (videos) {
      const initialLabeledStatus = videos.map((video) => video.labels.length !== 0);
      setLabeledStatus(initialLabeledStatus);
    }
  }, [videos]);

  useEffect(() => {
    const labeledCount = labeledStatus.filter((status) => status).length;
    setLabeledCountState(labeledCount);
  }, [labeledStatus])

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
  }, [currentVideoIndex])

  useEffect(() => {
    if (inputLabeledText !== initialLabeledText) {
      setInputDirty(true);
    }
  }, [inputLabeledText])

  const handleInputLabeledTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputLabeledText(event.target.value);
  }

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
        videos[currentVideoIndex].labels = [{ para_text: inputLabeledText, created_at: new Date().toISOString() }];
      } else {
        videos[currentVideoIndex].labels[0].para_text = inputLabeledText;
      }
    }
    setCurrentVideoIndex(currentVideoIndex - 1);
  }

  const handleNext = () => {
    if (videos.length - 1 === currentVideoIndex && labeledCountState === videos.length) {
      router.push('/')
      return;
    }

    if (inputDirty) {
      addLabel(videos[currentVideoIndex].video.id, uid, inputLabeledText);
      if (labeledStatus[currentVideoIndex] === false) {
        setLabeledStatus((prevLabeledStatus) => {
          const newLabeledStatus = [...prevLabeledStatus];
          newLabeledStatus[currentVideoIndex] = true;
          return newLabeledStatus;
        });
        videos[currentVideoIndex].labels = [{ para_text: inputLabeledText, created_at: new Date().toISOString() }];
      } else {
        videos[currentVideoIndex].labels[0].para_text = inputLabeledText;
      }
    }
    setCurrentVideoIndex(currentVideoIndex + 1);
  }

  const handleMoveTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const moveIndex = parseInt(event.target.value);
    setNumToMove(moveIndex);
  }

  const handleMoveButtonClick = () => {
    if (numToMove > 0 && numToMove <= videos.length) {
      setCurrentVideoIndex(numToMove - 1);
      setIsSheetOpen(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-between max-w-4xl w-[56rem]">
        <div className='flex gap-2'>
        <Badge variant="outline"><span className="text-xs font-semibold">{currentVideoIndex+1}번</span></Badge>
          <Sheet key="left" open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            {/* TODO(!) 안한 문항 보여주기 */}
            <SheetTrigger onClick={() => setIsSheetOpen(true)}>
              <Badge variant="destructive">이동</Badge>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>문항을 이동하시겠습니까?</SheetTitle>
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input type="Number" min={1} max={580} onChange={handleMoveTextChange} value={numToMove} placeholder="이동 할 문항 번호" />
                  <Button onClick={handleMoveButtonClick} type="submit">이동</Button>
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <Badge variant="secondary"><span className="text-xs font-semibold">{labeledCountState}/{videos.length} 완료</span></Badge>
      </div>
      <div className="w-full max-w-4xl mt-2">
        <div className="relative">
          <video src={videos[currentVideoIndex].video.url as string} controls className="rounded-lg" preload="auto"/>
        </div>
      </div>
      <div className="max-w-4xl mt-6 w-[56rem]">
        <Label className="mb-2 px-2 block text-lg font-medium text-gray-700" htmlFor="video-label">
        <span className="bg-yellow-200">{videos[currentVideoIndex].video.plain_text}</span>
        </Label>
        <Input className="mb-4" id="video-label" value={inputLabeledText} onChange={handleInputLabeledTextChange} placeholder="위 대사에 대한 발화자의 어조를 최대한 잘 드러낼 수 있는 구두점을 추가하여 텍스트를 변형하고 표현해 주세요" />
        <div className="flex gap-2 justify-end">
          <Button disabled={currentVideoIndex === 0} onClick={handlePrev}>이전</Button>
          <Button disabled={inputLabeledText === ''} onClick={handleNext} className='transition-all'>
            {videos.length - 1 !== currentVideoIndex ? <span>다음</span> : <span>종료</span>}
          </Button>
        </div>
      </div>
    </div>
  );
}