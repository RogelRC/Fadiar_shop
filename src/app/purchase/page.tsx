"use client";
import { useEffect, useState } from "react";

const provinciasCuba = {
    "Pinar del Río": [
        "Pinar del Río", "Consolación del Sur", "Guane", "La Palma",
        "Los Palacios", "Mantua", "Minas de Matahambre", "San Juan y Martínez",
        "San Luis", "Sandino", "Viñales"
    ],
    "Artemisa": [
        "Artemisa", "Alquízar", "Bauta", "Caimito", "Guanajay",
        "Güira de Melena", "Mariel", "San Antonio de los Baños", "Bahía Honda",
        "Candelaria", "San Cristóbal"
    ],
    "La Habana": [
        "Arroyo Naranjo", "Boyeros", "Centro Habana", "Cerro", "Cotorro", "Diez de Octubre",
        "Guanabacoa", "Habana del Este", "Habana Vieja", "La Lisa", "Marianao",
        "Playa", "Plaza de la Revolución", "Regla", "San Miguel del Padrón"
    ],
    "Mayabeque": [
        "Batabanó", "Bejucal", "Güines", "Jaruco", "Madruga",
        "Melena del Sur", "Nueva Paz", "Quivicán", "San José de las Lajas",
        "Santa Cruz del Norte"
    ],
    "Matanzas": [
        "Cárdenas", "Ciénaga de Zapata", "Colón", "Jagüey Grande", "Jovellanos",
        "Limonar", "Los Arabos", "Martí", "Matanzas", "Pedro Betancourt", "Perico",
        "Unión de Reyes"
    ],
    "Cienfuegos": [
        "Aguada de Pasajeros", "Cienfuegos", "Cruces", "Cumanayagua",
        "Lajas", "Palmira", "Rodas"
    ],
    "Villa Clara": [
        "Caibarién", "Camajuaní", "Cifuentes", "Corralillo", "Encrucijada",
        "Manicaragua", "Placetas", "Quemado de Güines", "Ranchuelo", "Remedios",
        "Sagua la Grande", "Santa Clara", "Santo Domingo"
    ],
    "Sancti Spíritus": [
        "Cabaiguán", "Fomento", "Jatibonico", "La Sierpe",
        "Sancti Spíritus", "Taguasco", "Trinidad", "Yaguajay"
    ],
    "Ciego de Ávila": [
        "Baraguá", "Bolivia", "Ciego de Ávila", "Chambas", "Ciro Redondo",
        "Florencia", "Majagua", "Morón", "Primero de Enero", "Venezuela"
    ],
    "Camagüey": [
        "Camagüey", "Carlos Manuel de Céspedes", "Esmeralda", "Florida",
        "Guaimaro", "Jimaguayú", "Minas", "Najasa", "Nuevitas", "Santa Cruz del Sur",
        "Sibanicú", "Sierra de Cubitas", "Vertientes"
    ],
    "Las Tunas": [
        "Amancio", "Colombia", "Jesús Menéndez", "Jobabo", "Las Tunas",
        "Majibacoa", "Manatí", "Puerto Padre"
    ],
    "Holguín": [
        "Antilla", "Báguanos", "Banes", "Cacocum", "Calixto García",
        "Cueto", "Frank País", "Gibara", "Holguín", "Mayarí",
        "Moa", "Rafael Freyre", "Sagua de Tánamo", "Urbano Noris"
    ],
    "Granma": [
        "Bartolomé Masó", "Bayamo", "Buey Arriba", "Campechuela",
        "Cauto Cristo", "Guisa", "Jiguaní", "Manzanillo", "Media Luna",
        "Niquero", "Pilón", "Río Cauto", "Yara"
    ],
    "Santiago de Cuba": [
        "Contramaestre", "Guamá", "Mella", "Palma Soriano", "San Luis",
        "Santiago de Cuba", "Segundo Frente", "Songo - La Maya", "Tercer Frente"
    ],
    "Guantánamo": [
        "Baracoa", "Caimanera", "El Salvador", "Guantánamo", "Imías",
        "Maisí", "Manuel Tames", "Niceto Pérez", "San Antonio del Sur", "Yateras"
    ],
    "Isla de la Juventud": [
        "Isla de la Juventud"
    ]
};

