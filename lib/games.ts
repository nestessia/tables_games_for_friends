import dynamic from "next/dynamic";
import { ComponentType } from "react";

export type Game = {
    title: string;
    description: string;
    players_min: number;
    icon: string;
    slug: string;
};

export const games: Game[] = [
    {
        title: "Шпион",
        description: "Найди шпиона среди своих до того, как он вычислит локацию!",
        players_min: 3,
        icon: "🕵️",
        slug: "spy",
    },
    {
        title: "Alias",
        description: "Объясняй как можно больше слов и зарабатывай очки!",
        players_min: 2,
        icon: "💬",
        slug: "alias",
    },
    {
        title: "Имаджинариум",
        description: "Угадай карточку по ассоциации ведущего и придумай свою.",
        players_min: 2,
        icon: "🎨",
        slug: "imagination",
    },
    {
        title: "Мафия",
        description: "Мирные жители против мафии — кто кого перехитрит?",
        players_min: 5,
        icon: "🎭",
        slug: "mafia",
    },
];

export function getGameBySlug(slug: string): Game | undefined {
    return games.find((game) => game.slug === slug);
}


const gameComponents: Record<string, ComponentType<{ slug: string }>> = {
    spy: dynamic(() => import('@/components/games/spy')),
    mafia: dynamic(() => import('@/components/games/mafia')),
    imagination: dynamic(() => import('@/components/games/imagination')),
    alias: dynamic(() => import('@/components/games/alias')),
};

export function getGameComponent(slug: string): ComponentType<{ slug: string }> {
    return gameComponents[slug] ?? gameComponents['spy'];
}