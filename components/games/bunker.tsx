"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
    disasters, bunkers, professions, hobbies,
    baggage as baggageList, phobias, facts,
    special_conditions, min_age, max_age,
} from "@/lib/bunker";
import { games } from "@/lib/games";

type Phase = "setup" | "catastrophe" | "dealing" | "game";

type PlayerCard = {
    age: number;
    gender: "М" | "Ж";
    profession: string;
    hobby: string;
    baggage: string;
    phobia: string;
    fact: string;
    specialCondition: string | null;
};

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateCard(): PlayerCard {
    return {
        age: Math.floor(Math.random() * (max_age - min_age + 1)) + min_age,
        gender: Math.random() > 0.5 ? "М" : "Ж",
        profession: pick(professions),
        hobby: pick(hobbies),
        baggage: pick(baggageList),
        phobia: pick(phobias),
        fact: pick(facts),
        specialCondition: Math.random() < 0.35 ? pick(special_conditions) : null,
    };
}

// ─── Types ────────────────────────────────────────────────────────────────────

type RevealedFields = {
    bio: boolean;
    profession: boolean;
    hobby: boolean;
    baggage: boolean;
    phobia: boolean;
    fact: boolean;
    specialCondition: boolean;
};

const defaultRevealed = (): RevealedFields => ({
    bio: false, profession: false, hobby: false,
    baggage: false, phobia: false, fact: false, specialCondition: false,
});

// ─── Static card row (used during dealing) ────────────────────────────────────

type CardRowProps = {
    icon: string;
    label: string;
    value: string;
    accent?: boolean;
};

function CardRow({ icon, label, value, accent = false }: CardRowProps) {
    return (
        <div className={`flex flex-col gap-0.5 p-3 rounded-xl ${accent
            ? "bg-[rgba(255,200,50,0.08)] border border-[rgba(255,200,50,0.2)]"
            : "bg-[rgba(140,100,255,0.07)] border border-[rgba(140,100,255,0.15)]"
        }`}>
            <p className={`text-xs uppercase tracking-wider font-medium ${accent ? "text-[rgba(255,200,50,0.6)]" : "text-[rgba(184,159,255,0.5)]"}`}>
                {icon} {label}
            </p>
            <p className={`text-sm font-semibold leading-snug ${accent ? "text-[rgba(255,220,80,0.95)]" : "text-[rgba(220,210,255,0.9)]"}`}>
                {value}
            </p>
        </div>
    );
}

// ─── Interactive card row (used during game — toggleable) ─────────────────────

type InteractiveCardRowProps = CardRowProps & {
    revealed: boolean;
    onToggle: () => void;
};

function InteractiveCardRow({ icon, label, value, accent = false, revealed, onToggle }: InteractiveCardRowProps) {
    return (
        <div className={`flex items-start gap-2 p-3 rounded-xl transition-all ${accent
            ? "bg-[rgba(255,200,50,0.08)] border border-[rgba(255,200,50,0.2)]"
            : "bg-[rgba(140,100,255,0.07)] border border-[rgba(140,100,255,0.15)]"
        }`}>
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
                <p className={`text-xs uppercase tracking-wider font-medium ${accent ? "text-[rgba(255,200,50,0.6)]" : "text-[rgba(184,159,255,0.5)]"}`}>
                    {icon} {label}
                </p>
                <p className={`text-sm font-semibold leading-snug break-words ${accent ? "text-[rgba(255,220,80,0.95)]" : "text-[rgba(220,210,255,0.9)]"}`}>
                    {value}
                </p>
            </div>
            <button
                onClick={onToggle}
                className={`shrink-0 mt-0.5 text-xs font-semibold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                    revealed
                        ? "bg-[rgba(80,200,120,0.15)] border-[rgba(80,200,120,0.4)] text-[rgba(100,220,140,0.9)] hover:bg-[rgba(80,200,120,0.25)]"
                        : "bg-[rgba(140,100,255,0.1)] border-[rgba(140,100,255,0.3)] text-[rgba(184,159,255,0.6)] hover:bg-[rgba(140,100,255,0.2)]"
                }`}
            >
                {revealed ? "👁 Всем" : "🙈 Скрыто"}
            </button>
        </div>
    );
}

// ─── Static character card (dealing phase) ────────────────────────────────────

type CharacterCardProps = {
    card: PlayerCard;
    playerNum: number;
};

