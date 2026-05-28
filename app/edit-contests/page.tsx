'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

interface Contest {
    id: number;
    title: string;
    start_at: string;
    end_at: string;
    problem_ids: number[];
}

interface ProblemOption {
    id: number;
    name: string;
}

export default function AdminEditPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');

  const [title, setTitle] = useState('');
  const [startAt, setStartAt] = useState('');
  const [endAt, setEndAt] = useState('');

  const [selectedProblems, setSelectedProblems] = useState<number[]>([]);
  const [problemOptions, setProblemOptions] = useState<ProblemOption[]>([]);

  const [originalData, setOriginalData] = useState<Contest | null>(null);

  const [errors, setErrors] = useState({ title: false, startAt: false, endAt: false, dateError: false, problemEmpty: false});

  useEffect(() => {
    if (!id) return;

    const fetchContestDetail = async () => {
      try {
        const probResponse = await fetch('http://localhost:8000/problems/');
        let options: ProblemOption[] = [];
        if (probResponse.ok) {
          options = await probResponse.json();
          setProblemOptions(options);
        }
        const response = await fetch(`http://localhost:8000/contests/${id}/`);
        if (response.ok) {
          const currentContest : Contest = await response.json();

          if (currentContest) {
            setTitle(currentContest.title);
            setStartAt(currentContest.start_at);
            setEndAt(currentContest.end_at);
            setOriginalData(currentContest);

            if (currentContest.problem_ids && currentContest.problem_ids.length > 0) {
              setSelectedProblems(currentContest.problem_ids);
            } else {
              setSelectedProblems([0]);
            }
          }
      } else {
          console.error("データの取得に失敗しました");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchContestDetail();
  },[id]);

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
    setErrors((prev) => ({ ...prev, title: false, startAt: false, endAt: false, problemEmpty: false }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

    if (originalData) {
      const isTitleUnchanged = title === originalData.title;
      const isStartAtUnchanged = startAt === originalData.start_at;
      const isEndAtUnchanged = endAt === originalData.end_at;
      const isDateInvalid = new Date(startAt) >= new Date(endAt);

      const validProblems = selectedProblems.filter(pid => pid !== 0);
      const isProblemEmpty = validProblems.length === 0;


      const originalProblems = originalData.problem_ids || [];
      const isProblemsUnchanged =
        validProblems.length === originalProblems.length &&
        validProblems.every((val, index) => val === originalProblems[index]);

      const isAllUnchanged = isTitleUnchanged && isStartAtUnchanged && isEndAtUnchanged && isProblemsUnchanged;

      setErrors({
        title: isAllUnchanged,
        startAt: isAllUnchanged,
        endAt: isAllUnchanged,
        dateError: isDateInvalid,
        problemEmpty: isProblemEmpty,
      });

      if (isAllUnchanged || isDateInvalid || isProblemEmpty) {
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:8000/contests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          start_at: startAt,
          end_at: endAt,
          problem_ids: selectedProblems.filter(pid => pid !== 0),
        }),
      });

      if (response.ok) {
        router.push('/admin');
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
          <h1 className="text-white text-xl md:text-3xl font-bold">
          コンテスト編集
          </h1>
            <Link
            href="/add-contests"
            className="bg-white text-blue-600 px-10 py-2 rounded-lg text-bs font-bold">
            +</Link>
      </div>

        <Link
          href="/admin"
          className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-bold mr-4">
          ← 戻る
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <label className="text-xl font-bold text-red">コンテスト名</label>
            {errors.title && <span className="text-red-500 font-bold text-sm ml-4"> コンテスト名を正しく入力してください</span>}
          </div>
            <div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => ({ ...prev, title: false, startAt: false, endAt: false }));
                  }}
                  className="w-full p-4 border rounded-xl text-lg"
                />
              </div>

        <div className="space-y-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <label className="text-xl font-bold text-red">開催日時</label>
          {errors.startAt && <span className="text-red-500 font-bold text-sm ml-4"> 開催日時を入力してください</span>}
          {errors.dateError && <span className="text-red-500 font-bold text-sm ml-4">日時エラー</span>}
          </div>
            <div>
                <input
                  type="text"
                  value={startAt}
                  onChange={(e) => {
                    setStartAt(e.target.value);
                    setErrors((prev) => ({ ...prev, title: false, startAt: false, endAt: false }));
                  }}
                  className="w-full p-4 border rounded-xl text-lg"
                />
              </div>
          </div>

          <div className="space-y-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <label className="text-xl font-bold text-red">終了日時</label>
          {errors.endAt && <span className="text-red-500 font-bold text-sm ml-4"> 終了日時を入力してください</span>}
          {errors.dateError && <span className="text-red-500 font-bold text-sm ml-4">開催日時よりも先の日時を指定してください</span>}
          </div>
            <div>
                <input
                    type="text"
                    value={endAt}
                    onChange={(e) => {
                      setEndAt(e.target.value);
                      setErrors((prev) => ({ ...prev, title: false, startAt: false, endAt: false }));
                    }}
                    className="w-full p-4 border rounded-xl text-lg"
                  />
              </div>
          </div>

          <div className="space-y-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <label className="text-xl font-bold text-red">コンテスト実施問題</label>
            {errors.problemEmpty && <span className="text-red-500 font-bold text-sm ml-4">問題を１つ以上選択してください</span>}
          </div>
          <div className="space-y-3">
            {selectedProblems.map((selectedId, index) => (
              <div key={index} className="flex items-center gap-3">
                <select
                  value={selectedId}
                  onChange={(e) => handleProblemChange(index, Number(e.target.value))}
                  className="w-full p-4 border rounded-xl text-lg bg-white text-black"
                >
                  <option value={0}>問題を選択してください</option>
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

        <div className="w-38 ">
          <button type="submit" className=" px-5 py-3 bg-blue-500 text-white rounded-xl font-bold text-2xl">
            変更を保存
          </button>
        </div>
      </form>
    </main>
  )
}