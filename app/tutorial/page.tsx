import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Tutorial() {
  return (
    <div className="w-full max-w-4xl">
      <video
        src="https://sci-para3.s3.ap-northeast-2.amazonaws.com/assets/Tutorial.mp4"
        controls
        className="mt-6 rounded-lg"
      />
      <div className="flex w-full justify-end">
        <Button asChild className="mt-4">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center px-8 text-sm font-medium"
          >
            계속하기
          </Link>
        </Button>
      </div>
    </div>
  );
}
