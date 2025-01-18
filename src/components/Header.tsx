import Image from "next/image";
import Link from "next/link";

function Header() {
    return (
        <header className="fixed top-0 w-full bg-black text-white flex items-center z-50 px-4 h-[10vh]">
            {/* Fondo con la imagen difuminada */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "url('/landscape.webp')", // Ruta a la imagen en public
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    filter: "blur(4px)", // Desenfoque de la imagen
                }}
            ></div>

            {/* Contenido del header */}
            <div className="relative flex w-full items-center z-10 h-[10vh]">
                {/* Logo */}
                <div className="flex items-center">
                    <Image
                        src="/logo.png" // Ruta del logo en la carpeta "public"
                        alt="FADIAR logo"
                        width={160}
                        height={80}
                    />
                </div>

                {/* Barra de búsqueda */}
                <div className="flex-grow mx-2 flex justify-center">
                    <div className="relative w-full md:w-1/2">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full bg-transparent border-b border-white text-white px-2 py-1 placeholder-gray-300 focus:outline-none focus:border-blue-400"
                        />
                        <button className="absolute right-0 top-1/2 transform -translate-y-1/2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="white"
                                className="w-5 h-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="flex gap-6 mx-2 font-bold">
                    <Link href="/" className="hover:text-blue-500">Inicio</Link>
                    <Link href="/productos" className="hover:text-blue-500">Productos</Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
