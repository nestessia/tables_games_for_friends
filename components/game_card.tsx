"use client";

import { useRouter } from 'next/navigation';
import styles from './game_card.module.css';

export type GameCardProps = {
    title: string;
    description: string;
    players_min: number;
    icon?: string;
    slug: string;
}

export default function GameCard(props: GameCardProps) {
    const router = useRouter();

    return (
        <div className={styles.card} onClick={() => router.push(`/${props.slug}`)}>
            {props.icon && <span className={styles.icon}>{props.icon}</span>}
            <h2 className={styles.title}>{props.title}</h2>
            <p className={styles.description}>{props.description}</p>
            <span className={styles.badge}>
                👥 от {props.players_min} игроков
            </span>
            <button className={styles.button} onClick={() => router.push(`/${props.slug}`)}>Играть</button>
        </div>
    );
}
