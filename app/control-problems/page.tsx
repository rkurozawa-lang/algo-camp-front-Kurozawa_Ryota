'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

interface Problem {
id: number;
name: string;
time_limit: string;
memory_limit: string;
}

export default function AdminControlProblemsPage() {

const [problems, setProblems] = useState<Problem[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
const fetchProblems = async () => {
    try {
    const response = await fetch('http://localhost:8000/problems/');
    if (response.ok) {
        const data = await response.json();
        setProblems(data);
    } else {
        console.error("コンテストデータの取得に失敗しました");
    }
    } catch (error) {

    console.error(error);
    } finally {
    setLoading(false);
    }
};

fetchProblems();
}, []);

const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);

const selectedProblem = problems.find(c => c.id === selectedProblemId);

const Problems = problems

const confirmDelete = () => {
if (selectedProblemId !== null) {
    setProblems(problems.filter(c => c.id !== selectedProblemId));
    setIsDeleteModalOpen(false);
    setSelectedProblemId(null);
}
};

return (
<main className="flex min-h-screen flex-col p-5">
    <div className="relative flex h-20 items-center justify-between rounded-lg bg-blue-500 p-4 md:h-32 mb-8">
    <div className="flex items-center gap-4 ml-4">
        <h1 className="text-white text-xl md:text-3xl font-bold">
        問題管理
        </h1>
        <Link
        href="/add-problems"
        className="bg-white text-blue-600 px-10 py-2 rounded-lg text-bs font-bold">
        +</Link>
    </div>

    <Link
        href="/admin"
        className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-bold mr-4">
        ← 戻る
    </Link>
    </div>

    <div className="space-y-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center">
        </div>

        <div className="bg-white rounded-xl ">
        <table className="min-w-full text-left text-sm mb-5">
            <thead className="bg-gray-50 text-black">
            <tr>
                <th className="px-6 py-4 font-bold">問題名</th>
                <th className="px-6 py-4 font-bold">実行時間制限(S)</th>
                <th className="px-6 py-4 font-bold">メモリ制限(GB)</th>
                <th className="px-6 py-4 text-centre font-bold">アクション</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {Problems.map(c => (
                <tr key={c.id}>
                    <td className="px-6 py-4 font-medium text-blue-900">{c.name}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{c.time_limit}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{c.memory_limit}</td>
                    <td className="px-6 py-4 text-left space-x-4">
                    <Link href={`/edit-problems?id=${c.id}`} className="text-blue-500 text-lg">編集</Link>
                    <button onClick={() => { setSelectedProblemId(c.id); setIsDeleteModalOpen(true); }} className="text-gray-400 text-lg">削除</button>
                    </td>
                </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

    {isDeleteModalOpen && (
    <div className="fixed inset-0  flex items-center justify-center">
        <div className="bg-white rounded w-1/2 p-6">
        <p className="text-xl text-black font-bold mb-6 text-center">
            {selectedProblem?.name}を本当に削除しますか？
        </p>
        <div className="flex flex-col gap-2 flex items-center">
            <button
            onClick={confirmDelete}
            className="w-1/2 py-2.5 bg-red-500 text-white rounded-xl font-bold"
            >
            削除する
            </button>
            <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="w-1/2 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold"
            >
            キャンセル
            </button>
        </div>
        </div>
    </div>
    )}
</main>
);
}
