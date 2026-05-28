'use client';
import { useState } from 'react';
import AcmeLogo from '@/app/ui/acme-logo';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

export default function Page() {
  const [loginid, setloginId] = useState('');
  const [loginpassword, setloginPassword] = useState('');

  return (
    <main className="flex min-h-screen flex-col p-2 ">
      <div className="flex h-20 rounded-lg bg-blue-500 ppr-4 pl-12 md:h-28 ">
        <AcmeLogo />
        <div className="absolute  left-1/2 top-1/2 -translate-x-1/2 -translate-y-3/4 -mt-80">
          <Image
            src="/Gemini_Generated_Image_dl700kdl700kdl70.png"
            width={128}
            height={128}
            alt='ロゴ'
            className="object-contain"
          />
        </div>
        <Link
    href="/sign-up"
    className="absolute top-12 right-10 bg-white text-blue-600 px-10 py-2 rounded-lg text-lg font-bold">
    ユーザー登録
        </Link>

      </div>

      <div className="mt-4 flex grow items-center justify-center p-4">

        <div className="flex w-full max-w-md flex-col justify-center gap-6 rounded-lg bg-white border border-gray-200 px-8 py-10">
          <p className={`${lusitana.className} text-2xl text-gray-800 md:text-3xl md:leading-normal font-bold text-center mb-2`}>
            ようこそ
            <br />
            ログインしてください
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="loginId">
                ID
              </label>
              <input
                id="loginId"
                type="text"
                value={loginid}
                onChange={(e) => setloginId(e.target.value)}

                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="password">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={loginpassword}
                onChange={(e) => setloginPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
              />
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/admin"
              className="flex items-center justify-center rounded-lg bg-blue-500 px-6 py-4 text-lg md:text-xl font-bold text-white"
            >Log in</Link>
          </div>

        </div>

      </div>
    </main>
  );
}