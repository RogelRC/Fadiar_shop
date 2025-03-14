"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface UserData {
    name: string;
    last1: string;
    last2: string;
    addres: string;
    cell1: number;
    cell2: number | null;  // Changed from number to number | null
    ci: number;
    image: string | null;
    nextOrderCode: number;
    userId: number;
    username: string;
    email: string;
}

const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
};

const EyeIcon = ({ show }: { show: boolean }) => (
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

export default function AccountPage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        last1: "",
        last2: "",
        addres: "",
        cell1: "",
        cell2: ""
    });
    const [changingPassword, setChangingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [userError, setUserError] = useState("");
    const router = useRouter();

    const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

    useEffect(() => {
        const storedUserData = localStorage.getItem("userData");
        if (!storedUserData) {
            router.push("/login");
            return;
        }

        try {
            const parsedData = JSON.parse(storedUserData);
            setUserData(parsedData);
            setFormData({
                name: parsedData.name,
                last1: parsedData.last1,
                last2: parsedData.last2,
                addres: parsedData.addres,
                cell1: parsedData.cell1.toString(),
                cell2: parsedData.cell2?.toString()
            });
        } catch (err) {
            console.error("Error parsing user data:", err);
            router.push("/login");
        }
    }, [router]);

    const handleUserUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!userData) return;

            // Construir cadena de cambios
            const changes: string[] = [];

            // Comparar cada campo con los datos originales
            if (formData.name !== userData.name) {
                changes.push(`UPDATE,persons,${userData.ci},name,${formData.name}`);
            }
            if (formData.last1 !== userData.last1) {
                changes.push(`UPDATE,persons,${userData.ci},lastname1,${formData.last1}`);
            }
            if (formData.last2 !== userData.last2) {
                changes.push(`UPDATE,persons,${userData.ci},lastname2,${formData.last2}`);
            }
            if (formData.addres !== userData.addres) {
                changes.push(`UPDATE,persons,${userData.ci},address,${formData.addres}`);
            }
            if (formData.cell1 !== userData.cell1.toString()) {
                changes.push(`UPDATE,persons,${userData.ci},cellphone1,${formData.cell1}`);
            }
            const currentCell2 = userData.cell2?.toString() || '';
            if (formData.cell2 !== currentCell2) {
                const cell2Value = formData.cell2.trim() !== '' ? formData.cell2 : 'null';
                changes.push(`UPDATE,persons,${userData.ci},cellphone2,${cell2Value}`);
            }

            // Crear FormData y enviar
            const form = new FormData();
            form.append('ci', userData.ci.toString());
            form.append('id_user', userData.userId.toString());
            form.append('changes', changes.join('|'));

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/editUser`,
                {
                    method: "POST",
                    body: form,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al actualizar");
            }

            // Actualizar estado local
            const updatedUserData = {
                ...userData,
                name: formData.name,
                last1: formData.last1,
                last2: formData.last2,
                addres: formData.addres,
                cell1: parseInt(formData.cell1, 10),
                cell2: formData.cell2 ? parseInt(formData.cell2, 10) : null,
            };

            localStorage.setItem("userData", JSON.stringify(updatedUserData));
            setUserData(updatedUserData);  // No type error anymore
            setEditing(false);
            alert("¡Datos actualizados!");
        } catch (err) {
            setUserError(err instanceof Error ? err.message : "Error desconocido");
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError("");

        if (newPassword.length < 8) {
            setPasswordError("La contraseña debe tener al menos 8 caracteres");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordError("Las contraseñas no coinciden");
            return;
        }

        try {
            if (!userData) return;

            const form = new FormData();
            form.append('ci', userData.ci.toString());
            form.append('id_user', userData.userId.toString());
            form.append('current_password', currentPassword);
            form.append('changes', `UPDATE,users,${userData.userId},password,${newPassword}`);

            console.log(form);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/editUser`,
                {
                    method: "POST",
                    body: form,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Error al cambiar contraseña");
            }

            setNewPassword("");
            setConfirmNewPassword("");
            setChangingPassword(false);
            alert("¡Contraseña actualizada!");
        } catch (err) {
            setPasswordError(err instanceof Error ? err.message : "Error");
        }
    };

    if (!userData) {
        return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-[#022953] mb-8">
                    Mi Cuenta - Fadiar
                </h1>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Sección de Información Personal */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Información personal
                            </h3>
                            {editing ? (
                                <AnimatePresence mode="wait">
                                    <motion.form
                                        key="editForm"
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={containerVariants}
                                        onSubmit={handleUserUpdate}
                                        className="space-y-4"
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953]"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Primer apellido
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953]"
                                                value={formData.last1}
                                                onChange={(e) => setFormData({ ...formData, last1: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Segundo apellido
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953]"
                                                value={formData.last2}
                                                onChange={(e) => setFormData({ ...formData, last2: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953]"
                                                value={formData.addres}
                                                onChange={(e) => setFormData({ ...formData, addres: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Teléfono 1
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953]"
                                                value={formData.cell1}
                                                onChange={(e) => setFormData({ ...formData, cell1: e.target.value })}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Teléfono 2
                                            </label>
                                            {/* Teléfono 2 */}
                                            <input
                                                type="tel"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953]"
                                                value={formData.cell2}
                                                onChange={(e) => setFormData({ ...formData, cell2: e.target.value.replace(/\D/g, '') })}
                                                placeholder="Opcional"
                                            />
                                        </div>

                                        {userError && (
                                            <p className="text-red-500 text-sm">{userError}</p>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                className="bg-[#022953] text-white py-2 px-4 rounded-md hover:bg-[#011a3a] transition-colors"
                                            >
                                                Guardar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditing(false)}
                                                className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                                            >
                                                Cancelar
                                            </button>
                                        </div>
                                    </motion.form>
                                </AnimatePresence>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.dl
                                        key="displayInfo"
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        variants={containerVariants}
                                        className="space-y-4"
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Nombre completo
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {userData.name} {userData.last1} {userData.last2}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Carnet de identidad
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {userData.ci.toString().padStart(11, '0')}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Dirección
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {userData.addres}
                                            </dd>
                                        </div>

                                        <div>
                                            <dt className="text-sm font-medium text-gray-500">
                                                Teléfono{userData.cell2 && userData.cell2.toString() !== "null" ? "s" : ""}
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900">
                                                {userData.cell1}
                                                {userData.cell2 && userData.cell2.toString() !== "null" && ` / ${userData.cell2}`}
                                            </dd>
                                        </div>

                                        <button
                                            onClick={() => setEditing(true)}
                                            className="mt-4 bg-[#022953] text-white py-2 px-4 rounded-md hover:bg-[#011a3a] transition-colors"
                                        >
                                            Editar información
                                        </button>
                                    </motion.dl>
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Sección de Seguridad */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                Seguridad
                            </h3>
                            <div className="space-y-4">
                                {changingPassword ? (
                                    <AnimatePresence mode="wait">
                                        <motion.form
                                            key="passwordForm"
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={containerVariants}
                                            onSubmit={handlePasswordChange}
                                            className="space-y-4"
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Contraseña actual
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showCurrentPassword ? "text" : "password"}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953] pr-10"
                                                        value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    >
                                                        <EyeIcon show={showCurrentPassword} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Nueva contraseña
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showNewPassword ? "text" : "password"}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953] pr-10"
                                                        value={newPassword}
                                                        onChange={(e) => setNewPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    >
                                                        <EyeIcon show={showNewPassword} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Confirmar nueva contraseña
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showConfirmNewPassword ? "text" : "password"}
                                                        required
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#022953] pr-10"
                                                        value={confirmNewPassword}
                                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                                    >
                                                        <EyeIcon show={showConfirmNewPassword} />
                                                    </button>
                                                </div>
                                            </div>

                                            {passwordError && (
                                                <p className="text-red-500 text-sm">{passwordError}</p>
                                            )}

                                            <div className="flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="bg-[#022953] text-white py-2 px-4 rounded-md hover:bg-[#011a3a] transition-colors"
                                                >
                                                    Guardar cambios
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setChangingPassword(false)}
                                                    className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        </motion.form>
                                    </AnimatePresence>
                                ) : (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key="securityInfo"
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={containerVariants}
                                            className="space-y-4"
                                            transition={{ duration: 0.2 }}
                                        >
                                            <button
                                                onClick={() => setChangingPassword(true)}
                                                className="w-full text-left p-3 rounded-md bg-[#022953] text-white hover:bg-[#011a3a] transition-colors"
                                            >
                                                Cambiar contraseña
                                            </button>

                                            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                                                <h4 className="text-sm font-medium text-blue-800">
                                                    Datos de seguridad
                                                </h4>
                                                <dl className="mt-2 space-y-2">
                                                    <div>
                                                        <dt className="text-xs font-medium text-blue-700">
                                                            Nombre de usuario
                                                        </dt>
                                                        <dd className="text-sm text-blue-900">
                                                            {userData.username}
                                                        </dd>
                                                    </div>
                                                    {userData.email && (
                                                        <div>
                                                            <dt className="text-xs font-medium text-blue-700">
                                                                Correo
                                                            </dt>
                                                            <dd className="text-sm text-blue-900">
                                                                {userData.email}
                                                            </dd>
                                                        </div>
                                                    )}
                                                </dl>
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}