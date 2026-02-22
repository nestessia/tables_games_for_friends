import styles from './game_card.module.css';

export type GameCardProps = {
    title: string;
    description: string;
    players_min: number;
    players_max: number;
    icon?: string;
}

export default function GameCard(props: GameCardProps) {
    return (
        <div className={styles.card}>
            {props.icon && <span className={styles.icon}>{props.icon}</span>}
            <h2 className={styles.title}>{props.title}</h2>
            <p className={styles.description}>{props.description}</p>
            <span className={styles.badge}>
                👥 {props.players_min}–{props.players_max} игроков
            </span>
        </div>
    );
}