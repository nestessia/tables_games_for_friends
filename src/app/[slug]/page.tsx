"use client";

import { notFound } from "next/navigation";
import { getGameBySlug, GameComponents } from "@/lib/games";
import { useParams } from "next/navigation";
import { useMemo } from "react";

export default function GamePage () {
    const { slug } = useParams();
    const game = getGameBySlug(slug as string);
    const GameComponent = useMemo(() => GameComponents(slug as string), [slug]);
    if (!game) {
        notFound();
    }
    return (
        <GameComponent slug={slug as string}/>
    )
}