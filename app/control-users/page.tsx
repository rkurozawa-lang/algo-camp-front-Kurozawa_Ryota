'use client';

import { useState } from 'react';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

export default function SignupPage() {

const [loginid, setloginId] = useState('');
const [loginpassword, setloginPassword] = useState('');
const [name, setname] = useState('');

const sendData = async () => {
try {
    const response = await fetch('http://localhost:8000/users/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        login_id: loginid,
        login_password: loginpassword,
        name: name,
        is_admin: false
    }),
    });

} catch (error) {
    console.error(error);
}
};

return (
<main className="flex min-h-screen flex-col p-6 bg-gray-50">
    <div className="mt-4 flex grow items-center justify-center p-4">

    <div className="flex w-full max-w-md flex-col justify-center gap-6">

        <form onSubmit={(e) => {
            e.preventDefault();
            sendData();
        }}
        className="flex w-full flex-col justify-center gap-6 rounded-lg bg-white border border-gray-200 px-8 py-10">
        <Link
        href="/"
        className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-bold mr-4"
    >
        ← 戻る
    </Link>
        <div className="space-y-4">
        <div>
            <label className="block text-black font-bold mb-1" htmlFor="userName">
                名前
            </label>
            <input
                id="userName"
                type="text"
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder="山田太郎"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:border-blue-500 focus:outline-none transition-colors"
                required
            />
            </div>
            <div>
            <label className="block text-black font-bold mb-1" htmlFor="loginId">
                新しいID
            </label>
            <input
                id="loginId"
                type="text"
                value={loginid}
                onChange={(e) => setloginId(e.target.value)}
                placeholder="user00"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
            </div>

            <div>
            <label className="block text-black font-bold mb-1" htmlFor="password">
                新しいパスワード
            </label>
            <input
                id="password"
                type="password"
                value={loginpassword}
                onChange={(e) => setloginPassword(e.target.value)}
                placeholder="ログインパスワード"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5"
            />
            </div>
        </div>
        <div className="pt-2">
            <button
            type="submit"
            className="w-full flex items-center justify-center rounded-lg bg-blue-500 px-6 py-4 text-lg md:text-xl font-bold text-white"
            >
            新規登録
            </button>
        </div>

        </form>

    </div>

    </div>
</main>
);
}