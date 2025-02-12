import Image from "next/image";
import Link from "next/link";
import {FaFacebook, FaInstagram} from "react-icons/fa";
import {FaXTwitter} from "react-icons/fa6";

export default function Footer(){
    return(
        <>
            <div className={"flex w-full h-[40vh] bg-[#022953] text-white p-10 gap-10"}>
                <div className={"flex flex-col gap-10 w-1/2"}>
                    <Image
                        src={"/logo.png"}
                        alt="Fadiar Logo"
                        width={150}
                        height={150}
                    />
                    <p className={"text-sm"}>
                        En este texto se debe explicar brevemente la empresa, cual es su finalidad, los servicios más importantes que se ofrecen, entre otras cuestiones la la la.
                    </p>
                </div>
                <div className={"flex flex-col w-1/4 gap-4 ml-20"}>
                    <h1 className={"font-bold text-2xl"}>CONTÁCTANOS</h1>
                    <span className={"text-sm"}>+53 5XXXXXXX</span>
                    <span className={"text-sm"}>Direccion ficticia 4 Atlantic Ave. Brooklyn, NY 11 201. Ecco Spa.</span>
                    <span className={"text-sm"}>test@gmail.com</span>
                </div>
                <div className={"flex flex-col w-1/4 gap-4 items-center"}>
                    <h1 className={"font-bold text-2xl"}>SÍGUENOS</h1>
                    <div className="flex space-x-5">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-blue-800">
                            <FaFacebook size={32} />
                        </a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-pink-700">
                            <FaInstagram size={32} />
                        </a>
                        <a href="https://x.com/" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-800">
                            <FaXTwitter size={32} />
                        </a>
                    </div>
                </div>
            </div>
            <hr className="border-white border-t mx-20" /> {/* Línea blanca con padding */}
            <div className="text-white text-sm text-right p-2 bg-[#022953] px-10">
                Neon Global. v1.0 ©2024
            </div>
        </>
    )
}
