'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';

interface Contest {
    id: number;
    title: string;
    start_at: string;
    end_at: string;
}

export default function AdminContestPage() {

  const [now] = useState(new Date('2026-03-30T12:00:00'));
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch('http://localhost:8000/contests/');
        if (response.ok) {
          const data = await response.json();
          setContests(data);
        } else {
          console.error("コンテストデータの取得に失敗しました");
        }
      } catch (error) {

        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedContestId, setSelectedContestId] = useState<number | null>(null);

  const parseDate = (dateStr: string) => new Date(dateStr.replace(/\//g, '-'));

  const upcomingContests = contests
  .filter(c => parseDate(c.start_at) > now)
  .sort((a, b) => parseDate(a.start_at).getTime() - parseDate(b.start_at).getTime());

  const ongoingContests = contests
    .filter(c => parseDate(c.start_at) <= now && parseDate(c.end_at) >= now)
    .sort((a, b) => parseDate(b.start_at).getTime() - parseDate(a.start_at).getTime());

  const finishedContests = contests
  .filter(c => parseDate(c.start_at) < now )
  .sort((a, b) => parseDate(b.start_at).getTime() - parseDate(a.start_at).getTime());

  const selectedContest = contests.find(c => c.id === selectedContestId);

const confirmDelete = () => {
    if (selectedContestId !== null) {
      setContests(contests.filter(c => c.id !== selectedContestId));
      setIsDeleteModalOpen(false);
      setSelectedContestId(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-5">
      <div className="relative flex h-20 items-center justify-between rounded-lg bg-blue-500 p-4 md:h-32 mb-8">
        <div className="flex items-center gap-4 ml-4">
          <h1 className="text-white text-xl md:text-3xl font-bold">
          コンテスト管理
          </h1>
            <Link
            href="/add-contests"
            className="bg-white text-blue-600 w-12 h-12 flex items-center justify-center rounded-full text-bs font-bold">
            +</Link>
            <Link
            href="/control-problems"
            className="text-white text-xl md:text-3xl font-bold">
            問題管理へ</Link>
            <Link
          href="/control-problems"
          className="bg-white text-blue-600 px-10 py-2 rounded-lg text-bs font-bold">
          →
        </Link>
        <Link
            href="/control-users"
            className="text-white text-xl md:text-3xl font-bold">
            ユーザー管理へ</Link>
            <Link
          href="/control-users"
          className="bg-white text-blue-600 px-10 py-2 rounded-lg text-bs font-bold">
          →
        </Link>
      </div>

        <Link
          href="/"
          className="bg-white text-blue-600 px-6 py-2 rounded-lg text-sm font-bold mr-4">
          ← 戻る
        </Link>
      </div>

      <div className="space-y-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <h2 className="text-xl font-bold">予定されているコンテスト</h2>
          </div>

          <div className="bg-white rounded-xl ">
            <table className="min-w-full text-left text-sm mb-5">
              <thead className="bg-gray-50 text-black">
                <tr>
                  <th className="px-6 py-4 font-bold">イベント名</th>
                  <th className="px-6 py-4 font-bold">開始日時</th>
                  <th className="px-6 py-4 font-bold">終了日時</th>
                  <th className="px-6 py-4 text-centre font-bold">アクション</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {upcomingContests.map(c => (
                    <tr key={c.id}>
                      <td className="px-6 py-4 font-medium text-blue-900">{c.title}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono">{c.start_at}</td>
                      <td className="px-6 py-4 text-gray-600 font-mono">{c.end_at}</td>
                      <td className="px-6 py-4 text-left space-x-4">
                        <Link href={`/edit-contests?id=${c.id}`} className="text-blue-500 text-lg">編集</Link>
                        <button onClick={() => { setSelectedContestId(c.id); setIsDeleteModalOpen(true); }} className="text-gray-400 text-lg">削除</button>
                        </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
                </div>
            </div>

      <div className="space-y-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center bg-red-300 ">
            <h2 className="text-xl font-bold text-red">開催中のコンテスト</h2>
          </div>
          <div className="bg-white rounded-xl ">
            <table className="min-w-full text-left text-sm mb-5">
              <thead className="bg-gray-50 text-black">
                <tr>
                  <th className="px-6 py-4 font-bold">イベント名</th>
                  <th className="px-6 py-4 font-bold">開始日時</th>
                  <th className="px-6 py-4 font-bold">終了日時</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ongoingContests.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-medium text-blue-900">{c.title}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{c.start_at}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{c.end_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      <div className="space-y-5 max-w-7xl mx-auto w-full">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-red">終了済みのコンテスト</h2>
          </div>
          <div className="bg-white rounded-xl ">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-black">
                <tr>
                  <th className="px-6 py-4 font-bold">イベント名</th>
                  <th className="px-6 py-4 font-bold">開始日時</th>
                  <th className="px-5 py-4 font-bold">終了日時</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {finishedContests.map(c => (
                  <tr key={c.id}>
                    <td className="px-6 py-4 font-medium text-blue-900">{c.title}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{c.start_at}</td>
                    <td className="px-6 py-4 text-gray-600 font-mono">{c.end_at}</td>
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
              {selectedContest?.title}を本当に削除しますか？
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
