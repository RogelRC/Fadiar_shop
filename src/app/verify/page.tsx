"use client";
import {Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
    const router = useRouter();
    const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;
    const [code, setCode] = useState("");
    const [error, setError] = useState("");

    const API = process.env.NEXT_PUBLIC_API;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validar que email no sea null
        if (!email) {
            setError("El correo electrónico es requerido");
            return;
        }
    
        try {
            const response = await fetch(`${API}/email_verification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    code: code
                })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Error en la verificación");
            }
    
            router.push("/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
    };
    const handleResendCode = async () => {
        // Validar que email no sea null
        if (!email) {
            setError("El correo electrónico es requerido");
            return;
        }
    
        try {
            const response = await fetch(`${API}/resend_verification_email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify({ email: email })
            });
    
            if (!response.ok) {
                throw new Error("Error al reenviar código");
            }
    
            setError("");  // Limpiar errores anteriores
            alert("Nuevo código enviado con éxito");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-[#022953]">
                    Verifica tu cuenta
                </h2>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Código de verificación
                        </label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#022953] text-white py-2 px-4 rounded-md hover:bg-[#011a3a] transition-colors"
                    >
                        Verificar cuenta
                    </button>
                </form>
                <div className="text-center">
                    <button
                        onClick={handleResendCode}
                        className="text-sm text-[#022953] hover:underline"
                    >
                        Reenviar código
                    </button>
                </div>
            </div>
        </div>
    );
}