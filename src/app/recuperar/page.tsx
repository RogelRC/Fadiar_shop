// app/recuperar/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const router = useRouter();

    const API = process.env.NEXT_PUBLIC_API;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            if (!email) {
                throw new Error("El correo electrónico es requerido");
            }

            const response = await fetch(`${API}/recuperar_credenciales_por_correo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al procesar la solicitud");
            }

            setSuccess("Se han enviado las instrucciones a tu correo electrónico");
            setTimeout(() => router.push("/login"), 3000);

        } catch (err) {
            console.error("Recovery error:", err);
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-[#022953]">
                    Recuperar contraseña
                </h2>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                        <p className="text-green-600 text-sm text-center">{success}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953] focus:border-[#022953]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md transition-colors font-medium ${
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#022953] hover:bg-[#011a3a] text-white"
                        }`}
                    >
                        {loading ? "Enviando..." : "Recuperar contraseña"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    ¿Recuerdas tu contraseña?{" "}
                    <Link 
                        href="/login" 
                        className="text-[#022953] hover:underline font-medium"
                    >
                        Volver al login
                    </Link>
                </p>
            </div>
        </div>
    );
}