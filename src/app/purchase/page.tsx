"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
} as const;

type ProvinciaKey = keyof typeof provinciasCuba;

function isValidProvincia(key: string): key is ProvinciaKey {
    return key in provinciasCuba;
}

const storedUserData = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
const parsedData = storedUserData ? JSON.parse(storedUserData) : null;

export default function Purchase() {
    const router = useRouter();

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
    const [targetCurrency, setTargetCurrency] = useState("USD");
    const [exchangeRates, setExchangeRates] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const API = process.env.NEXT_PUBLIC_API;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUserData = localStorage.getItem("userData");
            if (storedUserData) {
                const parsedData = JSON.parse(storedUserData);
                setFormData(prevState => ({
                    ...prevState,
                    address: parsedData.addres || ""
                }));
            }
        }
    }, []);


    interface CartItem {
        id: number;
        brand: string;
        name: string;
        model: string;
        en_carrito: number;
        prices: Array<[number, number, string]>;
        convertedPrice?: number;
        convertedCurrency?: string;
    }


    const handleBuy = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");

            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/add_order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id_user_action: userData.userId,
                    gestor_id: userData.userId,
                    ci_cliente: userData.ci,
                    name_cliente: userData.name,
                    last_names: `${userData.last1} ${userData.last2}`,
                    cellphone_cliente: userData.cell1,
                    order_code: userData.nextOrderCode,
                    provincia: formData.provincia === null || formData.provincia === "" ? null : formData.provincia,
                    municipio: formData.municipio === null || formData.municipio === "" ? null : formData.municipio,
                    direccionExacta: formData.address === null || formData.address === "" ? null : formData.address
                }),
            });

            const data = await response.json();

            console.log(data);

            if (!response.ok) {
                throw new Error(data.message || "Error al comprar");
            }

            // Actualizamos el userData con el nuevo nextOrderCode y lo guardamos en localStorage
            const updatedUserData = { ...userData, nextOrderCode: data.nextOrderCode };
            localStorage.setItem("userData", JSON.stringify(updatedUserData));


            router.push("/products");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        }
    };


    useEffect(() => {
        const fetchCart = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem("userData") || "{}");
                if (!userData?.userId) throw new Error("Usuario no autenticado");

                const response = await fetch(`${API}/obtener_productos_carrito`, {
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

                // Obtener tasas de cambio
                const rates = data.monedas[0].currencys;
                setExchangeRates(rates);

                // Determinar moneda objetivo
                let countryCode = "US";
                try {
                    const locationRes = await fetch("https://ipapi.co/json/");
                    const locationData = await locationRes.json();
                    countryCode = locationData.country_code;
                } catch (err) {
                    console.error('Error fetching cart:', err);
                    setCartError(
                        err instanceof Error ?
                            `Error cargando carrito: ${err.message}` :
                            'Error desconocido al cargar el carrito'
                    );
                    setCart([]); // Asegurar estado limpio
                }

                const newCurrency = countryCode === "CU" ? "CUP" : "USD";
                setTargetCurrency(newCurrency);

                // Procesar carrito con conversiones
                // Modifica el cálculo de precios en el useEffect:
                const processedCart = (data.carrito || []).map((item: any) => {
                    // Añade validación para precios
                    const originalPrice = item.prices?.[0]?.[1] || 0;
                    const originalCurrency = item.prices?.[0]?.[2] || "USD";

                    // Validación adicional para tasas de cambio
                    const originRate = rates.find((c: any) => c.currency === originalCurrency)?.value || 1;
                    const targetRate = rates.find((c: any) => c.currency === newCurrency)?.value || 1;

                    return {
                        ...item,
                        convertedPrice: Number((originalPrice / originRate * targetRate).toFixed(2)),
                        convertedCurrency: newCurrency
                    };
                });

                setCart(processedCart || []); // Asegurar array vacío si es undefined


                // Calcular total
                const newTotal = (processedCart || []).reduce(
                    (acc: number, item: any) => acc + (item.convertedPrice * (item.en_carrito || 0)),
                    0
                );
                setTotal(Number(newTotal.toFixed(2)));

            } catch (err) {
                setCartError(err instanceof Error ? err.message : "Error desconocido");
            } finally {
                setLoadingCart(false);
            }
        };
        fetchCart();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#f7fafc] to-[#e2e8f0] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="px-8 py-12 sm:p-16 space-y-12">
                    <h2 className="text-4xl font-extrabold text-center text-[#022953]">
                        🛒 Verificar Compra
                    </h2>

                    {/* Cart Section */}
                    <div className="bg-gray-50 p-6 rounded-xl shadow-inner">
                        <h3 className="text-2xl font-bold mb-8 text-gray-700 border-b pb-4">Resumen del Carrito</h3>

                        {loadingCart ? (
                            <div className="flex justify-center items-center h-32">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#022953]"></div>
                            </div>
                        ) : cartError ? (
                            <div className="text-red-600 bg-red-50 p-4 rounded-lg">{cartError}</div>
                        ) : cart.length === 0 ? (
                            <div className="text-center text-gray-500 py-8">Tu carrito está vacío</div>
                        ) : (
                            <>
                                <div className="space-y-8">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex flex-col sm:flex-row items-start gap-6 p-6 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <img
                                                src={`${API}/${item.img}`}
                                                alt={item.name}
                                                className="w-full sm:w-32 h-32 object-contain bg-white p-4 rounded-lg border"
                                            />
                                            <div className="flex-1 w-full">
                                                <h4 className="text-lg font-semibold text-gray-800">{item.brand} - {item.name}</h4>
                                                <p className="text-sm text-gray-600 mb-2">Modelo: {item.model}</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-600">Cantidad:</span>
                                                        <span className="ml-2 font-medium">{item.en_carrito}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-gray-600">Precio:</span>
                                                        <span className="ml-2 font-medium">{item.convertedPrice} {targetCurrency}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <span className="text-gray-600">Total:</span>
                                                        <span className="ml-2 font-medium text-[#022953]">
                                                            {(item.convertedPrice * item.en_carrito).toFixed(2)} {targetCurrency}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xl font-bold text-gray-700">Total General:</span>
                                        <span className="text-2xl font-extrabold text-[#022953]">
                                            {total.toFixed(2)} {targetCurrency}
                                        </span>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Shipping Form */}
                    <form className="space-y-8">
                        <div className="space-y-8">
                            {/* Delivery Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <h4 className="text-lg font-medium text-gray-700">Entrega a domicilio</h4>
                                    <p className="text-sm text-gray-500">¿Necesitas que te llevemos los productos?</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={domicilio}
                                    onChange={(e) => setDomicilio(e.target.checked)}
                                    className="form-checkbox h-4 w-4 text-blue-600 transition duration-200 rounded focus:ring-blue-500"
                                />
                            </div>

                            {/* Location Selectors */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#022953] focus:border-[#022953] transition-all"
                                        value={formData.provincia || ""}
                                        onChange={(e) => setFormData({ ...formData, provincia: e.target.value, municipio: "" })}
                                    >
                                        <option value="">Selecciona una provincia</option>
                                        {Object.keys(provinciasCuba).map((provincia) => (
                                            <option key={provincia} value={provincia}>{provincia}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Municipio</label>
                                    <select
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#022953] focus:border-[#022953] transition-all disabled:opacity-50"
                                        value={formData.municipio || ""}
                                        onChange={(e) => setFormData({ ...formData, municipio: e.target.value })}
                                        disabled={!formData.provincia}
                                    >
                                        <option value="">Selecciona un municipio</option>
                                        {formData.provincia &&
                                            provinciasCuba[formData.provincia as keyof typeof provinciasCuba].map((municipio) => (
                                                <option key={municipio} value={municipio}>{municipio}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            {domicilio && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Dirección exacta</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#022953] focus:border-[#022953] placeholder-gray-400 transition-all"
                                        placeholder="Ej: Calle 5ta #1208 entre 12 y 14"
                                        value={formData.address || ""}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleBuy}
                            className="w-full py-4 px-6 bg-gradient-to-r from-[#022953] to-[#04518C] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform transition hover:scale-[1.02] duration-200"
                        >
                            {domicilio ? '🚚 Confirmar Entrega' : '🏪 Confirmar Recogida'}
                        </button>

                        {error && (
                            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}