export default function Purchase() {
    const [formData, setFormData] = useState({
        provincia: "",
        municipio: "",
        address: ""
    });
    const [domicilio, setDomicilio] = useState(false);
    const [cart, setCart] = useState<any[]>([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartError, setCartError] = useState("");
    const [total, setTotal] = useState(0);

    const API = process.env.NEXT_PUBLIC_API;


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Datos enviados:", { domicilio, ...formData });
    };

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("userData") || "{}");
                if (!userData?.userId) {
                    throw new Error("Usuario no autenticado");
                }
                const response = await fetch("http://10.8.22.252:5001/obtener_productos_carrito", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id_user_action: userData.userId,
                        id_user: userData.userId,
                        comisiones: false
                    })
                });
                if (!response.ok) throw new Error("Error obteniendo carrito");
                const data = await response.json();
                setCart(data.carrito);
                const calculatedTotal = data.carrito.reduce((acc: number, item: any) =>
                    acc + (item.prices[0][1] * item.en_carrito), 0);
                setTotal(calculatedTotal);
            } catch (err) {
                setCartError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoadingCart(false);
            }
        };
        fetchCart();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-lg w-full space-y-10 p-10 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-[#022953]">
                    Verificar compra
                </h2>

                {/* Sección del Carrito */}
                <div className="bg-gray-50 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold mb-6">Resumen del Carrito</h3>

                    {loadingCart ? (
                        <p>Cargando carrito...</p>
                    ) : cartError ? (
                        <p className="text-red-500">{cartError}</p>
                    ) : cart.length === 0 ? (
                        <p>El carrito está vacío</p>
                    ) : (
                        <>
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-6 mb-6 border-b pb-6">
                                    <img
                                        src={`${API}/${item.img}`}
                                        alt={item.name}
                                        className="w-24 h-24 object-contain"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-lg">{item.brand} - {item.name}</h4>
                                        <p className="text-sm text-gray-600">Modelo: {item.model}</p>
                                        <div className="flex gap-4 mt-2">
                                            <span>Cantidad: {item.en_carrito}</span>
                                            <span>Precio unitario: ${item.prices[0][1]?.toFixed(2)}</span>
                                            <span>Total: ${(item.prices[0][1] * item.en_carrito)?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end pt-6">
                                <p className="text-xl font-bold">
                                    Total General: ${total.toFixed(2)}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Switch de Domicilio */}
                        <div className="flex items-center gap-4">
                            <label className="block text-sm font-medium text-gray-700">
                                ¿Entrega a domicilio?
                            </label>
                            <button
                                type="button"
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    domicilio ? 'bg-[#022953]' : 'bg-gray-300'
                                }`}
                                onClick={() => setDomicilio(!domicilio)}
                            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        domicilio ? 'translate-x-6' : 'translate-x-1'
                    }`}
                ></span>
                            </button>
                        </div>

                        {domicilio && (
                            <>
                                {/* Selector de Provincia */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Provincia
                                    </label>
                                    <select
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                        value={formData.provincia}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            provincia: e.target.value,
                                            municipio: ""
                                        })}
                                    >
                                        <option value="">Seleccione una provincia</option>
                                        {Object.keys(provinciasCuba).map((provincia) => (
                                            <option key={provincia} value={provincia}>
                                                {provincia}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Selector de Municipio */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Municipio
                                    </label>
                                    <select
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953] disabled:opacity-50"
                                        value={formData.municipio}
                                        onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                                        disabled={!formData.provincia}
                                    >
                                        <option value="">Seleccione un municipio</option>
                                        {formData.provincia &&
                                            provinciasCuba[formData.provincia].map((municipio) => (
                                                <option key={municipio} value={municipio}>
                                                    {municipio}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                {/* Campo de Dirección */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Dirección exacta
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-2 focus:ring-[#022953]"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Ej: Calle 5ta #1208 entre 12 y 14"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#022953] text-white py-3 px-4 rounded-md hover:bg-[#011a3a] transition-colors"
                    >
                        {domicilio ? 'Confirmar domicilio' : 'Confirmar recogida'}
                    </button>
                </form>
            </div>
        </div>
    );
}