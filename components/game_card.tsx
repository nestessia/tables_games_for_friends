import styles from './game_card.module.css';

export type GameCardProps = {
    title: string;
    description: string;
    players_min: number;
    icon?: string;
    slug: string;
    onClick: (slug: string) => void;
}

export default function GameCard(props: GameCardProps) {
    return (
        <div className={styles.card} onClick={() => props.onClick(props.slug)}>
            {props.icon && <span className={styles.icon}>{props.icon}</span>}
            <h2 className={styles.title}>{props.title}</h2>
            <p className={styles.description}>{props.description}</p>
            <span className={styles.badge}>
                👥 от {props.players_min} игроков
            </span>
            <button className={styles.button}>Играть</button>
        </div>
    );
}