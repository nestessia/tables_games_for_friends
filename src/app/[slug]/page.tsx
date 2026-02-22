import { notFound } from "next/navigation";
import { getGameBySlug, getGameComponent } from "@/lib/games";

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    if (!getGameBySlug(slug)) notFound();
    const GameComponent = getGameComponent(slug);
    return <GameComponent slug={slug} />;
}
