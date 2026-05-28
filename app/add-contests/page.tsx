'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ProblemOption {
id: number;
name: string;
}

export default function AdminAddContestPage() {
const router = useRouter();

const [title, setTitle] = useState('');
const [startAt, setStartAt] = useState('');
const [endAt, setEndAt] = useState('');

const [selectedProblems, setSelectedProblems] = useState<number[]>([0]);
const [problemOptions, setProblemOptions] = useState<ProblemOption[]>([]);

const [errors, setErrors] = useState({ title: false, startAt: false, endAt: false, dateError: false, problemEmpty: false });

const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

useEffect(() => {
const fetchProblemOptions = async () => {
    try {
    const probResponse = await fetch('http://localhost:8000/problems/');
    if (probResponse.ok) {
        const options: ProblemOption[] = await probResponse.json();
        setProblemOptions(options);
    }
    } catch (error) {
    console.error("問題一覧の取得に失敗しました:", error);
    }
};

fetchProblemOptions();
}, []);

const handleAddProblemRow = () => {
setSelectedProblems([...selectedProblems, 0]);
};

const handleRemoveProblemRow = (indexToRemove: number) => {
if (indexToRemove === 0) return;
setSelectedProblems(selectedProblems.filter((_, index) => index !== indexToRemove));
};

const handleProblemChange = (index: number, value: number) => {
const updated = [...selectedProblems];
updated[index] = value;
setSelectedProblems(updated);
setErrors((prev) => ({ ...prev, problemEmpty: false }));
};

const formatToSlash = (value: string) => {
if (!value) return '';
return value.replace('T', ' ').replaceAll('-', '/');
};

const formatToHyphen = (value: string) => {
if (!value) return '';
return value.replace(' ', 'T').replaceAll('/', '-');
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

const isTitleEmpty = title.trim() === '';
const isStartAtEmpty = startAt.trim() === '';
const isEndAtEmpty = endAt.trim() === '';

const isDateInvalid = !isStartAtEmpty && !isEndAtEmpty
    ? new Date(startAt.replaceAll('/', '-')) >= new Date(endAt.replaceAll('/', '-'))
    : false;

const validProblems = selectedProblems.filter(pid => pid !== 0);
const isProblemEmpty = validProblems.length === 0;

setErrors({
    title: isTitleEmpty,
    startAt: isStartAtEmpty,
    endAt: isEndAtEmpty,
    dateError: isDateInvalid,
    problemEmpty: isProblemEmpty,
});

if (isTitleEmpty || isStartAtEmpty || isEndAtEmpty || isDateInvalid || isProblemEmpty) {
    return;
}

    setIsCreateModalOpen(true);
};

const executeCreate = async () => {
    const validProblems = selectedProblems.filter(pid => pid !== 0);

try {
    const response = await fetch('http://localhost:8000/contests/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        title: title,
        start_at: startAt,
        end_at: endAt,
        problem_ids: validProblems,
    }),
    });

    if (response.ok) {
    setIsCreateModalOpen(false)
    router.push('/admin');
    } else {
    console.error("データの作成に失敗しました");
    }
} catch (error) {
    console.error(error);
}
};

