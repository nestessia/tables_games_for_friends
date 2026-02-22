"use client";

import { notFound } from "next/navigation";
import { getGameBySlug} from "@/lib/games";
import { useParams } from "next/navigation";
import { GameComponents } from "@/lib/games";

export default function GamePage () {
    const { slug } = useParams();
    const game = getGameBySlug(slug as string);
    const GameComponent = GameComponents(slug as string);
    if (!game) {
        notFound();
    }
    return (
        <GameComponent slug={slug as string} autoSize={true}/>
    )
}