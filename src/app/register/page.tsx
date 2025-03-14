"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC } from 'react';


export default function RegisterPage() {
    const [formData, setFormData] = useState({
        ci: "",
        name: "",
        lastname1: "",
        lastname2: "",
        cellphone1: "",
        cellphon2: "",
        address: "",
        email: "", // Campo email ya presente
        username: "",
        password: "",
        type: "Cliente"
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [ciError, setCiError] = useState("");
    const router = useRouter();

    // Función para validar el CI
    const validateCI = (ci: string) => {
        const trimmedCI = ci.trim();
        if (trimmedCI.length !== 11) {
            return "El CI debe tener exactamente 11 dígitos";
        }
        if (!/^\d+$/.test(trimmedCI)) {
            return "El CI debe contener solo números";
        }
        return "";
    };

    // Manejador para cambios en el campo CI
    const handleCIChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newCI = e.target.value;
        setFormData({ ...formData, ci: newCI });
        const errorMessage = validateCI(newCI);
        setCiError(errorMessage);
    };

    const API = process.env.NEXT_PUBLIC_API;

    // Manejador para el envío del formulario
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validar el CI antes de enviar
        const ciValidationError = validateCI(formData.ci);
        if (ciValidationError) {
            setCiError(ciValidationError);
            return;
        }

        // Validar que las contraseñas coincidan
        if (formData.password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error en el registro");
            }

            // Redirigir a /verify con el email como parámetro
            router.push(`/verify?email=${formData.email}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
    };
    
    interface EyeIconProps {
        show: boolean;
    }
    // Componente para el ícono de ojo
    const EyeIcon: FC<EyeIconProps> = ({ show }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
        >
            {show ? (
                <>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </>
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
            )}
        </svg>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-[#022953]">
                    Crear cuenta
                </h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Campo CI con validación */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CI</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.ci}
                                onChange={handleCIChange}
                            />
                            {ciError && <p className="text-red-500 text-sm mt-1">{ciError}</p>}
                        </div>
                        {/* Campo Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        {/* Campo Primer Apellido */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Primer Apellido</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.lastname1}
                                onChange={(e) => setFormData({ ...formData, lastname1: e.target.value })}
                            />
                        </div>
                        {/* Campo Segundo Apellido */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Segundo Apellido</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.lastname2}
                                onChange={(e) => setFormData({ ...formData, lastname2: e.target.value })}
                            />
                        </div>
                        {/* Campo Celular 1 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Celular 1</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.cellphone1}
                                onChange={(e) => setFormData({ ...formData, cellphone1: e.target.value })}
                            />
                        </div>
                        {/* Campo Celular 2 (opcional) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Celular 2 (opcional)</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.cellphon2}
                                onChange={(e) => setFormData({ ...formData, cellphon2: e.target.value })}
                            />
                        </div>
                        {/* Campo Dirección */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>
                        {/* Campo Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
                            <input
                                type="email"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        {/* Campo Nombre de usuario */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre de usuario</label>
                            <input
                                type="text"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            />
                        </div>
                        {/* Campo Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953] pr-10"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <EyeIcon show={showPassword} />
                                </button>
                            </div>
                        </div>
                        {/* Campo Confirmar contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirmar contraseña</label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953] pr-10"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <EyeIcon show={showConfirmPassword} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#022953] text-white py-2 px-4 rounded-md hover:bg-[#011a3a] transition-colors"
                    >
                        Registrarse
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <Link href="/login" className="text-[#022953] hover:underline">
                        Iniciar sesión
                    </Link>
                </p>
            </div>
        </div>
    );
}