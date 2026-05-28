'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';


interface Problem {
id: number;
name: string;
time_limit: number;
memory_limit: number;
}

export default function EditProblemsPage() {
const searchParams = useSearchParams();
const router = useRouter();
const id = searchParams.get('id');

const [name, setName] = useState('');
const [timeLimit, setTimeLimit] = useState<number | ''>('');
const [memoryLimit, setMemoryLimit] = useState<number | ''>('');

const [originalData, setOriginalData] = useState<Problem | null>(null);
const [errors, setErrors] = useState({ name: false, timeLimit: false, memoryLimit: false});

useEffect(() => {
if (!id) return;

const fetchProblemDetail = async () => {
    try {
    const response = await fetch(`http://localhost:8000/problems/${id}`);
    if (response.ok) {
        const currentProblem: Problem = await response.json();

    if (currentProblem) {
        setName(currentProblem.name);
        setTimeLimit(currentProblem.time_limit);
        setMemoryLimit(currentProblem.memory_limit);
        setOriginalData(currentProblem);
    }
} else{
    console.error("データの取得に失敗しました");
    }
    } catch (error) {
    console.error(error);
    }
};
fetchProblemDetail();
},[id]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (originalData) {
        const isNameUnchanged = name === originalData.name;
        const isTimeLimitUnchanged = timeLimit === originalData.time_limit;
        const isMemoryLimitUnchanged = memoryLimit === originalData.memory_limit;

        const isAllUnchanged = isNameUnchanged && isTimeLimitUnchanged && isMemoryLimitUnchanged;

        setErrors({
        name: isAllUnchanged,
        timeLimit: isAllUnchanged,
        memoryLimit: isAllUnchanged,
    });

    if (isAllUnchanged) return;
    }

try {
    const response = await fetch(`http://localhost:8000/problems/${id}`, {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: name,
        time_limit: Number(timeLimit),
        memory_limit: Number(memoryLimit),
    }),
    });

    if (response.ok) {
    router.push('/control-problems');
    } else {
    console.error("データの更新に失敗しました");
    }
} catch (error) {
    console.error(error);
}
};

return (
<main className="flex min-h-screen flex-col p-5">
    <div className="relative flex h-20 items-center justify-between rounded-lg bg-blue-500 p-4 md:h-32 mb-8">
    <div className="flex items-center gap-4 ml-4">
        <h1 className="text-white text-xl md:text-3xl font-bold">問題編集</h1>
    </div>
    <Link
        href="/control-problems"
        className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-bold mr-4"
    >
        ← 戻る
    </Link>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5 max-w-7xl mx-auto w-full">
    <div className="space-y-2">
        <div className="flex items-center">
        <label className="text-xl font-bold text-gray-700">問題名</label>
        {errors.name && <span className="text-red-500 font-bold text-sm ml-4">問題名を正しく入力してください</span>}
        </div>
        <input
        type="text"
        value={name}
        onChange={(e) => {
            setName(e.target.value);
            setErrors({ name: false, timeLimit: false, memoryLimit: false });
        }}
        className="w-full p-4 border rounded-xl text-lg text-black"
        />
    </div>


    <div className="space-y-2">
        <div className="flex items-center">
        <label className="text-xl font-bold text-gray-700">実行時間制限</label>
        {errors.timeLimit && <span className="text-red-500 font-bold text-sm ml-4">何も変更が加えられていません</span>}
        </div>
        <input
        type="number"
        step="0.1"
        value={timeLimit}
        onChange={(e) => {
            setTimeLimit(e.target.value === '' ? '' : Number(e.target.value));
            setErrors({ name: false, timeLimit: false, memoryLimit: false });
        }}
        className="w-full p-4 border rounded-xl text-lg text-black"
        />
    </div>
    <div className="space-y-2">
        <div className="flex items-center">
        <label className="text-xl font-bold text-gray-700">メモリ制限</label>
        {errors.memoryLimit && <span className="text-red-500 font-bold text-sm ml-4">何も変更が加えられていません</span>}
        </div>
        <input
        type="number"
        value={memoryLimit}
        onChange={(e) => {
            setMemoryLimit(e.target.value === '' ? '' : Number(e.target.value));
            setErrors({ name: false, timeLimit: false, memoryLimit: false });
        }}
        className="w-full p-4 border rounded-xl text-lg text-black"
        />
    </div>

    <div className="pt-4">
        <button type="submit" className="px-8 py-3 bg-blue-500 text-white rounded-xl font-bold text-xl hover:bg-blue-600 transition-colors">
        変更を保存
        </button>
    </div>
    </form>
</main>
);
}