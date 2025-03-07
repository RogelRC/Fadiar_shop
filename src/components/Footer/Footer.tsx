import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
    return (
        <>
            <div className="flex flex-wrap w-full bg-[#022953] text-white p-10 gap-10">
                <div className="flex flex-col gap-10 w-full md:w-1/2">
                    <Image
                        src={"/logo.png"}
                        alt="Fadiar Logo"
                        width={150}
                        height={150}
                    />
                </div>
                <div className="flex flex-col w-full md:w-1/4 gap-4">
                    <h1 className="font-bold text-2xl">CONTÁCTANOS</h1>
                    <span className="text-sm">+53 63513228</span>
                    <span className="text-sm">Calle 29F entre 114 y 114A, Edificio 11413
                        Ciudad Libertad, Marianao, La Habana, Cuba
                        Almacén 9A (dentro de la Empresa de Abastecimiento y Distribución de Medios para la Educación - ENAME)</span>
                    <span className="text-sm">fadiar.soporte@gmail.com</span>
                </div>
                <div className="flex flex-col w-full md:w-1/4 gap-4 items-center">
                    <h1 className="font-bold text-2xl">SÍGUENOS</h1>
                    <div className="flex space-x-5">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-800">
                            <FaFacebook size={32} />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-700">
                            <FaInstagram size={32} />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-800">
                            <FaXTwitter size={32} />
                        </a>
                    </div>
                </div>
                
                {/* Mapa agregado aquí */}
                <div className="w-full max-w-6xl mx-auto">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1588.392229538395!2d-82.43530361034315!3d23.08587264326781!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sus!4v1741330516071!5m2!1ses!2sus"
                        className="w-full h-[450px] border-0 rounded-lg"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
            
            <hr className="border-white border-t mx-4 md:mx-20" />
            <div className="text-white text-sm text-right p-2 bg-[#022953] px-4 md:px-10">
                Neon Global. v1.0 ©2024
            </div>
        </>
    );
}