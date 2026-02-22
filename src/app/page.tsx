import Header from "@/components/header";
import GameCard from "@/components/game_card";
import { games } from "@/lib/games";

export default function DashboardPage() {
    return (
        <>
        <div>
            <Header text="Table Games for friends"/>
        </div>
        <ul>
            {games.map((game) => <li key={game.title}><GameCard {...game} /></li>)}
        </ul>
        </>
    )
}
