"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import GameCard from "@/components/game_card";
import { games } from "@/lib/games";
import styles from "./slider.module.css";

export default function Slider() {
    const trackRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(games.length > 1);

    const updateState = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;

        const centerX = el.scrollLeft + el.clientWidth / 2;
        let closestIdx = 0;
        let closestDist = Infinity;
        Array.from(el.children).forEach((child, i) => {
            const c = child as HTMLElement;
            const childCenter = c.offsetLeft + c.offsetWidth / 2;
            const dist = Math.abs(childCenter - centerX);
            if (dist < closestDist) {
                closestDist = dist;
                closestIdx = i;
            }
        });

        setActiveIndex(closestIdx);
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }, []);

    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        el.addEventListener("scroll", updateState, { passive: true });
        updateState();
        return () => el.removeEventListener("scroll", updateState);
    }, [updateState]);

    const scrollToIndex = useCallback((index: number) => {
        const el = trackRef.current;
        if (!el) return;
        const item = el.children[index] as HTMLElement;
        if (!item) return;
        const offset = item.offsetLeft - (el.clientWidth - item.offsetWidth) / 2;
        el.scrollTo({ left: offset, behavior: "smooth" });
    }, []);

    const scrollBy = (dir: 1 | -1) => {
        scrollToIndex(Math.max(0, Math.min(games.length - 1, activeIndex + dir)));
    };

    return (
        <section className="w-full flex flex-col items-center gap-6 min-h-screen justify-center py-12">

            <div className="text-center px-4 flex flex-col items-center gap-2">
                <div className="text-5xl">🎮</div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Выбери игру</h1>
                <p className="text-[rgba(184,159,255,0.5)] text-sm">Листай и нажимай, чтобы начать</p>
            </div>

            <div className="relative w-full flex items-center">
                <button
                    onClick={() => scrollBy(-1)}
                    disabled={!canScrollLeft}
                    aria-label="Предыдущая игра"
                    className="hidden md:flex absolute left-6 z-10 w-10 h-10 items-center justify-center rounded-full bg-[rgba(20,20,36,0.9)] border border-[rgba(140,100,255,0.3)] text-[#b89fff] text-lg backdrop-blur-sm transition-all duration-200 hover:bg-[rgba(140,100,255,0.2)] hover:border-[rgba(140,100,255,0.7)] hover:scale-110 disabled:opacity-20 disabled:pointer-events-none"
                >
                    ←
                </button>

                <div
                    ref={trackRef}
                    className={`${styles.track} w-full flex gap-5 overflow-x-auto py-8`}
                    style={{
                        scrollSnapType: "x mandatory",
                        paddingInline: "max(20px, calc(50% - 110px))",
                    }}
                >
                    {games.map((game, i) => (
                        <div
                            key={game.slug}
                            className={`${styles.item} ${i === activeIndex ? styles.itemActive : ""}`}
                        >
                            <GameCard {...game} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scrollBy(1)}
                    disabled={!canScrollRight}
                    aria-label="Следующая игра"
                    className="hidden md:flex absolute right-6 z-10 w-10 h-10 items-center justify-center rounded-full bg-[rgba(20,20,36,0.9)] border border-[rgba(140,100,255,0.3)] text-[#b89fff] text-lg backdrop-blur-sm transition-all duration-200 hover:bg-[rgba(140,100,255,0.2)] hover:border-[rgba(140,100,255,0.7)] hover:scale-110 disabled:opacity-20 disabled:pointer-events-none"
                >
                    →
                </button>
            </div>

            <div className="flex items-center gap-2">
                {games.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollToIndex(i)}
                        aria-label={`Игра ${i + 1}`}
                        className={`rounded-full transition-all duration-300 ${
                            i === activeIndex
                                ? "w-6 h-2 bg-[#b89fff] shadow-[0_0_8px_rgba(184,159,255,0.6)]"
                                : "w-2 h-2 bg-[rgba(184,159,255,0.25)] hover:bg-[rgba(184,159,255,0.5)]"
                        }`}
                    />
                ))}
            </div>

        </section>
    );
}
