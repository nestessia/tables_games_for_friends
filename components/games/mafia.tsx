"use client";


import Link from "next/link";

export default function Mafia ({slug}: {slug: string}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md flex flex-col items-center gap-8">

                <Link
                    href="/"
                    className="self-start flex items-center gap-2 px-4 py-2 rounded-xl bg-[rgba(140,100,255,0.08)] border border-[rgba(140,100,255,0.2)] text-[rgba(184,159,255,0.7)] text-sm font-medium hover:bg-[rgba(140,100,255,0.18)] hover:border-[rgba(140,100,255,0.5)] hover:text-[#b89fff] transition-all duration-200 group"
                >
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Все игры
                </Link>

                <div className="text-center">
                    <div className="text-6xl mb-3">🎭</div>
                    <h1 className="text-4xl font-bold text-accent-light">Мафия</h1>
                    <p className="text-accent-muted mt-1 text-sm">Will come soon...</p>
                </div>

            </div>
        </div>
    )
}
