"use client";

import Header from "@/components/header";
import GameCard from "@/components/game_card";
import { useState } from "react";
import { games } from "@/lib/games";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const router = useRouter();
    const handelGameClick = (slug: string) => {
        setSelectedGame(slug);
        router.push(`/${slug}`);
    }

    return (
        <>
        {selectedGame && <div>
            <Header text={selectedGame} />
        </div>}
        <div>
            <Header text="Table Games for friends"/>
        </div>
        <ul >
            {games.map((game) => <li key={game.title}><GameCard {...game} onClick={handelGameClick} /></li>)}
        </ul>
        </>
    )
}