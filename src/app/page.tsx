import GameCard from "@/components/game_card";
import { games } from "@/lib/games";

export default function DashboardPage() {
    return (
        <>
        <ul>
            {games.map((game) => <li key={game.title}><GameCard {...game} /></li>)}
        </ul>
        </>
    )
}
