import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Link from 'next/link';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Next.js and Supabase Starter Kit',
  description: 'The fastest way to build apps with Next.js and Supabase',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-background text-foreground">
        <div className="min-h-screen ">
          <div className="w-full px-8">
            <div className="">
              <nav className="flex items-center justify-between bg-white p-4">
                <Link href="/">
                  <h1 className="font-base text-xl">뉘앙스-자막 표현 연구</h1>
                </Link>

                <Link href="https://iit.gist.ac.kr/sci/index.do">
                  <img
                    src="https://iit.gist.ac.kr/thumbnail/popupzoneDetail/PHO_202211110832033150.png"
                    alt="Web Logo"
                    className="h-12"
                  />
                </Link>
              </nav>
              <div className="border-b border-gray-200"></div>
            </div>
          </div>
          <main className="flex flex-col items-center">{children}</main>
        </div>
      </body>
    </html>
  );
}
