export type HeaderProps = {
    text: string;
    className?: string;
}

export default function Header( props: HeaderProps ) {
    return (
        <header>
            <h1 className={props.className}>{props.text}</h1>
        </header>
    )
}