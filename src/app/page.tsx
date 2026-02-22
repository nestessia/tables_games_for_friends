import Header from "@/components/header";
import GameCard from "@/components/game_card";

export default async function DashboardPage() {
    const games = [
        {
            title: "Шпион",
            description: "Найди шпиона среди своих до того, как он вычислит локацию!",
            players_min: 1,
            players_max: 4,
            icon: "🕵️",
        },
        {
            title: "Имаджинариум",
            description: "Угадай карточку по ассоциации ведущего и придумай свою.",
            players_min: 2,
            players_max: 6,
            icon: "🎨",
        },
        {
            title: "Мафия",
            description: "Мирные жители против мафии — кто кого перехитрит?",
            players_min: 3,
            players_max: 8,
            icon: "🎭",
        },
    ]
    return (
        <>
        <div>
            <Header text="Table Games for friends"/>
        </div>
        <ul>
            {games.map((game) => <li><GameCard {...game} /></li>)}
        </ul>
        </>
    )
}