function CharacterCard({ card, playerNum }: CharacterCardProps) {
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 mb-1">
                <p className="text-[rgba(184,159,255,0.5)] text-xs uppercase tracking-widest">
                    Карточка игрока {playerNum}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[rgba(140,100,255,0.15)] text-[#b89fff] border border-[rgba(140,100,255,0.3)]">
                    {card.gender} · {card.age} лет
                </span>
            </div>
            <CardRow icon="🎂" label="Возраст / Пол" value={`${card.gender} · ${card.age} лет`} />
            <CardRow icon="💼" label="Профессия" value={card.profession} />
            <CardRow icon="🎯" label="Хобби" value={card.hobby} />
            <CardRow icon="🎒" label="Багаж" value={card.baggage} />
            <CardRow icon="😨" label="Фобия" value={card.phobia} />
            <CardRow icon="📋" label="Факт" value={card.fact} />
            {card.specialCondition && (
                <CardRow icon="⭐" label="Особое условие" value={card.specialCondition} accent />
            )}
        </div>
    );
}

// ─── Interactive character card (game phase, with reveal toggles) ─────────────

type InteractiveCharacterCardProps = {
    card: PlayerCard;
    playerNum: number;
    revealed: RevealedFields;
    onToggle: (field: keyof RevealedFields) => void;
};

function InteractiveCharacterCard({ card, playerNum, revealed, onToggle }: InteractiveCharacterCardProps) {
    return (
        <div className="w-full flex flex-col gap-2">
            <div className="flex items-center justify-between px-1 mb-1">
                <p className="text-[rgba(184,159,255,0.5)] text-xs uppercase tracking-widest">
                    Игрок {playerNum} — твоя карточка
                </p>
            </div>
            <p className="text-[rgba(184,159,255,0.45)] text-xs text-center pb-1">
                Нажми 🙈&nbsp;Скрыто, чтобы открыть характеристику всем
            </p>
            <InteractiveCardRow icon="🎂" label="Возраст / Пол" value={`${card.gender} · ${card.age} лет`} revealed={revealed.bio} onToggle={() => onToggle("bio")} />
            <InteractiveCardRow icon="💼" label="Профессия" value={card.profession} revealed={revealed.profession} onToggle={() => onToggle("profession")} />
            <InteractiveCardRow icon="🎯" label="Хобби" value={card.hobby} revealed={revealed.hobby} onToggle={() => onToggle("hobby")} />
            <InteractiveCardRow icon="🎒" label="Багаж" value={card.baggage} revealed={revealed.baggage} onToggle={() => onToggle("baggage")} />
            <InteractiveCardRow icon="😨" label="Фобия" value={card.phobia} revealed={revealed.phobia} onToggle={() => onToggle("phobia")} />
            <InteractiveCardRow icon="📋" label="Факт" value={card.fact} revealed={revealed.fact} onToggle={() => onToggle("fact")} />
            {card.specialCondition && (
                <InteractiveCardRow icon="⭐" label="Особое условие" value={card.specialCondition} revealed={revealed.specialCondition} onToggle={() => onToggle("specialCondition")} accent />
            )}
        </div>
    );
}

// ─── Public board — revealed info of all players ──────────────────────────────

const FIELDS: { key: keyof RevealedFields; icon: string; getValue: (c: PlayerCard) => string | null }[] = [
    { key: "bio",             icon: "🧍‍♂️", getValue: c => `${c.gender} · ${c.age} лет` },
    { key: "profession",      icon: "💼", getValue: c => c.profession },
    { key: "hobby",           icon: "🎯", getValue: c => c.hobby },
    { key: "baggage",         icon: "🎒", getValue: c => c.baggage },
    { key: "phobia",          icon: "😨", getValue: c => c.phobia },
    { key: "fact",            icon: "📋", getValue: c => c.fact },
    { key: "specialCondition",icon: "⭐", getValue: c => c.specialCondition },
];

type PublicBoardProps = {
    cards: PlayerCard[];
    revealed: RevealedFields[];
    eliminated: number[];
};

