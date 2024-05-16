import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Component() {
  return (
    <div className="">
      <section className="w-full py-12">
        <div className="container h-full px-4 md:px-6">
          <div className="grid h-full gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  자막 연구 데이터 수집
                </h1>
                <p className="max-w-[600px] pt-4 text-gray-500 dark:text-gray-400 md:text-xl">
                  드라마 영상 속 대사를 단순히 글자로 옮기는 것이 아닌, 말투와 억양, 감정까지
                  담아내는 자막 연구에 참여해 보세요.
                </p>
                <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                  여러분의 섬세한 표현력으로 자막에 생동감을 불어넣어 주세요.
                </p>
                <p className="max-w-[600px] pb-4 text-gray-500 dark:text-gray-400 md:text-xl">
                  구두점, 기호, 띄어쓰기 등 다양한 방식으로 등장인물의 대사를 입체적으로 표현하며,
                  영상 속 순간을 텍스트로 풍성하게 재현해 보세요.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild>
                  <Link
                    className="inline-flex h-10 items-center justify-center px-8 text-sm font-medium"
                    href="/tutorial"
                  >
                    시작하기
                  </Link>
                </Button>
              </div>
            </div>
            <img
              alt="Hero"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              height="550"
              src="https://dqjmuu9t2q3py.cloudfront.net/assets/main.png"
              width="550"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
