interface buttonProps {
    text: string
    color: string
    className?: string
    onClick?: () => void
}
export default function Button(props: buttonProps) {


    return (
        <>
        <button onClick={props.onClick}  className={`${props.color} hover:bg-blue-600 text-white px-4 py-2 rounded-full ${props.className ?? ''}`}>
            {props.text}
        </button>

     
        </>
    )
}