function PublicBoard({ cards, revealed, eliminated }: PublicBoardProps) {
    return (
        <div className="w-full flex flex-col gap-2">
            <p className="text-[rgba(184,159,255,0.5)] text-xs uppercase tracking-widest px-1">
                📢 Участники
            </p>
            {cards.map((card, i) => {
                const isOut = eliminated.includes(i);
                const rev = revealed[i];
                const shownFields = FIELDS.filter(f => rev[f.key] && f.getValue(card));
                return (
                    <div key={i} className={`w-full rounded-xl px-3 py-2.5 flex flex-col gap-1.5 border transition-all ${
                        isOut
                            ? "bg-[rgba(220,50,50,0.07)] border-[rgba(220,80,80,0.25)] opacity-60"
                            : "bg-[rgba(30,30,46,0.6)] border-[rgba(140,100,255,0.15)]"
                    }`}>
                        <div className="flex items-center gap-2">
                            <p className={`text-xs font-bold uppercase tracking-wider ${isOut ? "text-red-400 line-through" : "text-[#b89fff]"}`}>
                                Игрок {i + 1}
                            </p>
                            {isOut && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(220,50,50,0.2)] border border-[rgba(220,80,80,0.35)] text-red-400 font-semibold">
                                    ☠️ Выгнан
                                </span>
                            )}
                        </div>
                        {!isOut && (shownFields.length === 0 ? (
                            <p className="text-[rgba(184,159,255,0.3)] text-xs italic">Ничего не раскрыто</p>
                        ) : (
                            <div className="flex flex-wrap gap-1.5">
                                {shownFields.map(f => (
                                    <span key={f.key} className="text-xs px-2 py-0.5 rounded-lg bg-[rgba(140,100,255,0.12)] border border-[rgba(140,100,255,0.2)] text-[rgba(220,210,255,0.85)]">
                                        {f.icon} {f.getValue(card)}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
}

export default function Bunker({ slug }: { slug: string }) {
    const [phase, setPhase] = useState<Phase>("setup");
    const [playersCountInput, setPlayersCountInput] = useState("");
    const [playersCount, setPlayersCount] = useState<number | null>(null);
    const [disaster, setDisaster] = useState("");
    const [bunker, setBunker] = useState("");
    const [cards, setCards] = useState<PlayerCard[]>([]);
    const [dealIndex, setDealIndex] = useState(0);
    const [isCardRevealed, setIsCardRevealed] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [viewingPlayer, setViewingPlayer] = useState<number | null>(null);
    const [isViewCardRevealed, setIsViewCardRevealed] = useState(false);
    const [revealed, setRevealed] = useState<RevealedFields[]>([]);
    const [eliminated, setEliminated] = useState<number[]>([]);

    const bunkerCapacity = playersCount ? Math.ceil(playersCount / 2) : 0;
    const min_players = games.find(game => game.slug === slug)?.players_min;

    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev !== null ? prev - 1 : null);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleConfirmPlayers = () => {
        const n = Number(playersCountInput);
        if (!n || n < 4) return;
        setPlayersCount(n);
        setDisaster(pick(disasters));
        setBunker(pick(bunkers));
        setCards(Array.from({ length: n }, generateCard));
        setRevealed(Array.from({ length: n }, defaultRevealed));
        setPhase("catastrophe");
    };

    const handleStartDealing = () => {
        setDealIndex(0);
        setIsCardRevealed(false);
        setPhase("dealing");
    };

    const handleNextPlayer = () => {
        if (dealIndex < cards.length - 1) {
            setDealIndex(i => i + 1);
            setIsCardRevealed(false);
        } else {
            setTimeLeft(15 * 60);
            setPhase("game");
        }
    };

    const handleReset = () => {
        setPhase("setup");
        setPlayersCount(null);
        setPlayersCountInput("");
        setDisaster("");
        setBunker("");
        setCards([]);
        setDealIndex(0);
        setIsCardRevealed(false);
        setTimeLeft(null);
        setViewingPlayer(null);
        setIsViewCardRevealed(false);
        setRevealed([]);
        setEliminated([]);
    };

    const toggleReveal = (playerIdx: number, field: keyof RevealedFields) => {
        setRevealed(prev => prev.map((r, i) =>
            i === playerIdx ? { ...r, [field]: !r[field] } : r
        ));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-start px-4 pb-10">
            <div className="w-full max-w-md flex flex-col items-center gap-6 pt-6">

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
                    <div className="text-6xl mb-3">☢️</div>
                    <h1 className="text-4xl font-bold text-accent-light">Бункер</h1>
                    <p className="text-accent-muted mt-1 text-sm">Убеди всех, что ты нужен человечеству</p>
                </div>

                {/* SETUP */}
                {phase === "setup" && (
                    <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-6 flex flex-col gap-4">
                        <p className="text-accent-light text-center text-lg font-semibold">Сколько игроков?</p>
                        <p className="text-[rgba(184,159,255,0.5)] text-center text-sm">Минимум {min_players} игрока</p>
                        <Input
                            placeholder={`От ${min_players} и больше`}
                            min={min_players}
                            max={20}
                            type="number"
                            size="lg"
                            value={playersCountInput}
                            onChange={(val) => setPlayersCountInput(val)}
                        />
                        <Button
                            text="Начать игру"
                            size="lg"
                            onClick={handleConfirmPlayers}
                            className="w-full"
                            disabled={!playersCountInput || Number(playersCountInput) < 4}
                        />
                    </div>
                )}

                {/* CATASTROPHE */}
                {phase === "catastrophe" && (
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(220,60,60,0.3)] rounded-2xl p-6 flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">🌍</span>
                                <p className="text-red-400 font-bold text-lg uppercase tracking-wide">Катастрофа</p>
                            </div>
                            <p className="text-[rgba(220,210,255,0.9)] text-sm leading-relaxed">{disaster}</p>
                        </div>

                        <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-6 flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">🏠</span>
                                <p className="text-[#b89fff] font-bold text-lg">Бункер</p>
                            </div>
                            <p className="text-[rgba(220,210,255,0.9)] text-sm leading-relaxed">{bunker}</p>
                            <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl bg-[rgba(140,100,255,0.1)] border border-[rgba(140,100,255,0.2)]">
                                <span className="text-base">👥</span>
                                <p className="text-[rgba(184,159,255,0.8)] text-sm">
                                    Вместимость: <span className="text-[#b89fff] font-bold">{bunkerCapacity} из {playersCount}</span> игроков
                                </p>
                            </div>
                        </div>

                        <Button
                            text="Раздать карточки →"
                            size="lg"
                            onClick={handleStartDealing}
                            className="w-full"
                        />
                        <button
                            onClick={handleReset}
                            className="text-[rgba(184,159,255,0.4)] text-sm hover:text-[#b89fff] transition-colors cursor-pointer text-center"
                        >
                            Начать заново
                        </button>
                    </div>
                )}

                {/* DEALING */}
                {phase === "dealing" && (
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-6 flex flex-col items-center gap-4">
                            <p className="text-accent-muted text-sm uppercase tracking-widest">
                                Игрок {dealIndex + 1} из {playersCount}
                            </p>

                            {!isCardRevealed ? (
                                <button
                                    onClick={() => setIsCardRevealed(true)}
                                    className="w-full rounded-xl p-8 flex flex-col items-center gap-3 bg-[rgba(140,100,255,0.08)] border border-dashed border-[rgba(140,100,255,0.35)] hover:bg-[rgba(140,100,255,0.15)] hover:border-[rgba(140,100,255,0.6)] transition-all cursor-pointer"
                                >
                                    <span className="text-4xl">🃏</span>
                                    <p className="text-[#b89fff] font-semibold text-lg">Нажми, чтобы увидеть карточку</p>
                                    <p className="text-[rgba(184,159,255,0.4)] text-xs">Убедись, что другие не смотрят</p>
                                </button>
                            ) : (
                                <CharacterCard card={cards[dealIndex]} playerNum={dealIndex + 1} />
                            )}

                            <p className="text-[rgba(184,159,255,0.35)] text-xs">Запомни карточку и передай телефон</p>
                        </div>

                        <Button
                            text={dealIndex < cards.length - 1 ? "Следующий игрок →" : "Начать обсуждение →"}
                            size="lg"
                            onClick={handleNextPlayer}
                            className="w-full"
                            disabled={!isCardRevealed}
                        />
                    </div>
                )}

                {/* GAME */}
                {phase === "game" && (
                    <div className="w-full flex flex-col gap-4">
                        <div className="w-full grid grid-cols-2 gap-3">
                            <div className="bg-[rgba(30,30,46,0.7)] border border-[rgba(220,60,60,0.3)] rounded-2xl p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-lg">🌍</span>
                                    <p className="text-red-400 font-bold text-sm uppercase tracking-wide">Катастрофа</p>
                                </div>
                                <p className="text-[rgba(220,210,255,0.8)] text-xs leading-relaxed line-clamp-4">{disaster}</p>
                            </div>

                            <div className="bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-1.5">
                                    <span className="text-lg">🏠</span>
                                    <p className="text-[#b89fff] font-bold text-sm">Бункер</p>
                                </div>
                                <p className="text-[rgba(220,210,255,0.8)] text-xs leading-relaxed line-clamp-3">{bunker}</p>
                                <div className="mt-auto pt-1 flex items-center justify-between">
                                    <span className="text-[rgba(184,159,255,0.5)] text-xs">👥 мест</span>
                                    <span className={`font-bold text-sm ${
                                        (playersCount! - eliminated.length) <= bunkerCapacity
                                            ? "text-green-400"
                                            : "text-[#b89fff]"
                                    }`}>
                                        {playersCount! - eliminated.length}/{bunkerCapacity}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Public board */}
                        {revealed.length > 0 && (
                            <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-4">
                                <PublicBoard cards={cards} revealed={revealed} eliminated={eliminated} />
                            </div>
                        )}

                        {/* View & reveal own card */}
                        {viewingPlayer === null ? (
                            <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-5 flex flex-col gap-1">
                                <p className="text-accent-light text-center text-sm font-semibold">Карточки игроков</p>
                                <p className="text-[rgba(184,159,255,0.4)] text-xs text-center">Открой данные о себе или выгоняйте игрока</p>
                                <div className="grid grid-cols-5 gap-2">
                                    {Array.from({ length: playersCount! }, (_, i) => {
                                        const isOut = eliminated.includes(i);
                                        const hasRevealed = revealed[i] && Object.values(revealed[i]).some(Boolean);
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    setViewingPlayer(i);
                                                    setIsViewCardRevealed(false);
                                                }}
                                                className={`aspect-square rounded-xl text-sm font-bold transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                                                    isOut
                                                        ? "bg-[rgba(220,50,50,0.1)] border border-[rgba(220,80,80,0.3)] text-red-400 opacity-50"
                                                        : hasRevealed
                                                        ? "bg-[rgba(80,200,120,0.12)] border border-[rgba(80,200,120,0.35)] text-[rgba(100,220,140,0.9)]"
                                                        : "bg-[rgba(140,100,255,0.1)] border border-[rgba(140,100,255,0.25)] text-[#b89fff] hover:bg-[rgba(140,100,255,0.25)] hover:border-[rgba(140,100,255,0.5)]"
                                                }`}
                                            >
                                                {isOut ? "☠️" : i + 1}
                                                {!isOut && hasRevealed && <span className="text-[8px] leading-none opacity-70">👁</span>}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full bg-[rgba(30,30,46,0.7)] border border-[rgba(140,100,255,0.2)] rounded-2xl p-5 flex flex-col gap-4">
                                {!isViewCardRevealed ? (
                                    <button
                                        onClick={() => setIsViewCardRevealed(true)}
                                        className="w-full rounded-xl p-6 flex flex-col items-center gap-3 bg-[rgba(140,100,255,0.08)] border border-dashed border-[rgba(140,100,255,0.35)] hover:bg-[rgba(140,100,255,0.15)] transition-all cursor-pointer"
                                    >
                                        <span className="text-3xl">🃏</span>
                                        <p className="text-[#b89fff] font-semibold">Показать карточку игрока {viewingPlayer + 1}</p>
                                        <p className="text-[rgba(184,159,255,0.4)] text-xs">Убедись, что другие не смотрят</p>
                                    </button>
                                ) : (
                                    <InteractiveCharacterCard
                                        card={cards[viewingPlayer]}
                                        playerNum={viewingPlayer + 1}
                                        revealed={revealed[viewingPlayer]}
                                        onToggle={(field) => toggleReveal(viewingPlayer, field)}
                                    />
                                )}
                                <button
                                    onClick={() => setViewingPlayer(null)}
                                    className="text-[rgba(184,159,255,0.4)] text-sm hover:text-[#b89fff] transition-colors cursor-pointer text-center"
                                >
                                    ← Закрыть карточку
                                </button>
                                {viewingPlayer !== null && (
                                    eliminated.includes(viewingPlayer) ? (
                                        <button
                                            onClick={() => {
                                                setEliminated(prev => prev.filter(idx => idx !== viewingPlayer));
                                            }}
                                            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[rgba(140,100,255,0.3)] bg-[rgba(140,100,255,0.08)] text-[rgba(184,159,255,0.6)] hover:bg-[rgba(140,100,255,0.15)] transition-all cursor-pointer"
                                        >
                                            ↩ Вернуть в игру
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setEliminated(prev => [...prev, viewingPlayer]);
                                                setViewingPlayer(null);
                                            }}
                                            className="w-full py-2.5 rounded-xl text-sm font-semibold border border-[rgba(220,80,80,0.4)] bg-[rgba(220,50,50,0.1)] text-red-400 hover:bg-[rgba(220,50,50,0.2)] hover:border-[rgba(220,80,80,0.6)] transition-all cursor-pointer"
                                        >
                                            ☠️ Выгнать из бункера
                                        </button>
                                    )
                                )}
                            </div>
                        )}

                        <Button
                            text="Новая игра"
                            size="lg"
                            variant="outline"
                            onClick={handleReset}
                            className="w-full"
                        />
                    </div>
                )}

            </div>
        </div>
    );
}
