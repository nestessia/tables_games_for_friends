"use client";


import Link from "next/link";
import { useState, useEffect } from "react";
import Range from "@/components/range";
import Input from "@/components/input";
import Button from "@/components/button";
import { aliasWords } from "@/lib/alias_words";
import Checkbox from "@/components/checkbox";

export default function Alias ({slug}: {slug: string}) {
    // Список команд с именем и счётом
    const [teams, setTeams] = useState<{ name: string; score: number }[]>([]);

    // Индекс команды, которая сейчас ходит
    const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

    // Текущее слово для угадывания
    const [currentWord, setCurrentWord] = useState<string | null>(null);

    // Фазы игры
    const [phase, setPhase] = useState<typeof gamePhases[number]>("setup_commands");

    // Таймер раунда (в секундах)
    const [timeLeft, setTimeLeft] = useState<number | null>(null);

    // Слова угаданные за текущий раунд (чтобы показать итоги раунда)
    const [roundWords, setRoundWords] = useState<{ word: string; guessed: boolean }[]>([]);

    const [words, setWords] = useState<string[]>([]);

    // Название команды
    const [teamName, setTeamName] = useState<string>("");

    const [winner, setWinner] = useState<string | null>(null);

    const wordsAlias = aliasWords;

    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
    const [selectedPointsToWin, setPointsToWin] = useState<number>();
    const [selectedTimer, setTimer] = useState<number>();
    const toggleCategory = (key: string) => {
        setSelectedCategories(prev => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    const gamePhases = ["setup_commands", "setup_words", "setup_game", "pre-playing", "playing", "roundEnd", "gameOver"];
    
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev !== null ? prev - 1 : null));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    useEffect(() => {
        if (timeLeft === 0 && phase === "playing") {
            setPhase("roundEnd");
        }
    }, [timeLeft, phase]);

    // Добавить команду
    const handleAddTeam = (name: string) => {
        setTeams([...teams, { name: name, score: 0 }]);
    }

    const handleRemoveTeam = (name: string) => {
        setTeams(teams.filter((team) => team.name !== name));
    }

    const handlechangeGamePhase = (phase: typeof gamePhases[number]) => {
        setPhase(phase);
    }

    const hadleAddPoint = (point: number, teamIndex: number) => {
        const newTeams = teams.map((team, i) =>
            i === teamIndex ? { ...team, score: team.score + point } : team
        );
        setTeams(newTeams);
        const newScore = newTeams[teamIndex].score;
        if (selectedPointsToWin !== undefined && newScore >= selectedPointsToWin) {
            setWinner(newTeams[teamIndex].name);
            setPhase("gameOver");
        }
    }

    const handleNextRound = () => {
        const nextIndex = (currentTeamIndex + 1) % teams.length;
        setCurrentTeamIndex(nextIndex);
        setRoundWords([]);
        setPhase("pre-playing");
    }

    const getRandomWord = () => {
        return words[Math.floor(Math.random() * words.length)];
    }

    const handleNewGame = () => {
        setTeams(teams.map(team => ({ ...team, score: 0 })));
        setCurrentTeamIndex(0);
        setCurrentWord(null);
        setRoundWords([]);
        setTimeLeft(null);
        setWinner(null);
        setPhase("pre-playing");
    }

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

            {phase === "setup_commands" && (
                <>
                <div className="text-center">
                    <div className="text-6xl mb-3">💬</div>
                    <h1 className="text-4xl font-bold text-accent-light">Alias</h1>
                    <p className="text-accent-muted mt-1 text-sm">Создайте команды для начала игры</p>
                </div>

                <div className="flex flex-col gap-2 w-full">
                {teams.map((team, index) => (
                    <div key={index} className="rounded-lg border text-card-foreground shadow-sm p-4 bg-card border-border w-full">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                                <p className="text-accent-muted text-xs">Команда {index + 1}</p>
                                <p className="text-lg font-semibold text-accent-light truncate">{team.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => handleRemoveTeam(team.name)} className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-10 w-10 text-destructive hover:text-destructive hover:bg-destructive/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash2 w-5 h-5">
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line x1="10" x2="10" y1="11" y2="17" />
                                        <line x1="14" x2="14" y1="11" y2="17" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                
                <div className="rounded-lg text-card-foreground shadow-sm p-4 bg-card/50 border-dashed border-2 border-border w-full flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <Input type="text" placeholder="Название команды" size="lg" value={teamName} onChange={(value) => {setTeamName(value)}}/>
                        </div>
                    </div>
                    <Button text=" + Добавить команду" size="lg" onClick={() => { handleAddTeam(teamName); setTeamName(""); }} className="w-full"/>
                </div>

                <>
                    <Button text="Продолжить" size="lg" onClick={() => { handlechangeGamePhase("setup_words") }} disabled={teams.length < 2} className="w-full"/>
                </>
            </>
    )}
    {phase === "setup_words" && (
        <>
        <div className="space-y-4 w-full">
            {Object.entries(wordsAlias).map(([key, category]) => (
                <div key={key} className="rounded-lg bg-card text-card-foreground shadow-sm p-5 transition-all border border-accent-border hover:border-accent/60">
                    <div className="flex items-start gap-4">
                        <Checkbox checked={selectedCategories.has(key)} onChange={() => toggleCategory(key)} />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open w-5 h-5 text-accent-foreground"><path d="M12 7v14"></path><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path></svg>
                                <h3 className="text-xl font-bold">{key}</h3>
                            </div>
                                <p className="text-muted-foreground mb-2">{category.description}</p>
                                <p className="text-sm text-muted-foreground">Слов в наборе: <span className="font-semibold text-foreground">{category.words.length}</span></p>
                            </div>
                    </div>
                </div>
            ))}
        </div>
        <div className="w-full flex gap-2">
            <Button text="Назад" size="lg" onClick={() => { handlechangeGamePhase("setup_commands") }} disabled={teams.length < 2} className="w-full" variant="outline" />
            <Button text="Начать игру" size="lg" onClick={() => { handlechangeGamePhase("setup_game") }} disabled={ (selectedCategories.size === 0) } className="w-full"/>
        </div>
        {(selectedCategories.size === 0) && <p className="text-accent-muted text-sm">Выберите хотя бы одну категорию</p>}
        </>
    )}
    {phase === "setup_game" && (
        <div className="space-y-4 w-full">
            <div className="space-y-4">
                <div className="rounded-lg border text-card-foreground shadow-sm p-6 bg-card border-border space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(107,65,231,0.15)] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(140,100,255)" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                <path d="M4 22h16"></path>
                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">Очков для победы</h3>
                                <p className="text-sm text-muted-foreground">Сколько очков нужно набрать</p>
                            </div>
                            <p className="text-3xl font-bold">{selectedPointsToWin}</p>
                        </div>
                    </div>
                <Range min={10} max={200} step={10} onChange={(value) => setPointsToWin(value)}></Range>
                </div>
            </div>
            <div className="space-y-4">
                <div className="rounded-lg border text-card-foreground shadow-sm p-6 bg-card border-border space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(107,65,231,0.15)] flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgb(140,100,255)" strokeWidth="2" strokeLinecap="round">
                                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                <path d="M4 22h16"></path>
                                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">Время раунда</h3>
                                <p className="text-sm text-muted-foreground">Длительность в секундах</p>
                            </div>
                            <p className="text-3xl font-bold">{selectedTimer}</p>
                        </div>
                    </div>
                <Range min={10} max={200} step={10} onChange={(value) => setTimer(value)}></Range>
                </div>
            </div>
        <div className="w-full flex gap-2">
            <Button text="Назад" size="lg" onClick={() => { handlechangeGamePhase("setup_words") }} disabled={teams.length < 2} className="w-full" variant="outline" />
            <Button text="Начать игру" size="lg" onClick={() => {
                const allWords = Array.from(selectedCategories).flatMap(key => wordsAlias[key]?.words ?? []);
                setWords(allWords);
                setCurrentTeamIndex(0);
                handlechangeGamePhase("pre-playing");
            }} disabled={ (selectedCategories.size === 0) } className="w-full"/>
        </div>
        </div>
    )}
    {phase === "pre-playing" && (
        <div className="w-full space-y-4">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8 bg-gradient-to-br from-primary/20 to-accent/20 border-primary">
                <div className="text-center space-y-4">
                    <p className="text-muted-foreground text-lg">Следующий раунд играет</p>
                    <div className="flex items-center justify-center gap-4">
                        <h1 className="text-4xl md:text-5xl font-bold">{teams[currentTeamIndex].name}</h1>
                    </div>
                    <Button text="▶ Начать раунд" size="lg" onClick={() => { handlechangeGamePhase("playing"); setCurrentWord(getRandomWord()); setTimeLeft(selectedTimer ?? null) }} className="w-full"/>
                </div>
            </div>
            <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <span className="font-semibold">Счёт команд • До {selectedPointsToWin} очков</span>
                    </div>
                {teams.map((team, index) => (
                    <div key={index} className={`rounded-lg text-card-foreground shadow-sm p-4 transition-all border-2 border-accent-border bg-card"}`}>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-lg">{team.name}</h3>
                                    <span className="text-2xl font-bold text-accent-foreground">{team.score}</span>
                                </div>
                                <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden border border-accent-border">
                                    <div
                                        className="h-full bg-accent transition-all duration-500"
                                        style={{ width: `${Math.min((team.score / (selectedPointsToWin ?? 1)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )}
    {phase === "playing" && (
        <div className="w-full mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div>
                        <h2 className="text-xl font-bold">{teams[currentTeamIndex].name}</h2>
                        <p className="text-sm text-muted-foreground">{teams[currentTeamIndex].score} угадано</p>
                    </div>
                </div>
            </div>
            <div className="rounded-lg border text-card-foreground shadow-sm p-6 bg-card border-border">
                <div className="space-y-4">
                    <div className="text-center">
                        <div className="text-7xl md:text-8xl font-bold text-destructive animate-pulse">{timeLeft}</div>
                        <p className="text-muted-foreground mt-2">секунд осталось</p>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
                        <div className="h-full transition-all duration-1000 bg-destructive"></div>
                    </div>
                </div>
            </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-12 bg-gradient-to-br from-primary/20 to-accent/20 border-primary text-center">
            <div className="text-4xl md:text-6xl font-bold leading-tight">{currentWord}</div>
        </div>
            <div className="grid grid-cols-2 gap-4">
            <Button text=" ❌ Пропустить" size="lg" className="bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 hover:shadow-none" onClick={() => { setCurrentWord(getRandomWord()); setRoundWords([{word: currentWord ?? "", guessed: false }])}}/>
            <Button text=" ✅ Угадали" size="lg" className="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 hover:shadow-none" onClick={() => { hadleAddPoint(1, currentTeamIndex); setCurrentWord(getRandomWord()); setRoundWords([{word: currentWord ?? "", guessed: true }]) }}/>
            </div>
        </div>
                
    )}
    {timeLeft === 0 && phase === "roundEnd" && (
        <div className="rounded-lg border shadow-sm p-8 bg-card border-border text-center space-y-6 w-full">
            <div className="text-6xl">⏰</div>
            <h2 className="text-3xl font-bold">Время вышло!</h2>
            <p className="text-xl text-muted-foreground">Закончите объяснять текущее слово</p>
            <div className="text-4xl font-bold py-6 px-8 bg-gray-900 rounded-2xl">{currentWord}</div>
            <div className="grid grid-cols-2 gap-4">
                <Button text=" ❌ Пропустить" size="lg" className="bg-red-500 border-red-500 hover:bg-red-600 hover:border-red-600 hover:shadow-none" onClick={() => { setRoundWords(prev => [...prev, { word: currentWord ?? "", guessed: false }]); handleNextRound(); }}/>
                <Button text=" ✅ Угадали" size="lg" className="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600 hover:shadow-none" onClick={() => { hadleAddPoint(1, currentTeamIndex); setRoundWords(prev => [...prev, { word: currentWord ?? "", guessed: true }]); handleNextRound(); }}/>
            </div>
        </div>
    )}
    {phase === "gameOver" && (
        <div className="rounded-lg border text-card-foreground shadow-sm p-8 bg-card border-accent text-center space-y-6 w-full">
            <div className="text-7xl">🏆</div>
            <div className="space-y-2">
                <p className="text-muted-foreground text-lg">Победитель</p>
                <h1 className="text-4xl md:text-5xl font-bold text-accent-foreground">{winner}</h1>
            </div>
            <div className="space-y-2 w-full">
                {teams.sort((a, b) => b.score - a.score).map((team, index) => (
                    <div key={index} className={`flex items-center justify-between px-4 py-3 rounded-xl ${team.name === winner ? "bg-accent-subtle border border-accent-border" : "bg-muted"}`}>
                        <span className="font-semibold">{team.name}</span>
                        <span className="text-xl font-bold text-accent-foreground">{team.score}</span>
                    </div>
                ))}
            </div>
            <Button text="🔄 Начать новую игру" size="lg" onClick={handleNewGame} className="w-full"/>
        </div>
    )}
    </div>
</div>)}
