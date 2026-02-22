"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useState, useEffect } from "react";
import { games } from "@/lib/games";
import { spyLocations } from "@/lib/spy_locations";

const STORAGE_KEY = "spy_game_state";

export default function Spy ({slug}: {slug: string}) {
    const [playersCount, setPlayersCount] = useState<number | null>(() => {
        if (typeof window === 'undefined') return null;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;
        const parsed = JSON.parse(saved);
        return parsed.timeLeft > 0 ? parsed.playersCount : null;
    });
    const [location, setLocation] = useState<string | null>(() => {
        if (typeof window === 'undefined') return null;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;
        const parsed = JSON.parse(saved);
        return parsed.timeLeft > 0 ? parsed.location : null;
    });
    const [roles, setRoles] = useState<string[]>(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];
        const parsed = JSON.parse(saved);
        return parsed.timeLeft > 0 ? parsed.roles : [];
    });
    const [timeLeft, setTimeLeft] = useState<number | null>(() => {
        if (typeof window === 'undefined') return null;
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;
        const parsed = JSON.parse(saved);
        return parsed.timeLeft > 0 ? parsed.timeLeft : null;
    });
    const [isRoleRevealed, setIsRoleRevealed] = useState(false);
    const min_players = games.find(game => game.slug === slug)?.players_min;

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ playersCount, location, roles, timeLeft }));
    }, [playersCount, location, roles, timeLeft]);

    const handeLocationGeneration = () => {
        const randomLocation = spyLocations[Object.keys(spyLocations)[Math.floor(Math.random() * Object.keys(spyLocations).length)]];
        setLocation(randomLocation);
        handleRoles();
    }

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleRoles = () => {
        const rolesArray = Array.from({ length: playersCount as number }, (_, i) =>
            i === 0 ? "Шпион" : location as string
        );
    
        for (let i = rolesArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [rolesArray[i], rolesArray[j]] = [rolesArray[j], rolesArray[i]];
        }
    
        setRoles(rolesArray);
    }

    const handeNextPlayer = () => {
        const remaining = roles.slice(1);
        setRoles(remaining);
        setIsRoleRevealed(false);
        if (remaining.length === 0) {
            setTimeLeft(5 * 60);
        }
    }

    const handleReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        setPlayersCount(null);
        setLocation(null);
        setRoles([]);
        setTimeLeft(null);
    }

    const currentPlayer = playersCount && roles.length > 0
        ? (playersCount as number) - roles.length + 1
        : null;
    const isSpy = roles[0] === "Шпион";
    const minutes = Math.floor((timeLeft ?? 0) / 60);
    const seconds = String((timeLeft ?? 0) % 60).padStart(2, "0");
    const timerDanger = timeLeft !== null && timeLeft <= 60;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md flex flex-col items-center gap-8">

                <div className="text-center">
                    <div className="text-6xl mb-3">🕵️</div>
                    <h1 className="text-4xl font-bold text-[#e0e0f0]">Шпион</h1>
                    <p className="text-[rgba(184,159,255,0.6)] mt-1 text-sm">Найди шпиона среди своих</p>
                </div>

                {!playersCount && (
                    <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-6 flex flex-col gap-4">
                        <p className="text-[#e0e0f0] text-center text-lg">Сколько игроков?</p>
                        <p className="text-[rgba(184,159,255,0.5)] text-center text-sm">Минимум {min_players} игрока</p>
                        <Input
                            placeholder={`От ${min_players} и больше`}
                            min={min_players as number}
                            type="number"
                            size="lg"
                            onChange={(value) => setPlayersCount(Number(value))}
                        />
                    </div>
                )}

                {playersCount && !location && (
                    <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-6 flex flex-col items-center gap-4">
                        <p className="text-[#e0e0f0] text-center">
                            Игроков: <span className="text-[#b89fff] font-bold">{playersCount}</span>
                        </p>
                        <p className="text-[rgba(184,159,255,0.5)] text-sm text-center">Нажми, чтобы раздать роли и начать игру</p>
                        <Button text="Начать игру" size="lg" onClick={handeLocationGeneration} className="w-full"/>
                        <button onClick={handleReset} className="text-[rgba(184,159,255,0.4)] text-sm hover:text-[#b89fff] transition-colors cursor-pointer">
                            Изменить количество игроков
                        </button>
                    </div>
                )}

                {location && roles.length > 0 && (
                    <div className="w-full flex flex-col items-center gap-4">
                        <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-6 flex flex-col items-center gap-2">
                            <p className="text-[rgba(184,159,255,0.6)] text-sm uppercase tracking-widest">Игрок {currentPlayer} из {playersCount}</p>

                            {!isRoleRevealed ? (
                                <button
                                    onClick={() => setIsRoleRevealed(true)}
                                    className="mt-2 w-full rounded-xl p-8 flex flex-col items-center gap-3 bg-[rgba(140,100,255,0.08)] border border-dashed border-[rgba(140,100,255,0.35)] hover:bg-[rgba(140,100,255,0.15)] hover:border-[rgba(140,100,255,0.6)] transition-all cursor-pointer"
                                >
                                    <span className="text-4xl">👁️</span>
                                    <p className="text-[#b89fff] font-semibold text-lg">Нажми, чтобы увидеть роль</p>
                                    <p className="text-[rgba(184,159,255,0.4)] text-xs">Убедись, что другие не смотрят</p>
                                </button>
                            ) : (
                                <div className={`mt-2 w-full rounded-xl p-6 flex flex-col items-center gap-2 ${isSpy
                                    ? "bg-[rgba(220,50,50,0.12)] border border-[rgba(220,80,80,0.3)]"
                                    : "bg-[rgba(140,100,255,0.1)] border border-[rgba(140,100,255,0.25)]"
                                }`}>
                                    <span className="text-4xl">{isSpy ? "🕵️" : "👤"}</span>
                                    <p className={`text-xl font-bold ${isSpy ? "text-red-400" : "text-[#b89fff]"}`}>
                                        {isSpy ? "Ты шпион!" : location}
                                    </p>
                                </div>
                            )}

                            <p className="text-[rgba(184,159,255,0.4)] text-xs mt-2">Запомни свою роль и передай телефон</p>
                        </div>
                        <Button
                            text="Следующий игрок →"
                            size="lg"
                            onClick={handeNextPlayer}
                            className="w-full"
                            disabled={!isRoleRevealed}
                        />
                    </div>
                )}

                {location && roles.length === 0 && (
                    <div className="w-full flex flex-col items-center gap-4">
                        <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-6 flex flex-col items-center gap-4">
                            <p className="text-[#e0e0f0] font-semibold text-lg text-center">Все роли розданы — игра началась!</p>
                            <div className={`text-6xl font-mono font-bold tabular-nums transition-colors ${timerDanger ? "text-red-400" : "text-[#b89fff]"}`}>
                                {minutes}:{seconds}
                            </div>
                            {timerDanger && timeLeft !== 0 && (
                                <p className="text-red-400 text-sm animate-pulse">Время заканчивается!</p>
                            )}
                        </div>
                        <Button text="Новая игра" size="lg" variant="outline" onClick={handleReset} className="w-full"/>
                    </div>
                )}

                {timeLeft === 0 && location && (
                    <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(220,80,80,0.3)] rounded-2xl p-6 flex flex-col items-center gap-4">
                        <span className="text-5xl">⏰</span>
                        <p className="text-red-400 font-bold text-xl text-center">Время вышло!</p>
                        <p className="text-[rgba(184,159,255,0.6)] text-sm text-center">Голосуйте — кто шпион?</p>
                        <Button text="Начать заново" size="lg" onClick={handleReset} className="w-full"/>
                    </div>
                )}

            </div>
        </div>
    )
}