return (
<main className="flex min-h-screen flex-col p-5">
    <div className="relative flex h-20 items-center justify-between rounded-lg bg-blue-500 p-4 md:h-32 mb-8">
    <div className="flex items-center gap-4 ml-4">
        <h1 className="text-white text-xl md:text-3xl font-bold">
        コンテスト作成
        </h1>
    </div>
    <Link
        href="/admin"
        className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-bold mr-4"
    >
        戻る
    </Link>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5 max-w-7xl mx-auto w-full">
    <div className="space-y-2">
        <div className="flex items-center">
        <label className="text-xl font-bold text-red">コンテスト名</label>
        {errors.title && <span className="text-red-500 font-bold text-sm ml-4">何も入力されていません</span>}
        </div>
        <div>
        <input
            type="text"
            value={title}
            onChange={(e) => {
            setTitle(e.target.value);
            setErrors((prev) => ({ ...prev, title: false }));
            }}
            className="w-full p-4 border rounded-xl text-lg"
        />
        </div>
    </div>

    <div className="space-y-2">
        <div className="flex items-center">
        <label className="text-xl font-bold text-red">開催日時</label>
        {errors.startAt && <span className="text-red-500 font-bold text-sm ml-4">何も入力されていません</span>}
        {errors.dateError && <span className="text-red-500 font-bold text-sm ml-4">日時エラー</span>}
        </div>
        <div className="flex gap-2">
        <input
            type="datetime-local"
            value={formatToHyphen(startAt)}
            onChange={(e) => {
            setStartAt(formatToSlash(e.target.value));
            setErrors((prev) => ({ ...prev, startAt: false, dateError: false }));
            }}
            className="w-full p-2 border rounded-xl bg-white"
        />
        </div>
    </div>

    <div className="space-y-2">
        <div className="flex items-center">
        <label className="text-xl font-bold text-red">終了日時</label>
        {errors.endAt && <span className="text-red-500 font-bold text-sm ml-4">何も入力されていません</span>}
        {errors.dateError && <span className="text-red-500 font-bold text-sm ml-4">日時エラー</span>}
        </div>
        <div className="flex gap-2">
        <input
            type="datetime-local"
            value={formatToHyphen(endAt)}
            onChange={(e) => {
            setEndAt(formatToSlash(e.target.value));
            setErrors((prev) => ({ ...prev, endAt: false, dateError: false }));
            }}
            className="w-full p-2 border rounded-xl bg-white"
        />
        </div>
    </div>

    <div className="space-y-5 max-w-7xl mx-auto w-full">
        <div className="flex items-center">
        <label className="text-xl font-bold text-red">コンテスト実施問題</label>
        {errors.problemEmpty && <span className="text-red-500 font-bold text-sm ml-4">問題を選択してください</span>}
        </div>
        <div className="space-y-3">
        {selectedProblems.map((selectedId, index) => (
            <div key={index} className="flex items-center gap-3">
            <select
                value={selectedId}
                onChange={(e) => handleProblemChange(index, Number(e.target.value))}
                className="w-full p-4 border rounded-xl text-lg bg-white"
            >
                <option value={0} className="text-gray-500">問題を選択してください</option>
                {problemOptions.map((prob) => (
                <option key={prob.id} value={prob.id}>
                    {prob.name}
                </option>
                ))}
            </select>

            {index > 0 && (
                <button
                type="button"
                onClick={() => handleRemoveProblemRow(index)}
                className="p-3 bg-red-100 text-red-600 rounded-xl font-bold"
                >
                削除
                </button>
            )}

            {index === selectedProblems.length - 1 && (
                <button
                type="button"
                onClick={handleAddProblemRow}
                className="bg-blue-500 text-white px-5 py-4 rounded-xl font-bold text-xl"
                >
                +
                </button>
            )}
            </div>
        ))}
        </div>
    </div>

    <div className="w-38 pt-4">
        <button type="submit" className="px-5 py-3 bg-blue-500 text-white rounded-xl font-bold text-2xl">
        追加する
        </button>
    </div>
    </form>

    {isCreateModalOpen && (
    <div className="fixed inset-0 black bg-opacity-20 flex items-center justify-center">
        <div className="bg-white rounded w-1/2 p-6">
        <p className="text-xl text-black font-bold mb-6 text-center">
            「{title}」を本当に作成しますか？
        </p>
        <div className="flex flex-col gap-2 items-center">
        <button
        onClick={executeCreate}
        className="w-1/2 py-2.5 bg-blue-500 text-white rounded-xl font-bold"
        >
        作成する
        </button>
        <button
        onClick={() => setIsCreateModalOpen(false)}
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