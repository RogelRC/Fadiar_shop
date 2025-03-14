"use client";
import { useState, useEffect } from "react"; // Añade useEffect
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Efecto para redirigir si el usuario ya está logeado
    useEffect(() => {
        const userData = localStorage.getItem("userData");
        if (userData) {
            router.push("/");
        }
    }, [router]); // Ejecuta cuando el componente se monta o el router cambie

    const API = process.env.NEXT_PUBLIC_API;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { identifier, password } = formData;
            if (!identifier || !password) {
                throw new Error("Todos los campos son requeridos");
            }

            const isEmail = identifier.includes("@");
            const body = JSON.stringify({
                [isEmail ? "email" : "username"]: identifier,
                password,
                version_web: "999.999.999"
            });

            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body,
                //credentials: 'include'
            });

            const userData = await response.json(); // Parseamos una sola vez

            console.log(userData);

            if (userData?.necesita_validacion) { // Puedes omitir "=== true"
                localStorage.setItem("email", userData["email"]);
                router.push("/verify");
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error("Error de autenticación");
            }

            localStorage.setItem("userData", JSON.stringify(userData));
            router.push("/");

        } catch (err) {
            console.error("Login error:", err);
            setError("Usuario o contraseña incorrectos");
            localStorage.removeItem("userData");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-[#022953]">
                    Iniciar sesión
                </h2>

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Usuario o correo electrónico
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953] focus:border-[#022953]"
                                value={formData.identifier}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    identifier: e.target.value
                                }))}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953] focus:border-[#022953]"
                                value={formData.password}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    password: e.target.value
                                }))}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 px-4 rounded-md transition-colors font-medium ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#022953] hover:bg-[#011a3a] text-white"
                            }`}
                    >
                        {loading ? "Procesando..." : "Iniciar sesión"}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link
                        href="/register"
                        className="text-[#022953] hover:underline font-medium"
                    >
                        Regístrate ahora
                    </Link>
                </p>
                <p className="text-center text-sm text-gray-600 mt-4">
                    <Link
                        href="/recuperar"
                        className="text-[#022953] hover:underline font-medium"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </p>
            </div>
        </div>
    );
}