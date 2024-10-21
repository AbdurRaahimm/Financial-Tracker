

export default function Footer() {
    return (
        <footer className="text-center p-4">
            <p>&copy; 2024-{new Date().getFullYear()} Financial Tracker build with 💚 by
                <a
                    href="https://github.com/AbdurRaahimm"
                    target="_blank"
                    className="text-green-500 underline decoration-wavy hover:text-green-600 "> Abdur Rahim
                </a>

            </p>
        </footer>
    )
}
