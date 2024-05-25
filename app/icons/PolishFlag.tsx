export default function PolishFlagIcon({ className }: { className?: string }) {
    return (
        <svg
            width='800'
            height='800'
            viewBox='0 0 64 64'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden
            className={className}
        >
            <path
                d='M32 2c16.6 0 30 13.4 30 30H2C2 15.4 15.4 2 32 2z'
                fill='#f9f9f9'
            />
            <path
                d='M32 62C15.4 62 2 48.6 2 32h60c0 16.6-13.4 30-30 30'
                fill='#ed4c5c'
            />
        </svg>
    )
}
