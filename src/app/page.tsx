"use client";

import Header from "@/components/header";
import GameCard from "@/components/game_card";
import { games } from "@/lib/games";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const handelGameClick = (slug: string) => {
        router.push(`/${slug}`);
    }

    return (
        <>
        <div>
            <Header text="Table Games for friends"/>
        </div>
        <ul >
            {games.map((game) => <li key={game.title}><GameCard {...game} onClick={handelGameClick} /></li>)}
        </ul>
        </>
    )
}